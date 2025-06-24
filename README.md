# postcss-code-golf

> "the code golfer’s color minifier for CSS!"

[![npm version](https://img.shields.io/npm/v/postcss-code-golf.svg)](https://www.npmjs.com/package/postcss-code-golf)

A **PostCSS plugin** that aggressively minifies CSS color values:
- Shortens hex codes (e.g. `#aabbcc` → `#abc`)
- Converts `rgb()`/`rgba()` to hex when shorter
- Replaces color names with their shortest possible equivalent
- Designed for those who want the absolute smallest CSS output—especially for code golf!

---

## Install

With **npm**:
```bash
npm install postcss-code-golf --save-dev
```

With **bun**:
```bash
bun add postcss-code-golf
```

---

## Usage

Add `postcss-code-golf` to your PostCSS plugins:

```js
import postcss from "postcss";
import postCssCodeGolf from "postcss-code-golf";

postcss([
  postCssCodeGolf()
]).process(YOUR_CSS).then(result => {
  console.log(result.css);
});
```

### With postcss.config.js

```js
export default {
  plugins: [
    require("postcss-code-golf")()
  ]
}
```

---

## TypeScript Usage

Type definitions are included!

```typescript
import postcss from "postcss";
import postCssCodeGolf from "postcss-code-golf";

postcss([postCssCodeGolf()]).process(cssString).then(result => {
  console.log(result.css);
});
```

---

## What does it do?

- **Shortens hex codes:**
  `#aabbcc` → `#abc`
- **Converts rgb/rgba to hex:**
  `rgb(255,0,0)` → `#f00`
  `rgba(0,255,0,0.5)` → `#0f080`
- **Replaces color names:**
  `blue` → `#00f`, `fuchsia` → `#f0f`
- **Aggressive color minification:**
  Optimizes every color value it finds for the shortest possible output.

---

## Examples

### Input

```css
a {
  color: rgb(255,0,0);
  background: aliceblue;
  border: 1px solid #aabbcc;
  box-shadow: 0 0 3px rgba(0,255,0,0.5);
}
```

### Output

```css
a {
  color: #f00;
  background: #f0f8ff;
  border: 1px solid #abc;
  box-shadow: 0 0 3px #0f080;
}
```

---

## Options

There are no options currently, just plug it in and go!

---

## License

**CC0 1.0 Universal (Public Domain Dedication)**
Use it for anything, commercial or personal, with or without attribution.

[PostCSS]: https://github.com/postcss/postcss
