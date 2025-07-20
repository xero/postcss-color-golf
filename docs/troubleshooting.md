# ⛳️ PostCSS Color Golf Documentation

---

## Troubleshooting & FAQ

This guide covers common issues, debugging tips, and answers to frequently asked questions about using postcss-color-golf.

---

### My color didn't get minified!

**Possible causes:**
- The color is inside a CSS property or selector that matches your `skip` rules.
  _Check your `skip` option in your config._
- The color is in a color space you opted out of minifying (see `ignoreApproximatedSpaces` or `ignoredSpaces`).
- The value is inside a string, comment, or URL, which are intentionally ignored for safety.
- The color is already in its shortest legal form (e.g., `#f00`, `red`, or `transparent`).

---

### Why did my color change slightly?

- Some color spaces (like `lab`, `oklab`, `display-p3`, etc.) cannot be represented exactly in sRGB/hex/named CSS colors.
  When minified, these are **approximated** to the nearest supported value.
- To avoid this, use the `ignoreApproximatedSpaces` or `ignoredSpaces` options to skip minifying these color spaces.

---

### Why doesn't it output pseudo-short hex codes (like `#abcc`)?

- postcss-color-golf always produces **spec-compliant** CSS color codes.
- Only outputs 3- or 4-digit hex when _all_ pairs match (per the CSS spec).
- Never outputs non-standard or "pseudo-short" hex codes.

---

### Why doesn't it minify colors inside strings or URLs?

- For safety and correctness, the plugin ignores color-like values inside quoted strings and `url()` functions.
- This prevents accidental changes to things like image URLs, font names, or arbitrary content.

---

### Why is "transparent" sometimes used instead of a hex or rgba value?

- If a color is fully transparent (alpha = 0), the plugin outputs `transparent` (when legal), as it's the shortest and most readable form.

---

### Why does my gradient or function have extra spaces?

- The plugin normalizes whitespace for spec-compliance and readability, but if you see unexpected spaces, please [open an issue](https://github.com/your-repo/issues) with a sample input.

---

### How can I debug what is being skipped or minified?

- Start by disabling your `skip` rules and opt-out options to see if the color is minified.
- Add a temporary `console.log` in your build or plugin config to inspect the processed CSS.
- Use [Regex101](https://regex101.com/) to test your skip rule patterns.

---

### Why does the output differ from other minifiers or older versions?

- postcss-color-golf is powered by [Culori](https://culorijs.org/), which uses the latest color science and browser standards.
- Some conversions (especially for advanced color spaces) may differ slightly from legacy tools or older plugin versions.
- All output is guaranteed to be valid CSS and as short as possible.

---

### Still having trouble?

- Double-check your plugin configuration and options.
- Review the [API documentation](./api.md) and [README](../README.md).
- If you believe you've found a bug, please open an issue with a minimal reproducible example.

---

### See Also

- [Skip Rules](./skip-rules.md)
- [Color Space Skipping](./color-space-skipping.md)
- [Color Minification Logic](./color-minification-logic.md)
- [API Reference](./api.md)

---

[← Back to PostCSS Color Golf Documentation Table of Contents](./README.md) ⛳️

**License:** CC0 1.0 Universal / Public Domain / KOPIMI ⟁
