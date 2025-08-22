// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
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
    ],
  },
  {
    rules: {
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
      "no-console": "warn",
      "prefer-const": "error",
    },
  },
]);
