<!-- markdownlint-disable --><!-- textlint-disable -->

# 📓 Changelog

All notable changes to this project will be documented in this file. See
[Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.0](https://github.com/sanity-io/ui/compare/v1.0.3...v2.0.0) (2024-03-22)

### ⚠ BREAKING CHANGES

- Changed the way ESM/CJS is handled, defaulting to ESM mode with `type: 'module'` and using the `.js` extension by default. CommonJS imports are now done through a `.cjs` extension implicitly. While this _shouldn't_ be breaking, getting bundlers and environments conditional loading "just right" is a complex and sometimes brittle process. If you run into issues, please let us know.

### Bug Fixes

- correct hasHMR check in ESM mode ([92a69e2](https://github.com/rexxars/use-hot-module-reload/commit/92a69e2df1252cfdf8079b560f96ececda1ca282))
