# PNC React based Web UI (v2)

## Bootstrapping

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). Too see more details about bootstrapping, open [documentation/bootstrapping.md](./documentation/bootstrapping.md)

## Changelog

[Changelog](https://github.com/project-ncl/pnc-web-ui-react/wiki/Changelog)

## Prerequisites

1. `Node.js` version >= 14
2. `NPM` version >= 7
3. `Prettier`, see [documentation/prettier.md](./documentation/prettier.md)

## Workflows

Contribute using [GitHub flow](https://guides.github.com/introduction/flow/), once new Pull request is created, [GitHub Workflows](https://github.com/project-ncl/pnc-web-ui-react/tree/main/.github/workflows) are started and jobs consisting of building and testing are executed.

To see more details about scripts added by Create React App, open [documentation/README_CRA.md](./documentation/README_CRA.md)

First prepare project locally:

```bash
git clone <yourGitForkUrl> pnc-web-ui-react
cd ./pnc-web-ui-react/
npm install
```

Then choose one of the following options:

**1) Development**

```bash
npm start   # runs the app in the development mode and open http://localhost:3000
```

**2) Build**

```bash
npm run build   # builds the app for production to the build folder
```

## Release

not available yet

## Unit Tests

Unit tests with are integrated with all components, you can follow scripts to run the unit tests for modified components:

```bash
npm run test   # run tests for those components that was modified.
```

If you want to run all tests, then press `w` to show more(sometime not needed) and press `a` to run all tests.

### Update Snapshots for Unit Test

Snapshot Test was integrated in some components. Update for snapshots is required if the UI layout is changed.

To update the snapshops of a component:

**1) Run unit test**

**Make sure you have `snapshot failed` only from the console output.**

**2) Trigger update snapshots**

Press `w` to show more(sometime not needed) and press `u` to update failing snapshots.
