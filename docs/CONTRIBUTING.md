# Contributing to AnimeBOX

Thank you for your interest in contributing to AnimeBOX! Your help is essential for building a robust, high-quality anime data parser and mobile app. This guide will help you get started and ensure a smooth contribution process.

## 🚦 Quick Start

1. **Fork the repository** and clone your fork:

   ```sh
   git clone https://github.com/<your-username>/animebox.git
   cd animebox
   ```

2. **Create a new branch** for your feature or fix:

   ```sh
   git checkout -b feat/your-feature-name
   ```

3. **Install dependencies:**

   ```sh
   yarn install
   ```

4. **Make your changes** and commit with a descriptive message:

   ```sh
   git add .
   git commit -m "feat: add new parser for episode list"
   ```

5. **Push your branch** and open a pull request (PR) against `develop`:

   ```sh
   git push origin feat/your-feature-name
   ```

6. **Fill out the PR template** and ensure all checks pass.

---

## 📝 Contribution Guidelines

- **Base branch:** Always branch from and target `develop` for new features and fixes.
- **Code style:** Follow the existing TypeScript, ESLint, and Prettier rules. Run `yarn lint` and `yarn format` before committing.
- **Testing:** All new features and bug fixes must include tests. Use Jest and follow examples in `helpers/__tests__/`.
- **Documentation:** Update or add documentation as needed (see `docs/STRUCTURE.md`).
- **Commits:** Use [Conventional Commits](https://www.conventionalcommits.org/) for commit messages (e.g., `feat:`, `fix:`, `chore:`).
- **PR template:** Complete all sections of the pull request template for clarity and review efficiency.
- **No console.log:** Use proper error handling and logging patterns (see `.github/copilot-instructions.md`).

## 🧪 Running Tests

- Run all tests:

  ```sh
  yarn test
  ```

- Check test coverage:

  ```sh
  yarn test --coverage
  ```

## 🛡️ Quality & Code Review

- All PRs are subject to automated code review via GitHub Copilot and custom workflows.
- PRs with flagged issues will be blocked from merging until resolved.
- Review the [code review standards](../.github/copilot-instructions.md) before submitting.

## 🤝 Code of Conduct

Please read and follow our [CODEOWNERS](../.github/CODEOWNERS) for collaboration and review responsibilities.

## 💡 Suggestions & Issues

- For feature requests or bug reports, open an issue with clear details and steps to reproduce.
- For questions or ideas, start a discussion or join the project chat (if available).

## 📚 Resources

- [Project Structure](./docs/STRUCTURE.md)
- [Code Review Standards](../.github/copilot-instructions.md)
- [Expo Documentation](https://docs.expo.dev/)
- [Drizzle ORM Docs](https://orm.drizzle.team/docs)

---

Thank you for helping make AnimeBOX better!
