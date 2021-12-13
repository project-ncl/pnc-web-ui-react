# Storybook

https://storybook.js.org/

We are using storybook version **6.4.4**.

## Running storybook on your machine

Firstly, you must install the needed dependencies using **npm install**, afterwards use the following command which will build and open storybook:

```bash
# Starts Storybook in development mode
npm run storybook
```

## [done] Installation

> Following steps are already done, they don't need to be performed again.

```bash
# Add Storybook:
npx sb init
```

The above command installed all required dependencies and added the following boilerplate code:

`.storybook/main.js`:

```javascript
module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/preset-create-react-app'],
  framework: '@storybook/react',
};
```

`.storybook/preview.js`:

```javascript
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};
```

The following line had to be added to **.storybook/preview.js** to correctly load patternfly styles:

```javascript
import '@patternfly/react-core/dist/styles/base.css';
```

Scripts needed to build and load storybook were also automatically generated and added into **package.json**.

The rest of the generated boilerplate code was deleted, as it was not needed.
