// https://docs.expo.dev/guides/using-eslint/
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const rneslint = require("eslint-plugin-react-native");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    ignores: [
      "dist/*",
      ".expo/*",
      "node_modules/*",
      "ios/*",
      "android/*",
      "web-build/*",
      "expo-env.d.ts",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    languageOptions: {
      parser: tsParser,
    },
    plugins: {
      "react-native": rneslint,
      "@typescript-eslint": tseslint,
    },
    rules: {
      // React Native best practices
      "react-native/no-inline-styles": "error",
      "react-native/no-color-literals": "error",
      "react-native/no-raw-text": ["error", { "skip": ["ThemedText"] }],
      // Prettier integration
      "prettier/prettier": "error",

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off", // Using TypeScript for prop validation

      // Import ordering
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],

      // General code quality
      "no-console": "error",
      "prefer-const": "error",

      // TypeScript rules - explicitly configure them
      "@typescript-eslint/no-explicit-any": "error",
    },
  },
]);
