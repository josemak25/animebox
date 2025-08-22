<!--
   AnimeBOX README
   This file provides an overview of the project, setup instructions, and
   contribution guidelines. For more details, see the docs/STRUCTURE.md and
   docs/CONTRIBUTING.md files.
-->

# AnimeBOX

<!--
   Project Description:
   AnimeBOX is a modern React Native application built with Expo, TypeScript,
   and Drizzle ORM, designed for anime collection management and seamless mobile
   consumption of anime content. The project focuses on building an advanced
   HTML data parser that takes PHP-based web responses from animepahe.ru and
   converts them into a clean JSON format, making the data easier to consume
   within a mobile app.
-->

AnimeBOX is a modern React Native application built with Expo, TypeScript, and
Drizzle ORM, designed for anime collection management and seamless mobile
consumption of anime content. The project focuses on building an advanced HTML
data parser that takes PHP-based web responses from animepahe.ru and converts
them into a clean JSON format, making the data easier to consume within a mobile
app.

<!--
   🚀 Project Goal
   Explains the main objective of the project and what it aims to achieve.
   This section outlines the reverse engineering approach and core objectives.
-->

## 🚀 Project Goal

AnimeBOX aims to reverse engineer the data flow of
[animepahe.ru](https://animepahe.ru), a web-only anime streaming site with
secure video streaming and no open API. The core objective is to:

<!--
   Core objectives list:
   Detailed breakdown of what the project aims to accomplish through data
   parsing and mobile app development.
-->

- Parse and extract anime data from PHP-based HTML responses
- Convert extracted data into structured, consumable JSON
- Enable mobile-friendly access to anime content and metadata
- Maintain secure, reliable, and efficient data handling

<!--
   🌍 Why This Approach?
   Describes the motivation for reverse engineering animepahe.ru and the
   benefits for mobile users. Explains the gap this project fills.
-->

## 🌍 Why This Approach?

Animepahe.ru does not provide a public API, making it inaccessible for mobile
apps by default. By reverse engineering the site's data flow and parsing its
HTML responses, AnimeBOX bridges this gap, allowing users to:

<!--
   User benefits:
   Specific advantages that users gain from this mobile-friendly approach
   to accessing anime content.
-->

- Browse, search, and bookmark anime titles
- Access episode lists, streaming links, and metadata
- Enjoy a native mobile experience with offline and responsive features

<!--
   🗂️ Project Structure
   Outlines the folder structure and provides a high-level overview of the
   codebase organization. References detailed documentation for full structure.
-->

## 🗂️ Project Structure

The project follows a modular, scalable architecture. For detailed structure,
see [`docs/STRUCTURE.md`](docs/STRUCTURE.md).

<!--
   Directory structure for quick reference:
   Visual representation of the main folders and their purposes within the
   project structure.
-->

```text
animebox/
├── app/          # Expo Router - File-based routing system
├── components/   # Reusable UI components and widgets
├── constants/    # App-wide constants and configuration
├── db/           # Database schema and utility functions
├── docs/         # Project documentation and guides
├── helpers/      # Utility functions and helper methods
├── hooks/        # Custom React hooks for state management
├── providers/    # Context providers for global state
└── drizzle.config.ts # Drizzle ORM configuration file
                      # Database connection settings
```

<!--
   Folder descriptions:
   Detailed explanation of what each main directory contains and its role
   in the overall application architecture.
-->

- **app/**: Navigation, screens, and layouts (Expo Router)
- **components/**: UI elements (e.g., bounceable, themed-components)
- **db/**: SQLite/Drizzle ORM schema, migrations, and config
- **helpers/**: Utility functions for parsing, formatting, error handling
- **hooks/**: Custom React hooks for state, data, and UI logic
- **providers/**: Context providers (e.g., ThemeProvider)
- **docs/**: Project documentation and contribution guides

<!--
   🛠️ Key Technologies
   Lists the main technologies and libraries used in the project.
   Provides context for the tech stack choices and their benefits.
-->

## 🛠️ Key Technologies

<!--
   Technology stack:
   Core libraries and frameworks that power the AnimeBOX application,
   chosen for performance, developer experience, and maintainability.
-->

- **React Native** (Expo)
- **TypeScript** (strict mode)
- **Drizzle ORM** (SQLite)
- **Expo Router** (file-based navigation)
- **react-native-size-matters** (responsive design)
- **Jest** (testing)

<!--
   📦 Getting Started
   Step-by-step instructions for setting up the project locally.
   Includes all necessary commands to get the development environment running.
-->

## 📦 Getting Started

<!--
   Setup instructions:
   Complete walkthrough for developers to clone, install, and run the
   project on their local development environment.
-->

1. **Clone the repository:**

   ```sh
   # Clone the AnimeBOX repository from GitHub
   git clone https://github.com/josemak25/animebox.git
   # Navigate to the project directory
   cd animebox
   ```

2. **Install dependencies:**

   ```sh
   # Install all required packages and dependencies
   yarn install
   ```

3. **Run the app:**

   ```sh
   # Start the Expo development server
   yarn start
   ```

<!--
   🧩 HTML Data Parsing Approach
   Explains how the app parses and transforms data from animepahe.ru.
   Details the technical approach to reverse engineering and data extraction.
-->

## 🧩 HTML Data Parsing Approach

<!--
   Parsing methodology:
   Technical details about how the application extracts and transforms
   data from the target website into usable JSON format.
-->

- Uses custom helpers to fetch and parse HTML from animepahe.ru
- Extracts relevant data (titles, episodes, streams) from PHP-based responses
- Converts to JSON for use in the app's state and UI
- Handles anti-bot and security measures where possible

<!--
   📚 Documentation
   Links to additional documentation and guides for contributors and
   maintainers. Provides comprehensive resource list for project understanding.
-->

## 📚 Documentation

<!--
   Documentation links:
   Complete list of available documentation resources for developers,
   contributors, and maintainers to understand the project.
-->

- **Project Structure:** [`docs/STRUCTURE.md`](docs/STRUCTURE.md)
- **Contribution Guide:** [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md)
  _(if available)_
- **Code Review Standards:**
  [`.github/copilot-instructions.md`](.github/copilot-instructions.md)

<!--
   🤝 Contributing
   Guidelines for contributing to the project and submitting pull requests.
   Outlines the process for community involvement and code contributions.
-->

## 🤝 Contributing

Contributions are welcome! Please read the
[contribution guidelines](docs/CONTRIBUTING.md) and
[code of conduct](.github/CODEOWNERS) before submitting a pull request.

<!--
   Contribution workflow:
   Step-by-step process for contributors to follow when submitting
   changes to the project.
-->

- Fork the repo and create your branch from `develop`
- Ensure code passes all lint, type, and test checks
- Write tests for new features (see `/helpers/__tests__/` for examples)
- Follow the PR template and code review checklist

<!--
   🧪 Testing
   Instructions for running tests and ensuring code quality.
   Details the testing approach and coverage requirements.
-->

## 🧪 Testing

<!--
   Testing commands:
   Instructions for running the test suite and maintaining code quality
   through comprehensive testing coverage.
-->

- Run all tests:

  ```sh
  # Execute the complete test suite with Jest
  yarn test
  # Run tests with coverage reporting
  yarn test --coverage
  # Run tests in watch mode for development
  yarn test --watch
  ```

- Test coverage is enforced for all helpers and utilities

<!--
   🛡️ Quality & Code Review
   Describes the automated review process and quality standards.
   Explains the quality assurance measures and review workflow.
-->

## 🛡️ Quality & Code Review

<!--
   Quality assurance process:
   Details about automated reviews, quality standards, and the workflow
   that ensures code quality and consistency across the project.
-->

- Automated code review via GitHub Copilot and custom workflow
- PRs are blocked if flagged issues are found (see workflow in
  `.github/workflows/auto-request-copilot.yml`)
- Follow [project standards](.github/copilot-instructions.md) for code,
  documentation, and testing

<!--
   📄 License
   Licensing information for the project.
   Specifies the terms under which the project is distributed.
-->

## 📄 License

<!--
   License details:
   Information about the project's license and legal terms for usage
   and distribution.
-->

MIT License. See [LICENSE](LICENSE) for details.

---

<!--
   Legal disclaimer:
   Important notice about the project's relationship with animepahe.ru
   and responsible usage guidelines.
-->

<!--
   Disclaimer: This project is not affiliated with animepahe.ru. Use responsibly
   and respect the site's terms of service.
-->

_This project is not affiliated with animepahe.ru. Use responsibly and respect
the site's terms of service._
