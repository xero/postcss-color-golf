# postcss-color-golf [<img src="https://postcss.github.io/postcss/logo.svg" alt="PostCSS Logo" width="90" height="90" align="right">][PostCSS]

> ⛳️ **postcss-color-golf: The only CSS color minifier with a killer short game.**
> Make every color a hole-in-one for your bundle size! 🏌️‍♂️

[![npm version](https://img.shields.io/npm/v/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![Types Included](https://img.shields.io/badge/types-included-blue.svg)](./dist/index.d.ts)
[![PostCSS plugin](https://img.shields.io/badge/postcss-plugin-blue.svg?logo=postcss)](https://github.com/postcss/postcss)
[![License: CC0-1.0](https://img.shields.io/badge/license-CC0--1.0-blue.svg)](LICENSE)
[![npm downloads](https://img.shields.io/npm/dm/postcss-color-golf.svg)](https://www.npmjs.com/package/postcss-color-golf)
[![bundle size](https://img.shields.io/bundlephobia/minzip/postcss-color-golf)](https://bundlephobia.com/result?p=postcss-color-golf)

---

## 🏌️ Why use postcss-color-golf?

- **A hole-in-one for your color values:**
  Shrinks every color down to the shortest, valid CSS output—no mulligans, no gimmicks.
- **Spec-compliant to the last putt:**
  Always produces legal CSS color codes—no risky “foot wedge” pseudo-shorts.
- **A caddy for your palette:**
  Swaps in color names, hex, or RGB/RGBA—whichever is shortest for each hole.
- **Ultra-compatible:**
  Works with PostCSS v8+, ESM, CJS, and TypeScript. Plays nice with your whole plugin bag.
- **Flexible play:**
  Customizable if you want to tweak your strategy (see options).

---

## 🟢 Features

- **Hex Shortening:**
  - Shortens `#aabbcc` → `#abc` and `#aabbccdd` → `#abcd` only when _all pairs match_ (per CSS spec—no “foot wedge” hacks).
  - Never outputs non-standard pseudo-shorts like `#abcc` for `#aabbccc0`.
- **RGB/RGBA Conversion:**
  - Converts `rgb()`/`rgba()` to hex if that’s a better shot.
  - Handles alpha like a pro, always going for the legal shortcut.
- **Color Name Replacement:**
  - Sinks your color to the shortest form:
    - `#f00` → `red` (a one-stroke win!)
    - `fuchsia` → `#f0f` (when it's shorter)
- **Spec-Compliance Guarantee:**
  - Always produces valid CSS color codes. If you can putt it on the green, it’ll work in every browser.
- **Transparency handled:**
  - Knows when to use `transparent`—no need for a lost ball search.
- **No color stuck in the rough:**
  - Ignores comments and strings, only minifies what’s in play.

---

## 📦 Install

```bash
npm install postcss-color-golf --save-dev
```
_or_
```bash
bun i postcss-color-golf --dev
```

---

## ⚙️ Usage

> **Note:**
> `postcss-color-golf` supports ESM (`import`) and CommonJS (`require`).

### postcss.config.js

```js
module.exports = {
  plugins: [
    require("postcss-color-golf")
    // ...other plugins
  ]
};
```

### ESM (Node ≥ 12+, modern bundlers)

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

## 🛠️ API

```
postcssColorGolf([options])
```

**Options:**

| Option      | Type    | Default | Description                                                                                  |
|-------------|---------|---------|----------------------------------------------------------------------------------------------|
| preferHex   | boolean | true    | Prefer hex over named color when output is the same length.                                  |
| smallest    | boolean | true    | (Ignored for now, always outputs spec-compliant shortest CSS. No non-standard pseudo-short.) |

---

## 🎯 How does the minification tree work?

postcss-color-golf takes every color value and putts it through a rigorous “golf course” of minification, always seeking the shortest legal shot:

1. **Color name or hex?**
   If a CSS color name is the shortest (or a tie and you prefer it), that’s your club.
2. **Can it be short hex?**
   If all pairs are doubled, use 3-digit or 4-digit (`#rgb`, `#rgba`).
   If not, play it safe with 6- or 8-digit.
3. **RGB/RGBA?**
   Converts to hex if that's fewer strokes (characters).
4. **Transparency?**
   Uses 8-digit hex (`#rrggbbaa`) or `transparent` if that's the best play.
5. **Never goes out-of-bounds:**
   Won’t use non-standard pseudo-shorts—every output is a legal move per the CSS spec.

---

## 🎨 Example

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

---

## 🚧 Limitations

- Won’t optimize colors in comments or string values—your gallery is safe.
- Only works with standard CSS color formats (hex, rgb/a, named colors).
- Doesn’t attempt wild color equivalency (no trick shots with HSL, LCH, or device-dependent spaces).
- Always spec-compliant; never fudges a rule.

---

## ⛳️ FAQ

### Why doesn’t it pseudo-shorten, like `#aabbccc0` → `#abcc`?

Because that’s a penalty stroke!
The CSS spec only allows #rgba if _every_ pair matches.
**This plugin guarantees a legal play—your CSS will always render correctly.**

### Will this break my CSS?

Nope!
Every output is a fairway-fresh, standards-compliant CSS color value.

### Does it convert color names to hex and vice versa?

Absolutely!
If a name is shorter, it’s in the hole. If hex is shorter, it’s getting teed up.
You can tweak your preference with the `preferHex` option for tie-breakers.

---

## 🤝 Contributing

Pull requests welcome—bring your best clubs!
- Add tests for every new feature or bugfix.
- Update the README with your new trick shots.

### 🏗️ Building

```bash
npm run build
# or
bun run build
```

### 🧪 Testing

```bash
npm run test
# or
bun run test
```

---

## ⚖️ License

**CC0 1.0 Universal (Public Domain Dedication)**
Use it for anything, commercial or personal, with or without attribution.
(You don’t even have to yell “fore!”)

[PostCSS]: https://github.com/postcss/postcss
