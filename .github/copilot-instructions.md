# GitHub Copilot Code Review Instructions

## 📱 Project Overview

**AnimeBOX** is a modern React Native application built with Expo for anime collection management. When reviewing code, please ensure changes align with our architecture and standards.

### Tech Stack

- **Framework**: React Native with Expo (~53.0.20)
- **Language**: TypeScript (~5.8.3)
- **Database**: SQLite with Drizzle ORM (^0.44.4)
- **Navigation**: Expo Router (~5.1.4)
- **Package Manager**: Yarn Berry 4.9.3
- **State Management**: React Hooks + Drizzle Live Queries

## 🏗️ Project Structure & Review Guidelines

### Core Directories

```
animebox/
├── app/                     # Expo Router - File-based routing
├── components/              # Reusable UI components
├── constants/               # App-wide constants
├── helpers/                 # Utility functions
├── hooks/                   # Custom React hooks
├── providers/               # Context providers
├── db/                      # Database schema and utilities
└── docs/                    # Documentation
```

### Review Focus Areas

#### 1. Code Quality & Standards

- **TypeScript**: Ensure strict typing, no `any` types
- **ESLint**: Follow existing ESLint configuration
- **Prettier**: Code formatting must be consistent
- **Performance**: Check for unnecessary re-renders, optimize hooks usage

#### 2. React Native Best Practices

- Use React Native StyleSheet, not inline styles
- Implement proper error boundaries
- Follow expo-router file-based routing conventions
- Use react-native-size-matters for responsive design

#### 3. Database & Data Layer

- **Drizzle ORM**: Ensure type-safe database operations
- **Live Queries**: Use `useLiveQuery` for reactive data
- **Migrations**: Proper schema versioning in `/db/migrations/`
- **Schema**: Type definitions should match database structure

#### 4. Testing Requirements

- All new features must have tests
- Maintain 100% test coverage for utilities in `/helpers/`
- Use Jest and React Native Testing Library
- Test files should be in `__tests__/` directories

## 📋 PR Review Checklist

### Code Changes

- [ ] **Type Safety**: All TypeScript errors resolved
- [ ] **Linting**: ESLint passes (`yarn lint`)
- [ ] **Formatting**: Prettier formatting applied
- [ ] **Tests**: New tests added for new functionality
- [ ] **Performance**: No performance regressions introduced

### Mobile Specific

- [ ] **Cross-platform**: Works on both iOS and Android
- [ ] **Responsive**: Uses react-native-size-matters for scaling
- [ ] **Navigation**: Follows expo-router patterns
- [ ] **Accessibility**: Proper accessibility labels and hints

### Documentation

- [ ] **Comments**: Complex logic is well-documented
- [ ] **README**: Updated if API changes
- [ ] **TypeScript**: Public APIs have proper JSDoc comments
- [ ] **Markdown**: Follows markdownlint rules (80 char lines, proper headers)

### Database Changes

- [ ] **Schema**: Drizzle schema properly typed
- [ ] **Migrations**: Safe migration scripts provided
- [ ] **Queries**: Use type-safe Drizzle queries
- [ ] **Live Queries**: Reactive updates implemented where needed

## 🚨 Common Issues to Flag

### Code Smells

- Console.log statements in production code
- Hardcoded strings (use constants)
- Missing error handling
- Unused imports or variables
- Non-descriptive variable names

### React Native Specific

- Using web-only CSS properties
- Not handling keyboard avoidance
- Missing safe area handling
- Improper state management patterns

### Performance Issues

- Large bundle imports (import entire libraries)
- Missing useMemo/useCallback optimizations
- Unnecessary re-renders
- Memory leaks in useEffect cleanup

## 📝 Review Comment Templates

### Suggestion Template

````
**Suggestion**: Consider using `useMemo` here to prevent unnecessary recalculations:
```tsx
const expensiveValue = useMemo(() => complexCalculation(data), [data]);
````

This will improve performance when `data` hasn't changed.

```

### Required Change Template
```

**Required**: This introduces a TypeScript error. Please ensure proper typing:

```tsx
// Instead of
const result: any = getData();

// Use
const result: ApiResponse<UserData> = getData();
```

```

### Best Practice Template
```

**Best Practice**: For React Native styling, use StyleSheet.create:

```tsx
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: moderateScale(16), // Use size-matters for responsive design
  },
});
```

````

## 🎯 Approval Guidelines

### Auto-Approve Scenarios
- Documentation-only changes that pass markdown linting
- Test additions with no functional changes
- Minor formatting/style fixes
- Dependency updates in development dependencies

### Requires Human Review
- Breaking changes to public APIs
- Database schema modifications
- Security-related changes
- Performance-critical modifications
- New feature implementations

### Block Merge Scenarios
- TypeScript compilation errors
- Failed tests (any test suite)
- ESLint errors
- Missing required PR template sections
- No tests for new functionality

## 🔍 Code Review Process

1. **Automated Checks**: Ensure CI passes (TypeScript, ESLint, Tests)
2. **Structure Review**: Verify files follow project conventions
3. **Logic Review**: Check business logic correctness
4. **Performance Check**: Identify potential optimizations
5. **Security Review**: Check for vulnerabilities
6. **Documentation Review**: Ensure adequate documentation

## 📖 Additional Context

### Yarn Berry Configuration
- Use `yarn` commands, not `npm`
- Respect `.yarnrc.yml` configuration
- Don't commit `.yarn/install-state.gz` (cache file)
- Do commit `yarn.lock` and `.yarn/releases/`

### Development Workflow
- Pre-commit hooks run TypeScript, tests, and linting
- All tests must pass (currently 112/112)
- Use conventional commit messages
- Follow the established PR template

### Error Handling Patterns
```typescript
// Preferred error handling pattern
try {
  const result = await riskyOperation();
  return { data: result, error: null };
} catch (error) {
  console.error('Operation failed:', error);
  return { data: null, error: error.message };
}
````

Remember: The goal is maintaining high code quality while supporting the team's productivity. Provide constructive feedback that helps improve both the code and the developer's skills.
