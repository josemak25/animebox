const core = require("@actions/core");
const github = require("@actions/github");

/**
 * @file quality-gate-block.js
 * @description
 * GitHub Actions script to block PR merge if automated quality checks fail.
 * Posts a blocking comment with required actions if issues are found, or a success comment if all checks pass.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN and ANALYSIS in env.
 * Main execution block for quality gate merge blocking.
 * Fails the workflow and posts a blocking comment if issues are found.
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

    let analysis = {};
    try {
      analysis = JSON.parse(process.env.ANALYSIS || "{}").analysis || {};
    } catch (_e) {
      analysis = {};
    }

    // Count total issues and passed checks
    const totalIssues = Object.values(analysis).reduce(
      (total, section) => total + (section.failed?.length || 0),
      0
    );
    const totalPassed = Object.values(analysis).reduce(
      (total, section) => total + (section.passed?.length || 0),
      0
    );

    // Log summary for transparency
    core.info(`🔍 Quality Gate Summary:`);
    core.info(`  ✅ Passed Checks: ${totalPassed}`);
    core.info(`  ❌ Failed Checks: ${totalIssues}`);

    if (totalIssues > 0) {
      // List the specific issues found
      core.info(`🚨 Issues preventing merge:`);
      Object.entries(analysis).forEach(([category, data]) => {
        if (data.failed && data.failed.length > 0) {
          core.info(`  ${category}:`);
          data.failed.forEach((issue) => core.info(`    - ${issue}`));
        }
      });

      // Add blocking comment to PR
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: `## 🚫 **MERGE BLOCKED - Quality Gate Failed**\n\n**${totalIssues} issue(s) must be resolved before this PR can be merged.**\n\n### 🔧 Required Actions:\n${Object.entries(
          analysis
        )
          .filter(([_, data]) => data.failed && data.failed.length > 0)
          .map(
            ([category, data]) =>
              `**${category}:**\n${data.failed
                .map((issue) => `- ${issue}`)
                .join("\n")}`
          )
          .join(
            "\n\n"
          )}\n\n### ✅ Next Steps:\n1. Fix the issues listed above\n2. Push your changes to trigger a new analysis\n3. Once all issues are resolved, this check will pass automatically\n\n---\n*This PR will remain blocked until all automated quality checks pass.*`,
      });

      // Fail the workflow to prevent merge
      core.setFailed(
        `Quality Gate Failed: ${totalIssues} issue(s) found that must be resolved before merging.`
      );
    } else {
      core.info("🎉 Quality Gate Passed: No blocking issues found!");
      // Add success comment to PR
      await octokit.rest.issues.createComment({
        owner,
        repo,
        issue_number: pull_number,
        body: `## 🎉 **Quality Gate Passed!**\n\nAll automated quality checks have passed successfully.\n\n✅ **${totalPassed} checks passed**\n❌ **0 issues found**\n\nThis PR meets all technical quality standards and is approved for merging.\n\n---\n*Quality gate automatically validated by [AnimeBOX Project Guidelines](.github/copilot-instructions.md)*`,
      });
    }
  } catch (error) {
    core.setFailed(error.message);
  }
})();
