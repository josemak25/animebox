import { View } from "react-native";

const mockIcon = () => <View />;

// Mock specific icon sets
export const Ionicons = mockIcon;
export const FontAwesome = mockIcon;
export const MaterialIcons = mockIcon;
export const MaterialCommunityIcons = mockIcon;

// You can also export a default
export default {
  Ionicons: mockIcon,
  FontAwesome: mockIcon,
  MaterialIcons: mockIcon,
  MaterialCommunityIcons: mockIcon,
};
