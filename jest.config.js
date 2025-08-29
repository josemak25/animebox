module.exports = {
  preset: "jest-expo",
  setupFilesAfterEnv: [
    "<rootDir>/jest.setup.ts",
    "./node_modules/react-native-gesture-handler/jestSetup.js",
  ],
};
