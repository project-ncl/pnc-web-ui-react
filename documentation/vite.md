# Project's build tool

This project uses [Vite](https://vite.dev/) as the development server and build tool for production.

Create React App was used as a build tool before, but was migrated to Vite. The migration was done entirely manually, without using any automated tools. Old dependencies (such as `react-scripts`) were replaced with new ones (such as `vite`).

## vite-tsconfig-paths

This Vite plugin is needed for the [tsconfig.json](../tsconfig.json)'s `baseUrl` property to work correctly in the imports.
