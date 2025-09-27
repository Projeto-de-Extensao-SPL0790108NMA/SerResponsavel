# Contributing to RespSoc

Thank you for investing your time in improving RespSoc. The goal of this document is to make it easy to understand how to get started, what we expect from contributors, and how to submit high-quality changes.

## Code of Conduct

Please read and follow the [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). We enforce it across issues, pull requests, and any other channel used for the project.

## Getting Started

1. Fork the repository and clone your fork locally.
2. Install the project dependencies with `pnpm install`.
3. Copy `.env.example` to `.env` and adjust the values as needed for local development.
4. Start the development server with `pnpm dev`.
5. Run `pnpm lint` and `pnpm test` to ensure your environment is healthy.

We recommend using the latest active LTS version of Node.js together with the `pnpm` version pinned in `package.json`.

## Working on Issues

- **Look for good first issues.** Search the open issues for labels such as `good first issue` or `help wanted`.
- **Discuss before you build.** If you want to work on an unassigned task, leave a comment first to avoid duplicate efforts.
- **Report bugs clearly.** Follow the bug report template and provide reproduction steps and expected vs actual behavior.
- **Propose features thoughtfully.** Explain the problem a feature will solve before discussing implementation details.

## Development Workflow

1. Create a feature branch from `main` (`git checkout -b feat/add-new-feature`).
2. Make focused commits. Keep changes scoped to a single problem whenever possible.
3. Ensure formatting and linting pass: `pnpm lint` and `pnpm format` when needed.
4. Run the test suite with `pnpm test` (and add new tests when behavior changes).
5. Push your branch and open a pull request.

## Commit Messages

This project uses Conventional Commits via `commitlint`. Use verbs such as `feat`, `fix`, `docs`, `chore`, etc., followed by a short summary. Example:

```
feat(auth): support social login providers
```

If your change introduces breaking alterations, add `!` (for example `feat!:`) and explain the breaking change in the commit body.

## Pull Requests

- Keep pull requests small and focused. Large PRs are difficult to review.
- Use the provided pull request template and fill in each section.
- Reference related issues (`Closes #123`).
- Add screenshots or terminal output when they help reviewers understand the change.
- Ensure tests and lint checks pass in CI before requesting a review.

## Documentation

Update documentation or inline comments whenever you change behavior or add new features. The README and files inside `docs/` should stay accurate and current.

## Releases and Deployments

Maintainers handle tagging, releases, and deployments. Coordinate with them if your contribution requires special deployment steps.

If you have any questions, open an issue or reach out via the contact details in the README. We appreciate every contribution!
