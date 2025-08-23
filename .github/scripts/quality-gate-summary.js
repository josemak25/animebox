const core = require("@actions/core");
const github = require("@actions/github");

/**
 * Filters analysis results to only include entries for files changed in the PR.
 *
 * @param {object} section - The analysis section (e.g., reactNative, testing).
 * @param {string[]} changedFiles - Array of changed file paths in the PR.
 * @returns {{passed: string[], failed: string[]}} Filtered analysis results for changed files only.
 */
function filterByChangedFiles(section, changedFiles) {
  if (!section) return section;
  const filterItems = (items) =>
    (items || []).filter((item) =>
      changedFiles.some(
        (filename) =>
          item.startsWith(filename + ":") ||
          item.startsWith(filename + " ") ||
          item.includes(filename)
      )
    );
  return {
    passed: filterItems(section.passed),
    failed: filterItems(section.failed),
  };
}

/**
 * Formats an analysis section for PR comments, showing only results for changed files.
 * @param {object} analysis - The analysis object.
 * @param {string[]} changedFiles - Array of changed file paths in the PR.
 * @param {object} fileFlags - Object with booleans for file type changes.
 * @param {number} totalFiles - Total number of files analyzed.
 * @returns {string} - Markdown string for Copilot review guidance.
 */
function getReviewGuidanceMarkdown(
  analysis,
  changedFiles,
  fileFlags,
  totalFiles
) {
  const {
    hasTypeScriptChanges,
    hasComponentChanges,
    hasDbChanges,
    hasTestChanges,
    hasAppChanges,
  } = fileFlags;
  const issuesFound = Object.values(analysis).reduce(
    (total, section) =>
      total +
      (filterByChangedFiles(section, changedFiles)?.failed?.length || 0),
    0
  );
  const bestPractices = Object.values(analysis).reduce(
    (total, section) =>
      total +
      (filterByChangedFiles(section, changedFiles)?.passed?.length || 0),
    0
  );
  const analysisContext = Object.values(analysis).some(
    (section) =>
      (filterByChangedFiles(section, changedFiles)?.failed?.length || 0) > 0
  )
    ? "ATTENTION: Automated analysis found issues that need review."
    : "Good news: Automated analysis shows this PR follows most best practices.";
  return [
    "## 🤖 @github-copilot - Enhanced Review Guidance",
    "",
    `**Analysis Context**: ${analysisContext}`,
    "",
    "Please provide a comprehensive review focusing on the areas flagged by our automated analysis:",
    "",
    "### 📋 Priority Review Areas",
    hasTypeScriptChanges
      ? `- **TypeScript Changes**: ${
          (filterByChangedFiles(analysis.typeScript, changedFiles)?.failed
            ?.length || 0) > 0
            ? `⚠️ ${filterByChangedFiles(analysis.typeScript, changedFiles).failed.length} issue(s) detected`
            : "✅ No issues detected"
        }\n`
      : "",
    hasComponentChanges || hasAppChanges
      ? `- **React Native Components**: ${
          (filterByChangedFiles(analysis.reactNative, changedFiles)?.failed
            ?.length || 0) > 0
            ? `⚠️ ${filterByChangedFiles(analysis.reactNative, changedFiles).failed.length} issue(s) detected`
            : "✅ No issues detected"
        }\n`
      : "",
    hasDbChanges
      ? `- **Database Changes**: ${
          (filterByChangedFiles(analysis.drizzleORM, changedFiles)?.failed
            ?.length || 0) > 0
            ? `⚠️ ${filterByChangedFiles(analysis.drizzleORM, changedFiles).failed.length} issue(s) detected`
            : "✅ No issues detected"
        }\n`
      : "",
    hasTestChanges
      ? `- **Testing**: ${
          (filterByChangedFiles(analysis.testing, changedFiles)?.failed
            ?.length || 0) > 0
            ? `⚠️ ${filterByChangedFiles(analysis.testing, changedFiles).failed.length} issue(s) detected`
            : "✅ Tests look good"
        }\n`
      : "",
    "### 🎯 Focus Your Review On:",
    `1. **Validate Flagged Issues**: Confirm if the ${issuesFound} flagged issues are genuine concerns`,
    "2. **Code Quality**: Look beyond automated checks for logic, readability, and maintainability",
    "3. **Security**: Check for potential security vulnerabilities not caught by static analysis",
    "4. **Business Logic**: Ensure the implementation meets requirements correctly",
    "5. **Edge Cases**: Consider scenarios that automated testing might miss",
    "",
    "### 📊 Automated Analysis Summary:",
    `- ✅ **Passed Checks**: ${bestPractices}`,
    `- ❌ **Failed Checks**: ${issuesFound}`,
    `- 📄 **Files Analyzed**: ${totalFiles}`,
    "",
    "### 🔍 Review Guidelines:",
    "- If automated analysis flagged an issue, please validate and provide specific feedback",
    "- For issues not flagged, still review for correctness and best practices",
    "- Consider the impact of changes on mobile performance and user experience",
    "- Verify that new functionality includes appropriate error handling",
    "",
    "---",
    "*This enhanced guidance is based on automated analysis results and [AnimeBOX Project Guidelines](.github/copilot-instructions.md)*",
  ].join("\n");
}

/**
 * Formats an analysis section for PR comments, showing only results for changed files.
 *
 * @param {string} sectionName - The name of the section (e.g., "React Native").
 * @param {object} data - The analysis data for the section.
 * @param {string} emoji - Emoji to prefix the section.
 * @param {string[]} changedFiles - Array of changed file paths in the PR.
 * @returns {string} - Formatted markdown for the section, or empty string if no relevant results.
 */
function formatAnalysisSection(sectionName, data, emoji, changedFiles) {
  const filtered = filterByChangedFiles(data, changedFiles);
  if (
    !filtered ||
    ((filtered.passed?.length ?? 0) === 0 &&
      (filtered.failed?.length ?? 0) === 0)
  ) {
    return "";
  }
  const passedItems = (filtered.passed || [])
    .map((item) => `  ✅ ${item}`)
    .join("\n");
  const failedItems = (filtered.failed || [])
    .map((item) => `  ❌ ${item}`)
    .join("\n");
  const status = (filtered.failed?.length ?? 0) === 0 ? "✅" : "❌";
  return `${emoji} **${sectionName}**: ${status} ${(filtered.failed?.length ?? 0) === 0 ? "All checks passed" : `${filtered.failed.length} issue(s) found`}\n${passedItems}${passedItems && failedItems ? "\n" : ""}${failedItems}\n`;
}

/**
 * Generates the detailed analysis markdown for the PR comment.
 * @param {object} analysis - The analysis object.
 * @param {string[]} changedFiles - Array of changed file paths in the PR.
 * @param {number} totalFiles - Total number of files analyzed.
 * @returns {string} - Markdown string for detailed analysis.
 */
function getDetailedAnalysisMarkdown(analysis, changedFiles, totalFiles) {
  const issuesFound = Object.values(analysis).reduce(
    (total, section) =>
      total +
      (filterByChangedFiles(section, changedFiles)?.failed?.length || 0),
    0
  );
  const bestPractices = Object.values(analysis).reduce(
    (total, section) =>
      total +
      (filterByChangedFiles(section, changedFiles)?.passed?.length || 0),
    0
  );
  return [
    "## 🔍 Automated Code Review Analysis",
    "",
    "### 📋 Review Checklist Results",
    "",
    formatAnalysisSection(
      "React Native",
      analysis.reactNative,
      "📱",
      changedFiles
    ),
    formatAnalysisSection(
      "Drizzle ORM",
      analysis.drizzleORM,
      "🗄️",
      changedFiles
    ),
    formatAnalysisSection("Testing", analysis.testing, "🧪", changedFiles),
    formatAnalysisSection(
      "Performance",
      analysis.performance,
      "⚡",
      changedFiles
    ),
    formatAnalysisSection(
      "Documentation",
      analysis.documentation,
      "📚",
      changedFiles
    ),
    formatAnalysisSection(
      "Architecture",
      analysis.architecture,
      "🏗️",
      changedFiles
    ),
    "",
    "### 🚨 Issues Flagged",
    "",
    formatAnalysisSection(
      "Common Issues",
      analysis.commonIssues,
      "⚠️",
      changedFiles
    ),
    "### 📱 Mobile Specific Checks",
    "",
    formatAnalysisSection(
      "Mobile Compatibility",
      analysis.mobileSpecific,
      "📱",
      changedFiles
    ),
    "### 🎯 Summary",
    `- **Total Files Analyzed**: ${totalFiles}`,
    `- **Issues Found**: ${issuesFound}`,
    `- **Best Practices Followed**: ${bestPractices}`,
    "",
  ].join("\n");
}

/**
 * @file quality-gate-summary.js
 * @description
 * GitHub Actions script to post a summary and detailed analysis of automated quality checks on a PR.
 * Posts three comments: summary, detailed analysis, and Copilot review guidance, based on analysis results.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN, TEST_SUMMARY, and ANALYSIS in env.
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
    const testSummary = process.env.TEST_SUMMARY || "tests completed";

    let analysis = {};
    try {
      analysis = JSON.parse(process.env.ANALYSIS || "{}").analysis || {};
    } catch (_e) {
      analysis = {};
    }

    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    // Compose summary comment
    const summaryComment = `## ✅ Automated Quality Gate Results\n\nAll quality checks have passed successfully:\n\n- 🔍 **TypeScript Compilation**: ✅ Passed\n- 🎨 **ESLint Code Style**: ✅ Passed\n- 🧪 **Test Suite**: ✅ Passed (${testSummary})\n- 📝 **Markdown Documentation**: ✅ Passed\n\n### 🤖 Copilot Review Status\n- **Reviewer**: Copilot has been automatically requested\n- **Guidelines**: Following [project standards](.github/copilot-instructions.md)\n- **Focus Areas**: React Native, TypeScript, Drizzle ORM best practices\n\n---\n*This PR meets all technical quality standards and is ready for human review.*`;

    // Compose detailed analysis (only changed files)
    const changedFiles = files.map((f) => f.filename);
    const detailedAnalysis = getDetailedAnalysisMarkdown(
      analysis,
      changedFiles,
      files.length
    );

    // Compose review guidance using new function
    const fileFlags = {
      hasTypeScriptChanges: files.some(
        (f) => f.filename.endsWith(".ts") || f.filename.endsWith(".tsx")
      ),
      hasComponentChanges: files.some((f) =>
        f.filename.startsWith("components/")
      ),
      hasDbChanges: files.some((f) => f.filename.startsWith("db/")),
      hasTestChanges: files.some(
        (f) => f.filename.includes("test") || f.filename.includes("__tests__")
      ),
      hasAppChanges: files.some((f) => f.filename.startsWith("app/")),
    };

    const reviewGuidance = getReviewGuidanceMarkdown(
      analysis,
      changedFiles,
      fileFlags,
      files.length
    );

    // Post comments to PR
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: summaryComment,
    });
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: detailedAnalysis,
    });
    await octokit.rest.issues.createComment({
      owner,
      repo,
      issue_number: pull_number,
      body: reviewGuidance,
    });
  } catch (error) {
    core.setFailed(error.message);
  }
})();
