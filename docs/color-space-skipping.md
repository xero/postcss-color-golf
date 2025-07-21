# ⛳️ PostCSS Color Golf Documentation

## Color Space Skipping Options: _"Bouncing Over Color Hazards"_

postcss-color-golf gives you fine-grained control over which color spaces are minified. This is especially useful when working with advanced or wide-gamut color spaces that may be **approximated** when converted to standard CSS formats (like sRGB hex or named colors).

### Why Skip Certain Color Spaces?

Some color spaces (like `lab`, `oklab`, `display-p3`, etc.) cannot be represented exactly in standard CSS color formats. When minified, these colors are **approximated** to the nearest supported value, which may result in slight color shifts.
If you want to avoid any risk of color changes, you can instruct postcss-color-golf to skip minifying colors from these spaces.

---

### Options

#### `ignoreApproximatedSpaces` (boolean)

If `true`, postcss-color-golf will skip minifying any color value that uses a color space known to be approximated when converted to CSS.

**Example:**
```js
postcssColorGolf({
  ignoreApproximatedSpaces: true
});
```
With this option enabled, colors like `lab(75% 0 0)`, `oklab(0.5 0 0)`, or `color(display-p3 1 0 0)` will be left unchanged.

---

#### `ignoredSpaces` (string[])

You can specify an explicit list of color space names to skip minifying.
This gives you even more control—skip only the spaces you care about.

**Example:**
```js
postcssColorGolf({
  ignoredSpaces: ["lab", "oklab", "display-p3"]
});
```
With this option, only colors in the listed spaces will be skipped. All other colors will be minified as usual.

---

### What Color Spaces Are Considered "Approximated"?

The following color spaces are considered "approximated" by default:

- `lab`
- `lch`
- `luv`
- `din99`
- `din99o`
- `din99d`
- `oklab`
- `oklch`
- `okhsl`
- `okhsv`
- `jzazbz`
- `yiq`
- `xyz`
- `xyb`
- `ictcp`
- `display-p3`
- `rec2020`
- `a98-rgb`
- `prophoto-rgb`
- `gray`
- `cubehelix`

These spaces are not natively supported by browsers and will be approximated to sRGB or hex when minified.

---

### How It Works

- If `ignoreApproximatedSpaces` is `true`, any color value containing one of the above space names will be skipped.
- If `ignoredSpaces` is provided, only those spaces provided will be skipped.
- You can use both options together for maximum flexibility.

---

### Examples

#### Skip All Approximated Spaces

```js
postcssColorGolf({
  ignoreApproximatedSpaces: true
});
```
- `lab(75% 0 0)` → stays as `lab(75% 0 0)`
- `oklab(0.5 0 0)` → stays as `oklab(0.5 0 0)`
- `rgb(255,0,0)` → minified to `#f00` or `red`

#### Skip Only Specific Spaces

```js
postcssColorGolf({
  ignoredSpaces: ["display-p3", "rec2020"]
});
```
- `color(display-p3 1 0 0)` → stays as `color(display-p3 1 0 0)`
- `lab(75% 0 0)` → minified to hex or named color

#### Skip Both (Union)

If both options are set, any color space in either list will be skipped.

---

### Tips

- Use these options if you want to guarantee that your colors will not shift due to color space conversion.
- For most projects, minifying all colors is safe and results in the smallest CSS.
- If you use advanced color spaces for design fidelity, consider skipping them to preserve exact values.

---

### See Also

- [Culori Color Spaces Documentation](https://culorijs.org/color-spaces/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [postcss-color-golf README](../README.md)
---

[← Back to PostCSS Color Golf Documentation Table of Contents](./README.md) ⛳️

**License:** CC0 1.0 Universal / Public Domain / KOPIMI ⟁
