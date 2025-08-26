import React from "react";
import {
  FlatList,
  View,
  Dimensions,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";

import { AnimePreviewCard } from "@/components/AnimePreviewCard";
import { ThemedText } from "@/components/themed-components";
import { withThemeStyles } from "@/helpers/withThemeStyles";

export type AnimeGridItem = {
  id: number;
  anime_title: string;
  anime_session?: string;
  episode?: number;
  snapshot: string;
  completed?: number;
};

interface AnimeGridProps {
  data: AnimeGridItem[];
  onAnimePress: (id: number) => void;
  isInList?: (id: number) => boolean;
}

const useStyles = withThemeStyles(({ palette }) => ({
  gridContent: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  row: {
    flex: 1,
    justifyContent: "space-between",
    marginBottom: 18,
  },
}));

export const AnimeGrid: React.FC<AnimeGridProps> = ({
  data,
  onAnimePress,
  isInList,
}) => {
  const { styles } = useStyles();
  const screenWidth = Dimensions.get("window").width;
  const cardMargin = 14;
  const cardWidth = (screenWidth - cardMargin * 3) / 2;

  const renderItem: ListRenderItem<AnimeGridItem> = ({ item }) => (
    <View style={{ width: cardWidth, margin: cardMargin / 2 }}>
      <TouchableOpacity
        onPress={() => onAnimePress(item.id)}
        accessibilityRole="button"
        accessibilityLabel={`${item.anime_title} preview card`}
        activeOpacity={0.85}
      >
        <AnimePreviewCard
          title={item.anime_title}
          season={item.anime_session}
          episode={item.episode ? `Ep. ${item.episode}` : undefined}
          imageUrl={item.snapshot}
          badges={item.completed ? ["Completed"] : ["Ongoing"]}
          onPlay={() => onAnimePress(item.id)}
          onAddToList={() => {}}
          isInList={isInList ? isInList(item.id) : false}
          accessibilityLabel={`${item.anime_title} preview card`}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => String(item.id)}
      numColumns={2}
      contentContainerStyle={styles.gridContent}
      columnWrapperStyle={styles.row}
      showsVerticalScrollIndicator={false}
      accessibilityRole="list"
      ListEmptyComponent={<ThemedText>No anime found.</ThemedText>}
    />
  );
};
