const { Buffer } = require("node:buffer");

const core = require("@actions/core");
const github = require("@actions/github");

/**
 * Analyzes React Native files for theming, responsive design, accessibility, and web-only CSS usage.
 * Flags usage of direct numeric values in styles, missing Themed components, and accessibility issues.
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {boolean} params.isComponent - True if file is a component or screen.
 * @param {boolean} params.isTest - True if file is a test file.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzeReactNative({ content, file, isComponent, isTest, analysis }) {
  if (!isComponent) return;

  if (content.includes("withThemeStyles")) {
    analysis.reactNative.passed.push(
      `${file.filename}: Uses withThemeStyles for styles`
    );
  } else {
    analysis.reactNative.failed.push(
      `${file.filename}: Does not use withThemeStyles for styles`
    );
  }

  // Responsive design: Only flag if direct numeric values are used in style objects (not wrapped in s(), ms(), etc.)
  if (!isTest) {
    const directNumberInStyle = /\b(\w+):\s*(\d+)(?!\s*[),])/g;
    const scalingHelpers = /\b(s|ms|vs|mvs)\s*\(/g;
    let flagDirectNumber = false;
    const styleBlocks =
      content.match(/(StyleSheet\.create|withThemeStyles)\s*\(([^)]*)\)/gs) ||
      [];
    for (const block of styleBlocks) {
      const blockWithoutScaling = block.replace(scalingHelpers, "");
      if (directNumberInStyle.test(blockWithoutScaling)) {
        flagDirectNumber = true;
        break;
      }
    }
    const inlineDirectNumber = /style=\{\{[^}]*:\s*\d+[^}]*\}\}/g.test(content);
    if (flagDirectNumber || inlineDirectNumber) {
      analysis.reactNative.failed.push(
        `${file.filename}: Uses direct numeric values in styles instead of react-native-size-matters scaling helpers`
      );
    }
  }

  // Enforce ThemedView and ThemedText usage (skip for .test files)
  if (!isTest) {
    const usesRNView =
      /import\s*\{[^}]*\bView\b[^}]*\}\s*from\s*["']react-native["']/m.test(
        content
      );
    const usesRNText =
      /import\s*\{[^}]*\bText\b[^}]*\}\s*from\s*["']react-native["']/m.test(
        content
      );
    const usesThemedView = content.includes("ThemedView");
    const usesThemedText = content.includes("ThemedText");
    if (usesRNView && !usesThemedView) {
      analysis.reactNative.failed.push(
        `${file.filename}: Uses View from react-native instead of ThemedView from themed-components.tsx`
      );
    }
    if (usesRNText && !usesThemedText) {
      analysis.reactNative.failed.push(
        `${file.filename}: Uses Text from react-native instead of ThemedText from themed-components.tsx`
      );
    }
  }
}

/**
 * Analyzes database files for Drizzle ORM usage and schema definition.
 * Flags type-safe operations and proper schema definitions.
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {boolean} params.isDatabase - True if file is a database file.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzeDrizzleORM({ content, file, isDatabase, analysis }) {
  if (!isDatabase) return;
  if (
    content.includes("useLiveQuery") ||
    content.includes("db.select") ||
    content.includes("db.insert")
  ) {
    analysis.drizzleORM.passed.push(
      `${file.filename}: Uses type-safe Drizzle operations`
    );
  }
  if (
    content.includes("sqliteTable") ||
    content.includes("text()") ||
    content.includes("integer()")
  ) {
    analysis.drizzleORM.passed.push(
      `${file.filename}: Proper Drizzle schema definition`
    );
  }
}

/**
 * Analyzes test files for presence and structure.
 * Flags files that are tests and checks for describe/it usage.
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {boolean} params.isTest - True if file is a test file.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzeTesting({ content, file, isTest, analysis }) {
  if (!isTest) return;
  analysis.testing.passed.push(`${file.filename}: Test file present`);
  if (content.includes("describe(") && content.includes("it(")) {
    analysis.testing.passed.push(`${file.filename}: Proper test structure`);
  }
}

/**
 * Analyzes files for common issues such as console statements.
 * Skips workflow, JSON, lock, and markdown files.
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzeCommonIssues({ content, file, analysis }) {
  const isWorkflowFile = file.filename.startsWith(".github/workflows/");
  const omittedExtensions = [".lock", ".json"];
  const isOmittedExtension = omittedExtensions.some((ext) =>
    file.filename.endsWith(ext)
  );
  const isMarkdown = file.filename.endsWith(".md");
  // Skip console check for this script itself to avoid false positives
  const isSelf = file.filename.includes("code-analysis");

  if (!isMarkdown && !isWorkflowFile && !isOmittedExtension && !isSelf) {
    const logger = ["console.log", "console.error", "console.warn"];
    if (logger.some((log) => content.includes(log))) {
      analysis.commonIssues.failed.push(
        `${file.filename}: Contains console statements (should use core.info/core.error/core.warning)`
      );
    } else {
      analysis.commonIssues.passed.push(
        `${file.filename}: No console statements`
      );
    }
  } else {
    analysis.commonIssues.passed.push(
      `${file.filename}: Skipped console check (excluded file type)`
    );
  }
}

/**
 * Analyzes files for performance optimization hooks (useMemo, useCallback).
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzePerformance({ content, file, analysis }) {
  if (content.includes("useMemo") || content.includes("useCallback")) {
    analysis.performance.passed.push(
      `${file.filename}: Uses performance optimization hooks`
    );
  }
}

/**
 * Analyzes files for documentation coverage (comment/code ratio).
 * Skips workflow, JSON, lock, markdown, and test files.
 *
 * @param {Object} params
 * @param {string} params.content - The file content.
 * @param {Object} params.file - The file object from GitHub API.
 * @param {Object} params.analysis - The analysis results object to update.
 * @param {boolean} params.isTest - True if file is a test file.
 */
function analyzeDocumentation({ content, file, analysis, isTest }) {
  const isWorkflowFile = file.filename.startsWith(".github/workflows/");
  const omittedExtensions = [".lock", ".json"];
  const isOmittedExtension = omittedExtensions.some((ext) =>
    file.filename.endsWith(ext)
  );
  const isMarkdown = file.filename.endsWith(".md");
  if (!isMarkdown && !isTest && !isWorkflowFile && !isOmittedExtension) {
    const commentLines = content
      .split("\n")
      .filter(
        (line) =>
          line.trim().startsWith("//") ||
          line.trim().startsWith("/*") ||
          line.trim().startsWith("*")
      ).length;
    const codeLines = content
      .split("\n")
      .filter(
        (line) =>
          line.trim() &&
          !line.trim().startsWith("//") &&
          !line.trim().startsWith("/*") &&
          !line.trim().startsWith("*")
      ).length;
    if (commentLines / Math.max(codeLines, 1) > 0.1) {
      analysis.documentation.passed.push(
        `${file.filename}: Well documented (${commentLines} comment lines)`
      );
    } else if (codeLines > 50) {
      analysis.documentation.failed.push(
        `${file.filename}: Needs more documentation (${commentLines} comments for ${codeLines} code lines)`
      );
    }
  }
}

/**
 * Analyzes files for adherence to project directory structure.
 * Flags files that follow the expected architecture.
 *
 * @param {Object} params
 * @param {Object} params.file - The file object from GitHub API.
 * @param {boolean} params.isComponent - True if file is a component or screen.
 * @param {Object} params.analysis - The analysis results object to update.
 */
function analyzeArchitecture({ file, isComponent, analysis }) {
  const properPaths = {
    "components/": isComponent,
    "app/": file.filename.startsWith("app/"),
    "db/": file.filename.startsWith("db/"),
    "helpers/": file.filename.startsWith("helpers/"),
    "hooks/": file.filename.startsWith("hooks/"),
  };
  if (Object.values(properPaths).some(Boolean)) {
    analysis.architecture.passed.push(
      `${file.filename}: Follows project structure`
    );
  }
}

/**
 * @file code-analysis.js
 * @description
 * GitHub Actions script to perform static code analysis on PR files for AnimeBOX project standards.
 * Checks for theming, responsive design, accessibility, Drizzle ORM usage, test coverage, documentation, and more.
 * Outputs a JSON summary for downstream workflow steps.
 *
 * Usage: Run as a Node.js script in a GitHub Actions workflow with GITHUB_TOKEN in env.
 * Main execution block for code analysis.
 * Analyzes each changed file for project standards and outputs a summary.
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

    // Get PR data and files
    const { data: pr } = await octokit.rest.pulls.get({
      owner,
      repo,
      pull_number,
    });
    const { data: files } = await octokit.rest.pulls.listFiles({
      owner,
      repo,
      pull_number,
    });

    // Initialize analysis results for each category
    const analysis = {
      typeScript: { passed: [], failed: [] },
      reactNative: { passed: [], failed: [] },
      drizzleORM: { passed: [], failed: [] },
      testing: { passed: [], failed: [] },
      performance: { passed: [], failed: [] },
      documentation: { passed: [], failed: [] },
      architecture: { passed: [], failed: [] },
      commonIssues: { passed: [], failed: [] },
      mobileSpecific: { passed: [], failed: [] },
    };

    for (const file of files) {
      if (file.status === "removed") continue;
      try {
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.filename,
          ref: pr.head.sha,
        });
        const content = Buffer.from(fileData.content, "base64").toString(
          "utf8"
        );

        const isComponent =
          file.filename.startsWith("components/") ||
          file.filename.startsWith("app/");
        const isDatabase = file.filename.startsWith("db/");
        const isTest =
          file.filename.includes("test") || file.filename.includes("__tests__");

        analyzeReactNative({ content, file, isComponent, isTest, analysis });
        analyzeDrizzleORM({ content, file, isDatabase, analysis });
        analyzeTesting({ content, file, isTest, analysis });
        analyzeCommonIssues({ content, file, analysis });
        analyzePerformance({ content, file, analysis });
        analyzeDocumentation({ content, file, analysis, isTest });
        analyzeArchitecture({ file, isComponent, analysis });
      } catch (error) {
        core.error(`Error analyzing ${file.filename}: ${error.message}`);
      }
    }

    // --- Test Coverage Check ---
    const hasNewCode = files.some(
      (f) =>
        f.status === "added" &&
        (f.filename.endsWith(".ts") || f.filename.endsWith(".tsx"))
    );
    const hasNewTests = files.some(
      (f) =>
        f.status === "added" &&
        (f.filename.includes("test") || f.filename.includes("__tests__"))
    );
    if (hasNewCode && !hasNewTests) {
      analysis.testing.failed.push(
        "New functionality added without corresponding tests"
      );
    } else if (hasNewCode && hasNewTests) {
      analysis.testing.passed.push("New functionality includes tests");
    }

    core.setOutput("result", JSON.stringify({ analysis }));
  } catch (error) {
    core.setFailed(error.message);
  }
})();
