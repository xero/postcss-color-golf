# ⛳️ PostCSS Color Golf Documentation

## Contributing to postcss-color-golf

We welcome contributions of all kinds—bug reports, feature requests, code, and documentation!
This guide will help you get started, understand the project structure, and follow our coding standards.

---

### How to Contribute

1. **Fork the repository** and create a new branch for your changes.
2. **Write clear, focused commits**—one feature or fix per commit is best.
3. **Add or update tests** for any new feature or bugfix.
4. **Update documentation** if your change affects usage or options.
5. **Open a pull request** with a clear description of your changes and why they’re needed.

---

### Running the Project Locally

#### Install Dependencies

```bash
bun install
## or
npm install
```

#### Build the Plugin

```bash
bun run build
## or
npm run build
```

#### Run Tests

```bash
bun run test
## or
npm run test
```

#### Lint the Code

```bash
bun run lint
## or
npm run lint
```

---

### Coding Standards

- **TypeScript:** All source code is written in TypeScript (`src/`).
- **Linting:** We use ESLint for code quality. See `eslint.config.js`.
- **Formatting:** Follow the existing code style and conventions.
- **Tests:** All new features and bugfixes must include or update unit tests (`tests/`).
- **Documentation:** Update or add docs in `docs/` and `README.md` as needed.

---

### Project Structure

| Path/File                | Purpose/Description                                              |
|--------------------------|------------------------------------------------------------------|
| `bun.lockb`              | Bun lockfile for reproducible installs                           |
| `CHANGELOG.md`           | Required by PostCSS plugins; tracks all notable changes          |
| `dist/`                  | Compiled output (do not edit directly)                           |
| `docs/`                  | All technical and user documentation                             |
| `eslint.config.js`       | ESLint configuration for code standards                          |
| `LICENSE`                | Project license (CC0-1.0 Universal)                              |
| `node_modules/`          | Installed dependencies                                           |
| `package.json`           | Project metadata, scripts, dependencies                          |
| `package-lock.json`      | npm lockfile for reproducible installs                           |
| `README.md`              | Project overview and quickstart                                  |
| `src/`                   | TypeScript source files (main plugin logic)                      |
| &nbsp;&nbsp;`index.ts`         | Main plugin entry point                                      |
| &nbsp;&nbsp;`color-minify.ts`  | Color parsing, conversion, and minification logic             |
| &nbsp;&nbsp;`skip.ts`          | Skip rule parsing and matching logic                         |
| `tests/`                 | Unit tests (run with Vitest)                                     |
| `tsconfig.json`          | TypeScript configuration                                         |
| `tsup.config.ts`         | Build configuration for tsup                                     |
| `types/`                 | TypeScript shims for dependencies (e.g., `vuln-regex-detector`)  |
| `.gitignore`             | Files and folders to ignore in git                               |
| `.npmignore`             | Files and folders not to publish to npm                          |

---

### Tips for Contributors

- Keep pull requests focused and easy to review.
- If you’re not sure about a change, open an issue or draft PR to discuss first.
- All code and docs are released under CC0—see `LICENSE` for details.
- If you add a new feature, update the `CHANGELOG.md` and relevant docs.

---

#### Thank you for helping make postcss-color-golf a hole in one! ⛳️

---

[← Back to PostCSS Color Golf Documentation Table of Contents](./README.md) ⛳️

**License:** CC0 1.0 Universal / Public Domain / KOPIMI ⟁
