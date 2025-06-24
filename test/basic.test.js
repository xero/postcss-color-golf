import { describe, it, expect } from "vitest";
import postcss from "postcss";
import postcssColorGolf from "../dist/index.mjs";

describe("postcss-color-golf",()=>{
  it("minifies color values",async()=>{
    const input=`a { color:rgb(255,0,0); background:aliceblue; border:1px solid #aabbcc; }`;
    const result=await postcss([postcssColorGolf()]).process(input,{from:undefined});
		expect(result.css).toContain("color:#f00;");
    expect(result.css).toContain("background:#f0f8ff;");
    expect(result.css).toContain("border:1px solid #abc;");
  })
});
