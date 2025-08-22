# AnimeBOX

AnimeBOX is a modern React Native application built with Expo, TypeScript, and Drizzle ORM, designed for anime collection management and seamless mobile consumption of anime content. The project focuses on building an advanced HTML data parser that takes PHP-based web responses from animepahe.ru and converts them into a clean JSON format, making the data easier to consume within a mobile app.

## 🚀 Project Goal

AnimeBOX aims to reverse engineer the data flow of [animepahe.ru](https://animepahe.ru), a web-only anime streaming site with secure video streaming and no open API. The core objective is to:

- Parse and extract anime data from PHP-based HTML responses
- Convert extracted data into structured, consumable JSON
- Enable mobile-friendly access to anime content and metadata
- Maintain secure, reliable, and efficient data handling

## 🌐 Why This Approach?

Animepahe.ru does not provide a public API, making it inaccessible for mobile apps by default. By reverse engineering the site’s data flow and parsing its HTML responses, AnimeBOX bridges this gap, allowing users to:

- Browse, search, and bookmark anime titles
- Access episode lists, streaming links, and metadata
- Enjoy a native mobile experience with offline and responsive features

## 🏗️ Project Structure

The project follows a modular, scalable architecture. For detailed structure, see [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

```text
animebox/
├── app/          # Expo Router - File-based routing
├── components/   # Reusable UI components
├── constants/    # App-wide constants
├── db/           # Database schema and utilities
├── docs/         # Documentation
├── helpers/      # Utility functions
├── hooks/        # Custom React hooks
├── providers/    # Context providers
└── drizzle.config.ts # Drizzle ORM config
```

- **app/**: Navigation, screens, and layouts (Expo Router)
- **components/**: UI elements (e.g., bounceable, themed-components)
- **db/**: SQLite/Drizzle ORM schema, migrations, and config
- **helpers/**: Utility functions for parsing, formatting, error handling
- **hooks/**: Custom React hooks for state, data, and UI logic
- **providers/**: Context providers (e.g., ThemeProvider)
- **docs/**: Project documentation and contribution guides

## 🛠️ Key Technologies

- **React Native** (Expo)
- **TypeScript** (strict mode)
- **Drizzle ORM** (SQLite)
- **Expo Router** (file-based navigation)
- **react-native-size-matters** (responsive design)
- **Jest** (testing)

## 📦 Getting Started

1. **Clone the repository:**

   ```sh
   git clone https://github.com/josemak25/animebox.git
   cd animebox
   ```

2. **Install dependencies:**

   ```sh
   yarn install
   ```

3. **Run the app:**

   ```sh
   yarn start
   ```

## 🧩 HTML Data Parsing Approach

- Uses custom helpers to fetch and parse HTML from animepahe.ru
- Extracts relevant data (titles, episodes, streams) from PHP-based responses
- Converts to JSON for use in the app’s state and UI
- Handles anti-bot and security measures where possible

## 📚 Documentation

- **Project Structure:** [`docs/STRUCTURE.md`](docs/STRUCTURE.md)
- **Contribution Guide:** [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) _(if available)_
- **Code Review Standards:** [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

## 🤝 Contributing

Contributions are welcome! Please read the [contribution guidelines](docs/CONTRIBUTING.md) and [code of conduct](.github/CODEOWNERS) before submitting a pull request.

- Fork the repo and create your branch from `develop`
- Ensure code passes all lint, type, and test checks
- Write tests for new features (see `/helpers/__tests__/` for examples)
- Follow the PR template and code review checklist

## 🧪 Testing

- Run all tests:

  ```sh
  yarn test
  ```

- Test coverage is enforced for all helpers and utilities

## 🛡️ Quality & Code Review

- Automated code review via GitHub Copilot and custom workflow
- PRs are blocked if flagged issues are found (see workflow in `.github/workflows/auto-request-copilot.yml`)
- Follow [project standards](.github/copilot-instructions.md) for code, documentation, and testing

## 📄 License

MIT License. See [LICENSE](LICENSE) for details.

---

_This project is not affiliated with animepahe.ru. Use responsibly and respect the site’s terms of service._
