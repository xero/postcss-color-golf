# The `preferHex` Option: _"Breaking Ties on the Green"_

When postcss-color-golf minifies a color, it always chooses the shortest legal CSS representation—whether that's a named color (like `red`) or a hex code (like `#f00`).
But what if both forms are exactly the same length? That's where the `preferHex` option comes in—think of it as your color minification "tie-breaker club"!

## What Does `preferHex` Do?

- If `preferHex` is `true` (the default), the plugin will use hex notation (`#00f`) when a named color and a hex code are the same length.
- If `preferHex` is `false`, the plugin will use the named color (`blue`) in those tie-breaker situations.

This only affects cases where both forms are equally short. For example:

| Input Color   | preferHex: true | preferHex: false |
|---------------|-----------------|------------------|
| `red`         | `red` †         | `red`            |
| `#f00`        | `#f00`          | `red`            |
| `blue`        | `#00f`          | `blue`           |
| `#00f`        | `#00f`          | `blue`           |
| `yellow`      | `#ff0`          | `#ff0`           |
| `#ff0`        | `#ff0`          | `#ff0`           |
| `aqua`        | `#0ff`          | `#0ff`           |
| `#0ff`        | `#0ff`          | `aqua`           |
| `cyan`        | `#0ff`          | `aqua` ‡         |

_† "red" is shorter (3 characters) than "#f00" (4 characters)_

_‡ cyan and aqua are color synonmns, and aqua comes first alphabetically_

## Why Would I Change This?

- **Consistency:** If you want all your colors to use hex codes wherever possible, leave `preferHex` as `true`.
- **Readability:** If you prefer named colors for clarity, set `preferHex` to `false`.
- **Bundle Size:** In practice, the difference is usually just a few bytes, but for the ultimate CSS golf, every character counts!

## Example Usage

```js
postcssColorGolf({
  preferHex: false // Use named colors for tie-breakers
});
```

## Technical Details

- The plugin compares the length of the shortest valid hex and the shortest valid named color for each color value.
- If one is shorter, it always chooses the shortest.
- If both are the same length, `preferHex` decides which to use.

## More Reading

- [CSS Color Module Level 4: Short Hex Notation Proposal](https://drafts.csswg.org/css-color-4/#hex-notation)
- [MDN: <color> CSS Data Type](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value)
- [postcss-color-golf README](../README.md)
