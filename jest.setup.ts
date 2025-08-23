import { jest } from "@jest/globals";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("expo-sqlite");

jest.mock("expo-sqlite/kv-store");

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
