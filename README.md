# PNC React based Web UI (v2)

## Bootstrapping

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Too see more details about bootstrapping, open [documentation/bootstrapping.md](./documentation/bootstrapping.md)

[2025-09] This project was migrated from Create React App to [Vite](https://vite.dev/). To see more information about migration, open [documentation/vite.md](./documentation/vite.md)

## Changelog

[Changelog](https://github.com/project-ncl/pnc-web-ui-react/wiki/Changelog)

## Prerequisites

1. See `"engines"` in [package.json](./package.json) for minimum version requirements (for example `node` and `npm`)
2. `Prettier`, see [documentation/prettier.md](./documentation/prettier.md)
3. `EditorConfig`, see [documentation/editor-config.md](./documentation/editor-config.md) (optional)

## Code Editor

Preferred code editor is `Visual Studio Code`. Settings config file is also included in `.vscode` directory.

## Workflows

Contribute using [GitHub flow](https://guides.github.com/introduction/flow/), once new Pull request is created, [GitHub Workflows](https://github.com/project-ncl/pnc-web-ui-react/tree/main/.github/workflows) are started and jobs consisting of building and testing are executed.

First prepare project locally:

```bash
git clone <yourGitForkUrl> pnc-web-ui-react
cd ./pnc-web-ui-react/
npm install
```

Then choose one of the following options:

**1) Development**

```bash
npm start   # runs the app in the development mode on: http://localhost:3000
```

**2) Build**

```bash
npm run build   # builds the app for production to the dist folder
```

**3) Preview**

```bash
npm run preview  # runs the production build from dist folder (only for testing purposes)
```

## Release

not available yet

## Unit Tests

Unit tests are integrated for all components, you can use the following commands to run the unit tests for modified components:

```bash
npm run test   # run tests for those components that was modified.
```

If you want to run all tests, press `a`.

### Update Snapshots for Unit Test

Snapshot Test was integrated in some components. Update for snapshots is required if the UI layout is changed.

To update the snapshops of a component:

**1a) Run unit test**

```bash
npm run test   # run tests for those components that was modified.
```

**Make sure you have `snapshot failed` only from the console output.**

**2) Trigger update snapshots**

Press `u` to update failing snapshots.

**1b) Run vitest update**

Alternatively, trigger snapshots update directly.

```bash
npx vitest --update
```
