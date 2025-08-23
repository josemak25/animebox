const { Buffer } = require("node:buffer");

const core = require("@actions/core");
const github = require("@actions/github");

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

    // Analyze each file in the PR
    for (const file of files) {
      if (file.status === "removed") continue;
      try {
        // Fetch file content at PR head SHA
        const { data: fileData } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.filename,
          ref: pr.head.sha,
        });
        const content = Buffer.from(fileData.content, "base64").toString(
          "utf8"
        );

        // File type checks
        const isComponent =
          file.filename.startsWith("components/") ||
          file.filename.startsWith("app/");
        const isDatabase = file.filename.startsWith("db/");
        const isTest =
          file.filename.includes("test") || file.filename.includes("__tests__");

        // --- React Native Analysis ---
        // Enforce withThemeStyles usage for styles
        if (isComponent) {
          if (content.includes("withThemeStyles")) {
            analysis.reactNative.passed.push(
              `${file.filename}: Uses withThemeStyles for styles`
            );
          } else if (content.includes("StyleSheet.create")) {
            analysis.reactNative.failed.push(
              `${file.filename}: Uses StyleSheet.create instead of withThemeStyles`
            );
          } else if (
            content.includes("style={{") ||
            content.includes("style={[")
          ) {
            analysis.reactNative.failed.push(
              `${file.filename}: Uses inline styles instead of withThemeStyles`
            );
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

          // Check for responsive design (enforce s, vs, ms, mvs from react-native-size-matters)
          if (
            content.includes("s(") ||
            content.includes("vs(") ||
            content.includes("ms(") ||
            content.includes("mvs(")
          ) {
            analysis.reactNative.passed.push(
              `${file.filename}: Uses react-native-size-matters for responsive design`
            );
          } else {
            analysis.reactNative.failed.push(
              `${file.filename}: Does not use react-native-size-matters for responsive design`
            );
          }

          // Check for accessibility
          if (
            content.includes("accessibilityLabel") ||
            content.includes("accessibilityHint")
          ) {
            analysis.mobileSpecific.passed.push(
              `${file.filename}: Includes accessibility labels`
            );
          } else if (
            content.includes("<TouchableOpacity") ||
            content.includes("<Pressable") ||
            content.includes("<Button")
          ) {
            analysis.mobileSpecific.failed.push(
              `${file.filename}: Interactive elements missing accessibility labels`
            );
          }

          // Check for web-only CSS
          const webOnlyProps = [
            "cursor:",
            "user-select:",
            "box-shadow:",
            "outline:",
          ];
          const foundWebProps = webOnlyProps.filter((prop) =>
            content.includes(prop)
          );
          if (foundWebProps.length > 0) {
            analysis.mobileSpecific.failed.push(
              `${file.filename}: Contains web-only CSS properties: ${foundWebProps.join(", ")}`
            );
          }
        }

        // --- Database Analysis ---
        if (isDatabase) {
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

        // --- Testing Analysis ---
        if (isTest) {
          analysis.testing.passed.push(`${file.filename}: Test file present`);
          if (content.includes("describe(") && content.includes("it(")) {
            analysis.testing.passed.push(
              `${file.filename}: Proper test structure`
            );
          }
        }

        // --- Common Issues Check ---
        // Skip for workflow files, package.json, yarn.lock, markdown
        const isWorkflowFile = file.filename.startsWith(".github/workflows/");
        const omittedExtensions = [".lock", ".json"];
        const isOmittedExtension = omittedExtensions.some((ext) =>
          file.filename.endsWith(ext)
        );
        const isMarkdown = file.filename.endsWith(".md");
        if (!isMarkdown && !isWorkflowFile && !isOmittedExtension) {
          if (
            content.includes("console.log") ||
            content.includes("console.error") ||
            content.includes("console.warn")
          ) {
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

        // --- Performance checks ---
        if (content.includes("useMemo") || content.includes("useCallback")) {
          analysis.performance.passed.push(
            `${file.filename}: Uses performance optimization hooks`
          );
        }

        // --- Documentation checks ---
        // Skip for markdown, test files, workflow files, *.lock, *.json
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

        // --- Architecture checks ---
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
      } catch (error) {
        // Log error for this file but continue analysis
        core.error(`Error analyzing ${file.filename}: ${error.message}`);
      }
    }

    // --- Test Coverage Check ---
    // Check if tests exist for new functionality
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

    // Output analysis as JSON for workflow consumption
    core.setOutput("result", JSON.stringify({ analysis }));
  } catch (error) {
    // Fail the workflow if any error occurs
    core.setFailed(error.message);
  }
})();
