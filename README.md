# postcss-color-golf [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

> _the code golfer’s color minifier for CSS!_

[![npm version](https://img.shields.io/npm/v/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![Types Included](https://img.shields.io/badge/types-included-blue.svg)](./dist/index.d.ts)
[![PostCSS plugin](https://img.shields.io/badge/postcss-plugin-blue.svg?logo=postcss)](https://github.com/postcss/postcss)
[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postcss-color-golf)](https://bundlephobia.com/result?p=postcss-color-golf)

A **PostCSS plugin** that aggressively minifies CSS color values:
- Designed to produce the most compact CSS output—for you code golfers!
- Shortens hex codes
    - `#aabbcc` → `#abc`
- Converts `rgb()`/`rgba()` to hex when shorter
    - `rgba(255, 170, 187, 0.8)` → `#fabcc`
- Replaces color names with shortest possible equivalents
    - fuchsia → `#f0f`
- Replaces hex/rgb values with color names when shorter
    - `#f00` → `red` _(yes 1 char is a win!)_
    - `#ff0000` → `red`
    - `rgb(255,0,0)` → `red`
    - `rgba(255, 0, 0, 1)` → `red`
- Ignores unminifiable or equivalents
    - `lime` → `lime`
    - `#0f0` → `#0f0`
- Compatible with PostCSS v8+ and other plugins in the ecosystem.

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

> **Note:**
> `postcss-color-golf` supports both ESM (`import`) and CommonJS (`require`).
> See [Dual Package Hazard](https://nodejs.org/api/packages.html#dual-package-hazard) for more info.

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

## API

```
postcssColorGolf([options])
```

- **options:** *none currently* (future versions may allow configuration)

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

## Limitations

- Does not parse or optimize colors inside comments or string values.
- Only minifies standard CSS color values (hex, rgb/a, hsl/a, named colors).
- Does not attempt advanced color equivalency (e.g., `#00ff00` vs `lime` in unusual color spaces).

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

_**Note:** This plugin strictly replaces color code strings, while respecting spaces and other surrounding characters._

# Contributing

Project contributions welcomed! Feel free to submit an issue or pull request to this repo.
- Make sure all changes or new features are covered by the unit test(s).
- Ensure the examples in this file are updated to show off the new feature.

## Building

clone the source, install, edit, then run:
```bash
npm run build
```
_or_
```bash
bun run build
```

## Testing

There's a single unit test in `test/basic.test.js` with pretty good coverage. Still lots of room for improvement.

Run the [vite](https://github.com/vitest-dev/vitest) tests with:

```bash
npm run test
```
_or_
```bash
bun run test
```

---

## License

**CC0 1.0 Universal (Public Domain Dedication)**
Use it for anything, commercial or personal, with or without attribution.

[PostCSS]: https://github.com/postcss/postcss
