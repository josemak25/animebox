const core = require("@actions/core");
const github = require("@actions/github");

/**
 * @file auto-request-copilot.js
 * @description
 * GitHub Actions script to automatically request GitHub Copilot as a reviewer on pull requests.
 * Ensures Copilot is only requested once per PR, and posts an informational comment.
 * If Copilot cannot be requested, posts a fallback comment with manual instructions.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN in env.
 * Main execution block for requesting Copilot as a reviewer.
 * Handles duplicate requests, error fallback, and PR commenting.
 */
(async () => {
  try {
    // Retrieve GitHub token from environment
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN not set");
    }

    // Initialize Octokit client and PR context
    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const pull_number = github.context.payload.pull_request.number;

    try {
      // Check if Copilot is already a reviewer to avoid duplicate requests
      const { data: reviews } = await octokit.rest.pulls.listRequestedReviewers(
        {
          owner,
          repo,
          pull_number,
        }
      );
      const copilotAlreadyRequested = reviews.users.some(
        (user) => user.login === "github-copilot" || user.login === "copilot"
      );

      if (!copilotAlreadyRequested) {
        // Request Copilot as reviewer for automated code review
        await octokit.rest.pulls.requestReviewers({
          owner,
          repo,
          pull_number,
          reviewers: ["github-copilot"],
        });
        core.info("✅ Successfully requested Copilot as reviewer");
        // Add informational comment to PR about automated Copilot review
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: pull_number,
          body: "🤖 **Copilot has been automatically requested as a reviewer**\n\nCopilot will review this PR based on our project standards and guidelines defined in `.github/copilot-instructions.md`.\n\n---\n*This is an automated action. Copilot reviews help maintain code quality and consistency.*",
        });
      } else {
        // Info: Copilot already assigned, skipping duplicate request
        core.info("ℹ️ Copilot is already requested as a reviewer");
      }
    } catch (error) {
      // Error: Failed to request Copilot reviewer - log for debugging
      core.error("Error requesting Copilot reviewer: " + error.message);
      try {
        // Fallback: Add explanatory comment when automatic reviewer assignment fails
        await octokit.rest.issues.createComment({
          owner,
          repo,
          issue_number: pull_number,
          body: "🤖 **Copilot Auto-Review Setup**\n\nTo enable automatic Copilot reviews:\n\n1. Go to Repository Settings → General → Pull Requests\n2. Enable 'Automatically request reviews from owners of the code being changed'\n3. Or manually request `@github-copilot` as a reviewer\n\n---\n*Copilot reviews are configured via `.github/copilot-instructions.md`*",
        });
      } catch (commentError) {
        // Error: Failed to add fallback comment - log for debugging
        core.error("Error adding fallback comment: " + commentError.message);
      }
    }
  } catch (error) {
    // Fail the workflow if any error occurs
    core.setFailed(error.message);
  }
})();
