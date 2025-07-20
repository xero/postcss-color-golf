# API Reference: postcss-color-golf

This document describes all configuration options, usage patterns, and integration details for the postcss-color-golf plugin.

---

## Plugin Usage

### Basic Usage

```js
// postcss.config.js (CommonJS)
module.exports = {
  plugins: [
    require('postcss-color-golf')({
      // options here
    })
  ]
};
```

```js
// ESM or modern bundlers
import postcss from "postcss";
import postcssColorGolf from "postcss-color-golf";

postcss([
  postcssColorGolf({ /* options */ })
]).process(cssString).then(result => {
  console.log(result.css);
});
```

---

## Options

All options are optional. Defaults are shown.

| Option                    | Type      | Default | Description                                                                                  |
|---------------------------|-----------|---------|----------------------------------------------------------------------------------------------|
| `preferHex`               | boolean   | `true`  | Prefer hex over named color when output is the same length.                                  |
| `ignoreApproximatedSpaces`| boolean   | `false` | If true, skips minifying colors from spaces that may be approximated (lab, oklab, etc).      |
| `ignoredSpaces`           | string[]  | `[]`    | List of color space names to skip minifying (e.g. `["lab", "oklab"]`).                       |
| `skip`                    | (string\|RegExp)[] | `[]` | List of CSS property names or regex patterns to skip (see [Skip Rules](./skip-rules.md)).    |

### Option Details

#### `preferHex`
- **Type:** `boolean`
- **Default:** `true`
- **Description:**
  If `true`, hex notation is preferred over named colors when both are the same length.
  See [preferHex documentation](./prefer-hex.md).

#### `ignoreApproximatedSpaces`
- **Type:** `boolean`
- **Default:** `false`
- **Description:**
  If `true`, skips minifying colors from color spaces that may be approximated (e.g., lab, oklab, display-p3).
  See [color space skipping](./color-space-skipping.md).

#### `ignoredSpaces`
- **Type:** `string[]`
- **Default:** `[]`
- **Description:**
  Explicit list of color space names to skip minifying.
  See [color space skipping](./color-space-skipping.md).

#### `skip`
- **Type:** `(string|RegExp)[]`
- **Default:** `[]`
- **Description:**
  List of CSS property names or regex patterns to skip.
  See [skip rules documentation](./skip-rules.md).

---

## Return Value

The plugin returns a standard [PostCSS plugin object](https://postcss.org/api/#plugin), compatible with all PostCSS v8+ workflows.

---

## Integration

- **PostCSS v8+** is required.
- Works with both CommonJS and ESM module systems.
- Compatible with all major build tools (Webpack, Vite, Parcel, etc.) via PostCSS.

---

## Example: Full Configuration

```js
postcssColorGolf({
  preferHex: false,
  ignoreApproximatedSpaces: true,
  ignoredSpaces: ["lab", "oklab"],
  skip: [
    "content",
    "font-family",
    "regex:^\\.ignore-",
    "regex:color$:i"
  ]
});
```

---

## See Also

- [README](../README.md)
- [Skip Rules](./skip-rules.md)
- [Color Space Skipping](./color-space-skipping.md)
- [Color Minification Logic](./color-minification-logic.md)
- [preferHex Option](./prefer-hex.md)
