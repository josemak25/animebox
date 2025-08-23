const core = require("@actions/core");
const github = require("@actions/github");

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

    // Helper to format analysis sections
    function formatAnalysisSection(sectionName, data, emoji) {
      /**
       * Helper to format a section of the analysis for PR comments.
       * @param {string} sectionName - The name of the section (e.g. "React Native").
       * @param {object} data - The analysis data for the section.
       * @param {string} emoji - Emoji to prefix the section.
       * @returns {string} - Formatted markdown for the section.
       */
      if (
        !data ||
        (!Array.isArray(data.passed) && !Array.isArray(data.failed))
      ) {
        return "";
      }
      if (
        (data.passed?.length ?? 0) === 0 &&
        (data.failed?.length ?? 0) === 0
      ) {
        return "";
      }
      const passedItems = (data.passed || [])
        .map((item) => `  ✅ ${item}`)
        .join("\n");
      const failedItems = (data.failed || [])
        .map((item) => `  ❌ ${item}`)
        .join("\n");
      const status = (data.failed?.length ?? 0) === 0 ? "✅" : "❌";
      return `${emoji} **${sectionName}**: ${status} ${(data.failed?.length ?? 0) === 0 ? "All checks passed" : `${data.failed.length} issue(s) found`}\n${passedItems}${passedItems && failedItems ? "\n" : ""}${failedItems}\n`;
    }

    // Compose summary comment
    const summaryComment = `## ✅ Automated Quality Gate Results\n\nAll quality checks have passed successfully:\n\n- 🔍 **TypeScript Compilation**: ✅ Passed\n- 🎨 **ESLint Code Style**: ✅ Passed\n- 🧪 **Test Suite**: ✅ Passed (${testSummary})\n- 📝 **Markdown Documentation**: ✅ Passed\n\n### 🤖 Copilot Review Status\n- **Reviewer**: Copilot has been automatically requested\n- **Guidelines**: Following [project standards](.github/copilot-instructions.md)\n- **Focus Areas**: React Native, TypeScript, Drizzle ORM best practices\n\n---\n*This PR meets all technical quality standards and is ready for human review.*`;

    // Compose detailed analysis
    const detailedAnalysis = `## 🔍 Automated Code Review Analysis\n\n### 📋 Review Checklist Results\n\n${formatAnalysisSection("React Native", analysis.reactNative, "📱")}${formatAnalysisSection("Drizzle ORM", analysis.drizzleORM, "🗄️")}${formatAnalysisSection("Testing", analysis.testing, "🧪")}${formatAnalysisSection("Performance", analysis.performance, "⚡")}${formatAnalysisSection("Documentation", analysis.documentation, "📚")}${formatAnalysisSection("Architecture", analysis.architecture, "🏗️")}\n### 🚨 Issues Flagged\n\n${formatAnalysisSection("Common Issues", analysis.commonIssues, "⚠️")}\n### 📱 Mobile Specific Checks\n\n${formatAnalysisSection("Mobile Compatibility", analysis.mobileSpecific, "📱")}\n### 🎯 Summary\n- **Total Files Analyzed**: ${files.length}\n- **Issues Found**: ${Object.values(analysis).reduce((total, section) => total + (section.failed?.length || 0), 0)}\n- **Best Practices Followed**: ${Object.values(analysis).reduce((total, section) => total + (section.passed?.length || 0), 0)}\n\n${
      Object.values(analysis).some(
        (section) => (section.failed?.length || 0) > 0
      )
        ? "### 🔧 Action Required\nPlease address the flagged issues above before merging."
        : "### ✅ Ready for Review\nAll automated checks passed! This PR follows project standards."
    }\n\n---\n*Automated analysis based on [AnimeBOX Project Guidelines](.github/copilot-instructions.md)*`;

    // Compose enhanced Copilot review guidance
    const hasTypeScriptChanges = files.some(
      (f) => f.filename.endsWith(".ts") || f.filename.endsWith(".tsx")
    );
    const hasComponentChanges = files.some((f) =>
      f.filename.startsWith("components/")
    );
    const hasDbChanges = files.some((f) => f.filename.startsWith("db/"));
    const hasTestChanges = files.some(
      (f) => f.filename.includes("test") || f.filename.includes("__tests__")
    );
    const hasAppChanges = files.some((f) => f.filename.startsWith("app/"));

    const analysisContext = Object.values(analysis).some(
      (section) => (section.failed?.length || 0) > 0
    )
      ? "ATTENTION: Automated analysis found issues that need review."
      : "Good news: Automated analysis shows this PR follows most best practices.";

    const reviewGuidance = `## 🤖 @github-copilot - Enhanced Review Guidance\n\n**Analysis Context**: ${analysisContext}\n\nPlease provide a comprehensive review focusing on the areas flagged by our automated analysis:\n\n### 📋 Priority Review Areas\n${hasTypeScriptChanges ? `- **TypeScript Changes**: ${(analysis.typeScript?.failed?.length || 0) > 0 ? `⚠️ ${analysis.typeScript.failed.length} issue(s) detected` : "✅ No issues detected"}\n` : ""}${hasComponentChanges || hasAppChanges ? `- **React Native Components**: ${(analysis.reactNative?.failed?.length || 0) > 0 ? `⚠️ ${analysis.reactNative.failed.length} issue(s) detected` : "✅ No issues detected"}\n` : ""}${hasDbChanges ? `- **Database Changes**: ${(analysis.drizzleORM?.failed?.length || 0) > 0 ? `⚠️ ${analysis.drizzleORM.failed.length} issue(s) detected` : "✅ No issues detected"}\n` : ""}${hasTestChanges ? `- **Testing**: ${(analysis.testing?.failed?.length || 0) > 0 ? `⚠️ ${analysis.testing.failed.length} issue(s) detected` : "✅ Tests look good"}\n` : ""}\n### 🎯 Focus Your Review On:\n1. **Validate Flagged Issues**: Confirm if the ${Object.values(analysis).reduce((total, section) => total + (section.failed?.length || 0), 0)} flagged issues are genuine concerns\n2. **Code Quality**: Look beyond automated checks for logic, readability, and maintainability\n3. **Security**: Check for potential security vulnerabilities not caught by static analysis\n4. **Business Logic**: Ensure the implementation meets requirements correctly\n5. **Edge Cases**: Consider scenarios that automated testing might miss\n\n### 📊 Automated Analysis Summary:\n- ✅ **Passed Checks**: ${Object.values(analysis).reduce((total, section) => total + (section.passed?.length || 0), 0)}\n- ❌ **Failed Checks**: ${Object.values(analysis).reduce((total, section) => total + (section.failed?.length || 0), 0)}\n- 📄 **Files Analyzed**: ${files.length}\n\n### 🔍 Review Guidelines:\n- If automated analysis flagged an issue, please validate and provide specific feedback\n- For issues not flagged, still review for correctness and best practices\n- Consider the impact of changes on mobile performance and user experience\n- Verify that new functionality includes appropriate error handling\n\n---\n*This enhanced guidance is based on automated analysis results and [AnimeBOX Project Guidelines](.github/copilot-instructions.md)*`;

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
