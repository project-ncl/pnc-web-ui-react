# Prettier

https://prettier.io/

## Workflow

> Tip! To get the most from Prettier, run it from your editor, either via a keyboard shortcut or automatically whenever you save a file, see https://prettier.io/docs/en/editors.html

1. Create new changes
2. Create new git commit (pre-commit checks are automatically performed)
3. Were git pre-commit checks successful:

- **yes** = commit is successfully created, done
- **no** = commit was canceled, files need to be formatted first, choose one option:
  - a) format only _specific files_ using editor
  - b) format only _specific files_ using terminal: `npx prettier --write src/App.tsx`
  - c) **not recommended**: format _all files_ using terminal `npm run prettier-write`

## Editor Integration: `Visual Studio Code`

https://github.com/prettier/prettier-vscode

extension:

```
ext install esbenp.prettier-vscode
```

settings:

```
"editor.defaultFormatter": "esbenp.prettier-vscode",
"editor.formatOnSave": true
```

## [done] Installation (2021-06-14)

> Following steps are already done, they don't need to be performed again.

https://prettier.io/docs/en/install.html

```bash
# Install an exact version of Prettier locally in your project. This makes sure that everyone in the project gets the exact same version of Prettier. Even a patch release of Prettier can result in slightly different formatting.
npm install --save-dev --save-exact prettier

npm install --save-dev husky lint-staged
npx husky install
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

`.prettierrc`:

```json
{
  "singleQuote": true,
  "trailingComma": "es5"
}
```

`.prettierignore`:

```
node_modules
build
package-lock.json
.husky
```

`package.json`:

```json
"scripts": {
  "prettier-write": "prettier --write '**/*.{js,jsx,ts,tsx,json,css,scss,md}'",
  "prettier-check": "prettier --check '**/*.{js,jsx,ts,tsx,json,css,scss,md}'"
},

"lint-staged": {
  "**/*.{js,jsx,ts,tsx,json,css,scss,md}": "prettier --check --ignore-unknown"
}
```
