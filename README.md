# postcss-color-golf [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

> _the code golfer’s color minifier for CSS!_

[![npm version](https://img.shields.io/npm/v/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![Types Included](https://img.shields.io/badge/types-included-blue.svg)](./dist/index.d.ts)
[![PostCSS plugin](https://img.shields.io/badge/postcss-plugin-blue.svg?logo=postcss)](https://github.com/postcss/postcss)
[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postcss-color-golf)](https://bundlephobia.com/result?p=postcss-color-golf)

A **PostCSS plugin** that aggressively minifies CSS color values:
- Shortens hex codes (`#aabbcc` → `#abc`)
- Converts `rgb()`/`rgba()` to hex when shorter
- Replaces color names with their shortest possible equivalent
- Designed to produce the most compact CSS output—for you code golfers!
- Works with {all/most?} other postcss plugins in the ecosystem

---

## Install

```bash
npm install postcss-color-golf --save-dev
```
_or_
```bash
bun i postcss-color-golf --dev
```
---

## Usage

### postcss.config.js

```js
module.exports = {
  plugins: [
    require("postcss-color-golf")
    // ...other plugins
  ]
};
```

### ESM (Node ≥ 12+ modern bundlers)

```js
import postcss from "postcss";
import postcssColorGolf from "postcss-color-golf";

postcss([
  postcssColorGolf()
]).process(YOUR_CSS).then(result => {
  console.log(result.css);
});
```

### CommonJS (require)

```js
const postcss = require("postcss");
const postcssColorGolf = require("postcss-color-golf");

postcss([
  postcssColorGolf()
]).process(YOUR_CSS).then(result => {
  console.log(result.css);
});
```

### TypeScript

```ts
import postcss from "postcss";
import postcssColorGolf from "postcss-color-golf";

postcss([postcssColorGolf()]).process(cssString).then(result => {
  console.log(result.css);
});
```

---

## What does it do?

- **Aggressive color minification:**
Optimizes every color value it finds for the shortest possible output.
- **Shortens hex codes:**
    `#aabbcc` → `#abc`
- **Converts rgb/rgba to hex:**
    `rgb(255,0,0)` → `#f00`
    `rgba(0,255,0,0.5)` → `#0f080`
- **Replaces color names:**
    `rgb(255,0,0)` → `red`
    `blue` → `#00f`, `fuchsia` → `#f0f`

---

## Example

**Input:**
```css
a {
  --ts-color-black:#000000;
  color: rgb(255,0,0);
  background: aliceblue;
  border: 1px solid #aabbcc;
  box-shadow:0 0 3px rgba(0,255,0,0.5);
  &::hover {border-color:fuchsia}
}
```

**Output:**
```css
a {
  --ts-color-black:#000;
  color: red;
  background: #f0f8ff;
  border: 1px solid #abc;
  box-shadow:0 0 3px #0f080;
  &::hover {border-color:#f0f}
}
```

__Note: This plugin strictly replaces color code strings, while respecting spaces and other surrounding characters.__

---

## Options

Currently, there are no options—just plug it in and go!
Future versions may add configuration for specific minification strategies.

---

## License

**CC0 1.0 Universal (Public Domain Dedication)**
Use it for anything, commercial or personal, with or without attribution.

[PostCSS]: https://github.com/postcss/postcss
