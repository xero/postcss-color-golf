# ⛳️ PostCSS Color Golf Documentation

## Color Minification Logic: _it's a triple eagle!_

### Understanding Color Spaces and Notations

CSS supports a wide variety of color notations and color spaces, each with its own syntax and use cases:

- **Hexadecimal (`#rrggbb`, `#rgb`, `#rrggbbaa`, `#rgba`)**: The classic CSS color format, supporting both short and long forms, with or without alpha.
- **Named Colors (`red`, `aqua`, `rebeccapurple`, etc.)**: Human-friendly color names defined by the CSS spec.
- **Functional Notations**:
  - **RGB/RGBA (`rgb(255,0,0)`, `rgba(255,0,0,0.5)`)**
  - **HSL/HSLA (`hsl(120, 100%, 50%)`, `hsla(120, 100%, 50%, 0.5)`)**
  - **LAB/LCH (`lab(75% 0 0)`, `lch(54% 106 40)`)**
  - **OKLab/OKLCH (`oklab(0.5 0 0)`, `oklch(0.7 0.1 120)`)**
  - **Wide-gamut spaces (`color(display-p3 1 0 0)`, `color(rec2020 1 0 0)`)**
  - **Gray (`gray(50%)`)**
  - And more, as defined by the CSS Color Module Level 4 and beyond.

### How postcss-color-golf Minifies Colors

Our plugin's goal is to always output the **shortest legal CSS color** for every color value, while guaranteeing that the result is valid and renders correctly in browsers.

#### The Minification Process

1. **Parse with Culori**
   Every color value is parsed using [Culori](https://culorijs.org/), a modern, actively maintained color library. Culori supports all modern and legacy color spaces, ensuring robust parsing and conversion.

2. **Convert to RGB**
   All colors are converted to sRGB (the standard for web browsers) for comparison and output. This ensures that the output is always legal and widely supported.

3. **Format and Compare**
   - The plugin generates all possible legal CSS representations for the color: short hex, long hex, 4-digit hex (for alpha), named color, and `transparent` (for alpha = 0).
   - It then chooses the shortest one, using the `preferHex` option as a tiebreaker if needed.

4. **Alpha Precision**
   - Alpha values are preserved with full precision as supported by CSS (0–1, or 00–ff in hex).
   - If alpha is exactly 0, the plugin outputs `transparent` (when legal).
   - If alpha is less than 1 and all channels can be shortened, 4-digit hex (`#rgba`) is used; otherwise, 8-digit hex (`#rrggbbaa`) is output.

5. **Legal Output Only**
   - The plugin never outputs non-standard or "pseudo-short" hex codes (like `#abcc`).
   - All output is guaranteed to be valid per the CSS spec and will render correctly in all browsers.

6. **Rounding and Approximation**
   - When converting from advanced color spaces (like Lab, Oklab, Display-P3, etc.), some values may be approximated to the nearest sRGB color.
   - Users can opt out of minifying these spaces to avoid any risk of color shift (see [Color Space Skipping](./color-space-skipping.md)).

#### Caveats

- **Whitespace Normalization:**
  The plugin normalizes whitespace and commas in color functions and gradients for spec-compliance and consistency. This may slightly alter formatting but not the meaning of your CSS.

- **Nested Function Minification:**
  Colors inside nested CSS functions (such as gradients) are recursively minified. All supported color notations within these functions will be shortened if possible.

- **Unparseable or Invalid Colors:**
  If a value cannot be parsed as a valid color by Culori, it is left unchanged. The plugin will not throw errors or break your CSS in these cases.

- **No Minification in Strings, Comments, or URLs:**
  Color-like values inside quoted strings, comments, or `url()` functions are intentionally ignored for safety and correctness.

#### Why Culori?

Culori is a well-vetted, community-driven color library trusted by the web development and data visualization communities.
- **Actively maintained:** Regular updates and improvements.
- **Broad support:** Handles all modern and legacy color spaces, including new CSS4+ features.
- **Accuracy:** Uses the latest color science for conversions and rounding.
- **Reliability:** Used in production by many projects and organizations.

By building on Culori, postcss-color-golf ensures your color minification is always up-to-date, robust, and future-proof.

---

### Summary

- **Shortest legal CSS color, every time**
- **Spec-compliant and browser-safe**
- **Powered by Culori for maximum compatibility and accuracy**
- **Handles all color notations and spaces supported by Culori**
- **Options for alpha, approximation, and tiebreakers**

For more details, see:
- [Color Space Skipping](./color-space-skipping.md)
- [The preferHex Option](./prefer-hex.md)
- [Skip Rules](./skip-rules.md)

---

[← Back to Documentation Table of Contents](./README.md)

**License:** CC0 1.0 Universal / Public Domain / KOPIMI ⟁
