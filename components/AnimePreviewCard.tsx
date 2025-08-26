import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity,
  ImageSourcePropType,
} from "react-native";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";

import fallbackImage from "../assets/images/fallback.png";
import { hexToRGB } from "../helpers/color";
import { withThemeStyles } from "../helpers/withThemeStyles";

export type AnimePreviewCardProps = {
  title: string;
  season?: string;
  episode?: string;
  imageUrl: string;
  badges?: string[];
  isInList?: boolean;
  onPlay: () => void;
  description?: string;
  releaseInfo?: string;
  onAddToList: () => void;
  accessibilityLabel?: string;
};

const AnimePreviewCardComponent: React.FC<AnimePreviewCardProps> = ({
  title,
  season,
  imageUrl,
  episode,
  onPlay,
  onAddToList,
  description,
  releaseInfo,
  badges = [],
  isInList = false,
  accessibilityLabel,
}) => {
  const { styles, palette } = useStyles();
  // Use fallback image if imageUrl is missing or empty
  const imageSource: ImageSourcePropType =
    typeof imageUrl === "string" && imageUrl.trim().length > 0
      ? { uri: imageUrl }
      : fallbackImage;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: palette.background,
          shadowColor: palette.black,
        },
      ]}
      accessible
      accessibilityLabel={accessibilityLabel || `${title} preview card`}
    >
      <View style={styles.imageContainer}>
        <Image
          source={imageSource}
          style={styles.image}
          resizeMode="cover"
          accessibilityRole="image"
          defaultSource={fallbackImage as ImageSourcePropType}
          accessibilityLabel={`${title} cover art`}
        />
        {badges.length > 0 && (
          <View style={styles.badgeRow}>
            {badges.map((badge, idx) => (
              <View key={badge + idx} style={styles.badge}>
                <Text style={styles.badgeText}>{badge}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2} accessibilityRole="header">
          {title}
        </Text>
        <View style={styles.metaRow}>
          {season && <Text style={styles.meta}>{season}</Text>}
          {episode && <Text style={styles.meta}>{episode}</Text>}
        </View>
        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
        {releaseInfo ? (
          <Text style={styles.releaseInfo}>{releaseInfo}</Text>
        ) : null}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.playButton, { backgroundColor: palette.red }]}
            onPress={onPlay}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel={`Play ${title}`}
          >
            <Ionicons
              name="play"
              size={moderateScale(20)}
              color={palette.text}
              style={{ marginRight: scale(6) }}
            />
            <Text style={styles.playButtonText}>Play</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.addButton,
              isInList && [styles.addedButton, { borderColor: palette.red }],
            ]}
            onPress={onAddToList}
            accessibilityRole="button"
            accessibilityLabel={
              isInList
                ? `Remove ${title} from My Bookmark`
                : `Add ${title} to My Bookmark`
            }
            activeOpacity={0.85}
          >
            <Ionicons
              size={moderateScale(18)}
              name={isInList ? "checkmark" : "add"}
              color={isInList ? palette.red : palette.text}
            />
            <Text
              style={[styles.addButtonText, isInList && { color: palette.red }]}
            >
              {isInList ? "In Bookmark" : "Add to Bookmark"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const useStyles = withThemeStyles(({ palette }) => ({
  card: {
    elevation: 6,
    shadowRadius: 12,
    alignSelf: "center",
    minWidth: scale(260),
    maxWidth: scale(340),
    shadowOpacity: 0.1,
    flexDirection: "column",
    // Removed stray import statements from inside the component
    shadowOffset: { width: 0, height: 6 },
    overflow: Platform.OS === "android" ? "hidden" : "visible",
  },
  imageContainer: {
    width: "100%",
    overflow: "hidden",
    position: "relative",
    height: verticalScale(180),
    backgroundColor: palette.senary,
    borderTopLeftRadius: moderateScale(18),
    borderTopRightRadius: moderateScale(18),
  },
  image: {
    width: "100%",
    height: "100%",
  },
  badgeRow: {
    gap: scale(6),
    position: "absolute",
    flexDirection: "row",
    top: moderateScale(10),
    left: moderateScale(10),
  },
  badge: {
    marginRight: scale(4),
    paddingHorizontal: scale(8),
    backgroundColor: palette.red,
    borderRadius: moderateScale(8),
    paddingVertical: verticalScale(2),
  },
  badgeText: {
    fontWeight: "600",
    letterSpacing: 0.2,
    color: palette.white,
    fontSize: moderateScale(11),
  },
  infoContainer: {
    padding: moderateScale(14),
    backgroundColor: palette.transparent,
  },
  title: {
    color: palette.text,
    fontWeight: "bold",
    fontSize: moderateScale(20),
    marginBottom: verticalScale(4),
  },
  metaRow: {
    gap: scale(10),
    flexDirection: "row",
    marginBottom: verticalScale(2),
  },
  meta: {
    fontWeight: "500",
    color: hexToRGB(palette.text, 0.8),
    fontSize: moderateScale(13),
  },
  description: {
    color: hexToRGB(palette.text, 0.8),
    fontSize: moderateScale(13),
    marginBottom: verticalScale(4),
  },
  releaseInfo: {
    fontWeight: "600",
    color: palette.warning,
    fontSize: moderateScale(12),
    marginBottom: verticalScale(8),
  },
  actionsRow: {
    gap: scale(12),
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(6),
  },
  playButton: {
    elevation: 2,
    shadowRadius: 4,
    flexDirection: "row",
    alignItems: "center",
    shadowOpacity: 0.18,
    shadowColor: palette.black,
    paddingHorizontal: scale(18),
    backgroundColor: palette.red,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(8),
    shadowOffset: { width: 0, height: 2 },
  },
  playButtonText: {
    fontWeight: "bold",
    color: palette.text,
    fontSize: moderateScale(15),
  },
  addButton: {
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(14),
    borderColor: palette.quaternary,
    borderRadius: moderateScale(10),
    paddingVertical: verticalScale(8),
    backgroundColor: palette.septenary,
  },
  addedButton: {
    borderColor: palette.red,
    backgroundColor: palette.senary,
  },
  addButtonText: {
    fontWeight: "600",
    marginLeft: scale(4),
    color: palette.text,
    fontSize: moderateScale(14),
  },
}));

export const AnimePreviewCard = React.memo(AnimePreviewCardComponent);
