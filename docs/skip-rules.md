# ⛳️ PostCSS Color Golf Documentation

## Skip Rules: _"A Pure RegEx Lay-up!"_

You can skip processing for certain CSS properties, selectors, or at-rules with the `skip` option.

### How Skip Rules Work

- **Plain string:** Matches exactly.
  Example: `'content'` will skip the `content` property everywhere.
- **Regex:** Use `regex:pattern:flags` (e.g. `regex:^\.ignore-me$:` or `regex:^@media:` or `regex:color$:`).
  The pattern is a JavaScript regular expression.
  Flags are optional and follow the last colon (e.g. `i` for case-insensitive).

If any regex is unsafe or invalid, the plugin will throw an error and will not process your CSS.

### Examples

#### Skipping by Property Name

```js
{
  skip: [
    'content',           // skips all `content` properties
    'font-family',       // skips all `font-family` properties
    'counter-reset'      // skips all `counter-reset` properties
  ]
}
```

#### Skipping by Selector or At-rule (Regex)

```js
{
  skip: [
    'regex:^\\.ignore-',         // skips any selector starting with ".ignore-"
    'regex:color$:i',            // skips any property ending with "color" (case-insensitive)
    'regex:^h1$',                // skips the `h1` selector exactly
    'regex:^#main$',             // skips the `#main` id selector exactly
    'regex:^a$',                 // skips the `a` element selector exactly
    'regex:^@media',             // skips all at-rules starting with "@media"
    'regex:^\\.theme-dark$'      // skips the `.theme-dark` class selector exactly
  ]
}
```

#### Regex Flags

- `i` — case-insensitive
- `g` — global (not typically needed for skip rules)
- `m` — multiline

**Example with flags:**
```js
{
  skip: [
    'regex:^color$:i',   // skips "color", "Color", "COLOR", etc.
    'regex:^\\.THEME-',  // skips selectors starting with ".THEME-" (case-sensitive)
    'regex:^\\.theme-:i' // skips selectors starting with ".theme-" (case-insensitive)
  ]
}
```

### What Can Be Skipped?

- **Properties:** Any CSS property name (e.g. `color`, `background-color`, `font-family`)
- **Selectors:** Any selector string (e.g. `.my-class`, `#main`, `h1`, `a`)
- **At-rules:** Any at-rule (e.g. `@media`, `@font-face`)

### Matching Details

- **Plain strings** must match the property/selector/at-rule exactly.
- **Regex** can match any part of the property/selector/at-rule string.
- Regex patterns are anchored if you use `^` (start) or `$` (end).

#### More Examples

| Rule                   | Matches                        | Does NOT Match           |
|------------------------|-------------------------------|--------------------------|
| `'color'`              | `color` property               | `background-color`       |
| `'regex:color$:'`      | `background-color`, `border-color` | `colorful`, `colormap`   |
| `'regex:^h1$:'`        | `h1` selector                  | `h1.title`, `h10`        |
| `'regex:^\\.theme-'`   | `.theme-dark`, `.theme-light`  | `.themed`, `.theme`      |
| `'regex:^#main$:'`     | `#main` selector               | `#main-content`          |
| `'regex:^@media'`      | `@media screen`, `@media print`| `@font-face`             |

### Advanced: Skipping Multiple Patterns

You can combine multiple skip rules for fine-grained control:

```js
{
  skip: [
    'content',
    'font-family',
    'regex:^\\.ignore-',
    'regex:color$:i',
    'regex:^h1$',
    'regex:^@media'
  ]
}
```

This will skip all `content` and `font-family` properties, any selector starting with `.ignore-`, any property ending with `color` (case-insensitive), the `h1` selector, and all `@media` at-rules.

### Error Handling

- If you provide an invalid or unsafe regex, the plugin will throw an error and stop processing.
- Use simple, safe regex patterns for best results.

### Tips

- Use plain strings for exact matches (fastest).
- Use regex for flexible or pattern-based skipping.
- Test your regex patterns at [Regex101](https://regex101.com/) before using them in your config.
- You can mix plain strings and regex rules in the same `skip` array.

### Regex Flavor

postcss-color-golf is a JavaScript tool, so all regex skip rules use the same regular expression syntax as native JavaScript (ECMAScript/ES2018+).
This is very similar to PCRE (Perl Compatible Regular Expressions), but with some differences and limitations.

- You can use all standard JavaScript regex features: character classes, anchors, groups, alternation, quantifiers, lookahead/lookbehind (in modern JS), etc.
- Flags like `i` (case-insensitive), `m` (multiline), and `g` (global) are supported.
- For most skip rules, you will only need simple patterns and the `i` flag.

**References:**
- [MDN: JavaScript Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [ECMAScript RegExp Specification](https://tc39.es/ecma262/#sec-regexp-regular-expression-objects)
- [Regex101 (set flavor to JavaScript)](https://regex101.com/)

### More Reading

- [MDN: Regular Expressions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
- [Regex101 (JavaScript flavor)](https://regex101.com/)
- [ECMAScript RegExp Spec](https://tc39.es/ecma262/#sec-regexp-regular-expression-objects)
- [PCRE vs JavaScript Regex Comparison](https://www.regular-expressions.info/refflavors.html)

---

[← Back to PostCSS Color Golf Documentation Table of Contents](./README.md) ⛳️

**License:** CC0 1.0 Universal / Public Domain / KOPIMI ⟁
