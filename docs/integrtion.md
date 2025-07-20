# Integration & Compatibility: _"Get into The Game!"_

This guide explains how to integrate postcss-color-golf into your build process, which environments are supported, and how it works alongside other tools and dependencies.

---

## Runtime Dependencies

To use postcss-color-golf, you (or your build tool) must have the following runtime dependencies installed:

- **postcss** (peer dependency): The core CSS processor.
  _You must install this in your project (version 8.x or higher)._
- **culori**: Modern color parsing, conversion, and formatting library.
  _Used for all color math and color space support._
- **postcss-value-parser**: Efficiently parses and walks CSS value ASTs.
  _Used internally for analyzing and transforming CSS values._
- **vuln-regex-detector**:
  _Used to safely validate user-supplied regex patterns in skip rules._

These are automatically installed if you use npm/bun/yarn/pnpm and install postcss-color-golf, except for `postcss`, which you must install yourself.

---

## Development Dependencies

If you want to contribute to or build postcss-color-golf locally, you’ll also need:

- **eslint**: Linting and code quality.
- **tsup**: TypeScript bundler for building distributable files.
- **typescript**: Type checking and development.
- **vitest**: Unit testing framework.

These are only required for development and are not needed for end users.

---

## Supported Environments

- **PostCSS v8+** is required.
- Works with both **CommonJS** and **ESM** module systems.
- Compatible with all major build tools and bundlers, including:
  - **Webpack** (via postcss-loader)
  - **Vite**
  - **Parcel**
  - **Rollup**
  - **Gulp** (with gulp-postcss)
  - **CLI** (via postcss-cli)
- Supports TypeScript
- Works in both Node.js and modern JavaScript runtimes.

---

## Basic Integration

### With postcss.config.js

```js
module.exports = {
  plugins: [
    require('postcss-color-golf')({
      // options here
    }),
    // ...other plugins
  ]
};
```

### With ESM

```js
import postcss from "postcss";
import postcssColorGolf from "postcss-color-golf";

postcss([
  postcssColorGolf({ /* options */ })
  // ...other plugins
]).process(cssString).then(result => {
  console.log(result.css);
});
```

---

## Using with Other PostCSS Plugins

postcss-color-golf is designed to be compatible with all standard PostCSS plugins.
**Recommended order:** Place postcss-color-golf early in your plugin list, before plugins that might further transform or optimize CSS (like cssnano or autoprefixer).

**Example:**
```js
plugins: [
  require('postcss-color-golf'),
  require('autoprefixer'),
  require('cssnano')
]
```

---

## Compatibility Notes

- **CSS Syntax:**
  Only standard CSS color notations and spaces supported by [Culori](https://culorijs.org/color-spaces/) are minified. Non-standard or custom color functions are ignored.
- **Safe for All CSS:**
  The plugin never minifies colors inside strings, comments, or URLs, ensuring it won't break your CSS.
- **No Side Effects:**
  postcss-color-golf only rewrites color values. It does not modify selectors, at-rules, or other CSS syntax.
- **Works with Source Maps:**
  Fully compatible with PostCSS source maps.

---

## Known Issues & Caveats

- **Advanced Color Spaces:**
  Some color spaces (like lab, oklab, display-p3, etc.) are approximated to sRGB. Use the opt-out options if you need exact values.
- **Legacy PostCSS:**
  PostCSS v7 and below are not supported.
- **Non-CSS Files:**
  Only use on valid CSS files. Results on non-CSS or mixed-content files are undefined.

---

## See Also

- [API Reference](./api.md)
- [Troubleshooting](./troubleshooting.md)
- [Color Space Skipping](./color-space-skipping.md)
- [README](../README.md)
