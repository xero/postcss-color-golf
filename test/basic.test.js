import { describe, it, expect } from "vitest";
import postcss from "postcss";
import colorGolf from "../postcss-color-golf.js";

describe("postcss-color-golf", () => {
  it("minifies color values", async () => {
    const input = `a { color: rgb(255,0,0); background: aliceblue; border: 1px solid #aabbcc; }`;
    const output = `a { color: #f00; background: #f0f8ff; border: 1px solid #abc; }`;
    const result = await postcss([colorGolf()]).process(input, { from: undefined });
    expect(result.css).toBe(output);
  });
});
