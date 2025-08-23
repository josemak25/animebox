const core = require("@actions/core");
const github = require("@actions/github");

/**
 * @file log-pr-changes.js
 * @description
 * GitHub Actions script to log and categorize changed files in a pull request.
 * Categorizes files by type (architecture, components, db, tests, docs, etc.) and logs a summary for reviewers.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN in env.
 * Main execution block for PR file change categorization and logging.
 * Groups files by project area and logs a summary for reviewer context.
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
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    // Categorize changed files by project area
    const categories = {
      tests: [],
      github: [],
      database: [],
      utilities: [],
      components: [],
      architecture: [],
      documentation: [],
    };

    for (const file of files) {
      const { filename } = file;
      switch (true) {
        case filename.startsWith("app/"):
          categories.architecture.push(filename);
          break;
        case filename.startsWith("components/"):
          categories.components.push(filename);
          break;
        case filename.startsWith("db/"):
          categories.database.push(filename);
          break;
        case filename.startsWith("helpers/"):
          categories.utilities.push(filename);
          break;
        case filename.includes("test"):
        case filename.includes("__tests__"):
          categories.tests.push(filename);
          break;
        case filename.endsWith(".md"):
          categories.documentation.push(filename);
          break;
        case filename.includes(".github/"):
          categories.github.push(filename);
          break;
        default:
          break;
      }
    }

    // Log summary for reviewers
    core.info("📊 PR Change Categories:");
    Object.entries(categories).forEach(([category, files]) => {
      if (files.length > 0) {
        core.info(`  ${category}: ${files.length} file(s)`);
      }
    });
  } catch (error) {
    core.error("Error analyzing PR changes: " + error.message);
  }
})();
