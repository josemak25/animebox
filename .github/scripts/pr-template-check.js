const core = require("@actions/core");
const github = require("@actions/github");

/**
 * @file pr-template-check.js
 * @description
 * GitHub Actions script to check PR description and title for compliance with the required PR template.
 * Posts a comment if the PR is missing required sections or is not properly formatted.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN in env.
 * Main execution block for PR template compliance check.
 * Checks for required sections, checkboxes, and proper title.
 * Posts a comment if compliance is low.
 */
(async () => {
  try {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN not set");
    }

    const octokit = github.getOctokit(token);
    const { owner, repo } = github.context.repo;
    const pull_number = github.context.payload.pull_request.number;
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
    });

    const body = pr.body || "";
    const title = pr.title || "";

    // Check for required PR template sections and formatting
    const templateChecks = {
      hasDescription:
        body.includes("## 📋 Description") || body.includes("Description"),
      hasTypeOfChange:
        body.includes("## 📄 Type of Change") ||
        body.includes("Type of Change"),
      hasTesting: body.includes("## 🧪 Testing") || body.includes("Testing"),
      hasChecklist:
        body.includes("## ✅ Checklist") || body.includes("Checklist"),
      hasCheckboxes: body.includes("- [ ]") || body.includes("- [x]"),
      hasProperTitle:
        title.length > 10 && !title.includes("WIP") && !title.includes("Draft"),
    };

    const complianceScore =
      Object.values(templateChecks).filter(Boolean).length;
    const totalChecks = Object.keys(templateChecks).length;
    core.info("📋 PR Template Compliance:");
    core.info(`  Score: ${complianceScore}/${totalChecks}`);
    Object.entries(templateChecks).forEach(([check, passed]) => {
      core.info(`  ${check}: ${passed ? "✅" : "❌"}`);
    });

    // If compliance is low, post a comment to the PR
    if (complianceScore < 4) {
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: `## 📋 PR Template Compliance Alert\n\n**Compliance Score: ${complianceScore}/${totalChecks} (${Math.round((complianceScore / totalChecks) * 100)}%)**\n\nMissing sections:\n${Object.entries(
          templateChecks
        )
          .filter(([_, passed]) => !passed)
          .map(
            ([check, _]) =>
              `- ${check.replace(/([A-Z])/g, " $1").toLowerCase()}`
          )
          .join(
            "\n"
          )}\n\nPlease update your PR description to include all required sections from the template for better review quality.\n\n---\n*This helps reviewers understand your changes better and ensures consistent PR quality.*`,
      });
    }
  } catch (error) {
    core.error("Error checking PR template compliance: " + error.message);
  }
})();
