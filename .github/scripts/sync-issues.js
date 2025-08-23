/**
 * Syncs issues between a markdown file and GitHub Issues.
 * - Creates GitHub issues for new markdown entries.
 * - Marks synced issues in the markdown file.
 * - Removes closed issues from the markdown file.
 *
 * Usage: node .github/scripts/sync-issues.js
 * Requires: GITHUB_TOKEN in environment.
 */
const fs = require("node:fs");

const core = require("@actions/core");
const { Octokit } = require("@octokit/rest");

const FILE_PATH = ".github/issues.md";

/**
 * Parses issues from a markdown file.
 * @param {string} md - The markdown content.
 * @returns {Array<{title: string, body: string, labels: string[], synced: number|null, raw: string}>}
 */

function parseIssues(md) {
  return md
    .split("---")
    .map((block) => {
      const match = block.match(/## \[ISSUE\] (.+)\n([\s\S]+?)Labels: (.+)/);
      if (!match) return null;
      const [, title, body, labels] = match;
      // Check for Synced marker
      const synced = /Synced: #(\d+)/.exec(body);
      return {
        title: title.trim(),
        body: body.replace(/Synced: #\d+/, "").trim(),
        labels: labels.split(",").map((l) => l.trim()),
        synced: synced ? parseInt(synced[1], 10) : null,
        raw: block,
      };
    })
    .filter(Boolean);
}

/**
 * Main script logic: syncs issues between markdown and GitHub.
 * - Creates new issues for unsynced markdown blocks.
 * - Marks synced issues in markdown.
 * - Removes closed issues from markdown.
 */
(async () => {
  try {
    // Retrieve GitHub token from environment
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error("GITHUB_TOKEN not set");
    }

    let updated = false;
    let issues = parseIssues(md);
    let md = fs.readFileSync(FILE_PATH, "utf-8");

    const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

    // Get owner and repo from GitHub Actions context if available
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split("/");

    for (const issue of issues) {
      if (!issue.synced) {
        // Author is always repo owner
        const author = owner;
        // Assignee is PR creator if available, else repo owner
        const assignee = process.env.GITHUB_PR_AUTHOR || author;
        // Create issue on GitHub
        const res = await octokit.issues.create({
          owner,
          repo,
          title: issue.title,
          body:
            issue.body +
            `\n\n[Created from .github/issues.md]\nAuthor: @${author}`,
          labels: issue.labels,
          assignees: [assignee],
        });
        core.info(
          `Created and synced issue #${res.data.number}: ${issue.title}`
        );
        // Mark as synced in markdown
        const newBlock = issue.raw.replace(
          issue.body,
          issue.body + `\n\nSynced: #${res.data.number}`
        );
        md = md.replace(issue.raw, newBlock);
        updated = true;
      }
    }

    // Remove closed issues from markdown
    issues = parseIssues(md);
    for (const issue of issues) {
      if (issue.synced) {
        const ghIssue = await octokit.issues.get({
          owner,
          repo,
          issue_number: issue.synced,
        });
        if (ghIssue.data.state === "closed") {
          md = md.replace(issue.raw, "");
          updated = true;
          core.info(`Removed closed issue #${issue.synced} from markdown.`);
        }
      }
    }

    if (updated) {
      fs.writeFileSync(FILE_PATH, md.trim() + "\n");
      core.info("Updated issues.md");
    } else {
      core.info("No changes to issues.md");
    }
  } catch (error) {
    core.error(`Error syncing issues: ${error.message}`);
  }
})();
