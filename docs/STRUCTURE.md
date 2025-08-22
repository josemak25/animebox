# AnimeBOX - Project Structure Documentation

Modern React Native application built with Expo, TypeScript, and Drizzle ORM
for anime collection management.

## 🏗️ Architecture Overview

**Framework**: React Native with Expo (~53.0.20)  
**Language**: TypeScript (~5.8.3)  
**Database**: SQLite with Drizzle ORM (^0.44.4)  
**Navigation**: Expo Router (~5.1.4)  
**State Management**: React Hooks + Drizzle Live Queries  
**Styling**: React Native StyleSheet + react-native-size-matters

## 📁 Project Structure

```text
animebox/
├── app/                     # Expo Router - File-based routing
│   ├── (tabs)/             # Tab navigation routes
│   ├── _layout.tsx         # Root layout with providers
│   └── +html.tsx           # Web-specific configurations
├── components/             # Reusable UI components
│   ├── bounceable.tsx      # Haptic feedback component
│   ├── external-link.tsx   # External URL handler
│   └── themed-components.tsx # Theme-aware UI components
├── constants/              # Application constants
│   └── colors.ts          # Color palette and theme definitions
├── db/                    # Database layer with Drizzle ORM
│   ├── drizzle/           # Generated migrations
│   ├── config.ts          # Database connection setup
│   ├── index.ts           # Database exports
│   └── schema.ts          # Table schemas and types
├── docs/                  # Project documentation
├── helpers/               # Utility functions
│   ├── color.ts           # Color manipulation utilities
│   ├── common.ts          # Common utilities (isFunction, noop)
│   ├── date.ts            # Date formatting helpers
│   ├── withThemeStyles.ts   # Theme-aware styling HOF
│   ├── performance.ts     # Performance utilities
│   ├── reportError.ts     # Error reporting
│   ├── string.ts          # String manipulation
│   ├── timeSince.ts       # Relative time formatting
│   └── uuid.ts            # UUID generation
├── hooks/                 # Custom React hooks
│   ├── useAnimes.ts       # Anime data management
│   ├── useAppState.ts     # App lifecycle handling
│   ├── useBookmarks.ts    # Bookmark operations
│   ├── useBounceable.ts   # Animation helpers
│   ├── useCachedResources.ts # App initialization
│   ├── useMigrations.ts   # Database migrations
│   ├── useOnLayout.ts     # Layout events
│   └── useTheme.ts        # Theme management
├── providers/             # React context providers
│   └── ThemeProvider.tsx  # Theme context and state
└── drizzle.config.ts      # Drizzle ORM configuration
```

## 🗄️ Database Schema

### Core Tables

**animes** - Main anime data storage

```typescript
{
  id: number (primary key)
  anime_title: string
  episode: number
  session: string
  completed: boolean
  created_at: string
  updated_at: string
  // ... additional anime metadata
}
```

**bookmarks** - User bookmarks linked to animes

```typescript
{
  id: number (primary key)
  anime_id: number (foreign key -> animes.id)
  created_at: string
  updated_at: string
}
```

## 🎣 Hooks System

### Database Hooks (Live Queries)

```typescript
// Real-time data with automatic UI updates
import { useAnimes } from "@/hooks/useAnimes";
import { useBookmarks } from "@/hooks/useBookmarks";

function MyComponent() {
  const { data: animes } = useAnimes();
  const { data: bookmarks } = useBookmarks();

  // Data updates automatically when database changes
  return <AnimeList animes={animes} />;
}
```

### Theme Management

```typescript
import { useTheme } from "@/hooks/useTheme";

function ThemedComponent() {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.text }}>Hello World</Text>
    </View>
  );
}
```

### App Lifecycle

```typescript
import { useAppState } from "@/hooks/useAppState";

function App() {
  useAppState({
    onForeground: () => console.log("App came to foreground"),
    onBackground: () => console.log("App went to background"),
  });
}
```

## 🔧 Helper Functions

### Performance Utilities

```typescript
import { debounce, throttle } from "@/helpers/performance";

const debouncedSearch = debounce(searchFunction, 300);
const throttledScroll = throttle(onScroll, 16);
```

### Date Formatting

```typescript
import { formatDate, timeSince } from "@/helpers/date";

const formatted = formatDate(new Date(), "YYYY-MM-DD");
const relative = timeSince(date); // "2 hours ago"
```

### Common Utilities

```typescript
import { isFunction, noop, isEmpty } from "@/helpers/common";

const callback = isFunction(prop) ? prop : noop;
const hasData = !isEmpty(data);
```

## 🎨 Component Architecture

### Themed Components

```typescript
import { ThemedView, ThemedText } from "@/components/themed-components";

function MyScreen() {
  return (
    <ThemedView style={{ flex: 1 }}>
      <ThemedText type="title">Welcome</ThemedText>
      <ThemedText type="subtitle">Subtitle text</ThemedText>
    </ThemedView>
  );
}
```

### Bounceable Interactions

```typescript
import { Bounceable } from "@/components/bounceable";

function InteractiveButton() {
  return (
    <Bounceable onPress={handlePress}>
      <Text>Tap me!</Text>
    </Bounceable>
  );
}
```

## 🚀 Development Workflow

### Database Operations

1. **Schema Changes**: Update `db/schema.ts`
2. **Generate Migration**: `yarn drizzle-kit generate`
3. **Auto-Apply**: Migrations run automatically on app start

### Database Studio

Access the built-in database browser at `expo://localhost:8081` during development.

### Hot Reloading

- File changes trigger automatic reloads
- Database changes update UI instantly via live queries
- Theme changes apply immediately

## 🎯 Key Features

### Real-time Data Updates

```typescript
// No manual state management needed
const { data: animes } = useAnimes();

// UI automatically updates when:
// - New anime added to database
// - Existing anime modified
// - Anime deleted from database
```

### Type Safety

```typescript
// Fully typed database operations
const anime: AnimeInterface = await db.insert(schema.animes).values({
  anime_title: "One Piece",
  episode: 1000,
  // TypeScript ensures all required fields are present
});
```

### Performance Optimized

- **Live Queries**: Only re-render when data actually changes
- **Prepared Statements**: Pre-compiled database queries
- **Memory Efficient**: Optimized for mobile devices
- **Battery Friendly**: Minimal background processing

### Developer Experience

- **Database Studio**: Visual database browser
- **Hot Reload**: Instant feedback during development
- **Type Safety**: Catch errors at compile time
- **Auto-completion**: Full IntelliSense support

## 📱 Production Ready

- **Error Boundaries**: Graceful error handling
- **Performance Monitoring**: Built-in performance tracking
- **Migration System**: Safe database updates
- **Cross-platform**: iOS, Android, and Web support

This architecture provides a solid foundation for building modern, performant
React Native applications with excellent developer experience and
maintainability.
