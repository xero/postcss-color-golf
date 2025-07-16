import { describe, it, expect } from "vitest";
import postcss from "postcss";
import postcssColorGolf from "../dist/index.mjs";

describe("postcss-color-golf",()=>{
  it("minifies color values",async()=>{
    const input=`
			a { color:rgb(255,0,0);background:aliceblue;border:1px solid #aabbcc; }
			b { color:rgba(255, 170, 187); }
			c { background:rgba(255, 170, 187, 0.8) };
			d { color:rgb(255, 255, 255, 1); }
			e { color:rgb(0, 255, 0, 0.8); }
		`;
    const result=await postcss([postcssColorGolf()]).process(input,{from:undefined});
		expect(result.css).toContain("color:red;");
    expect(result.css).toContain("background:#f0f8ff;");
    expect(result.css).toContain("border:1px solid #abc;");
    expect(result.css).toContain("color:#fab");
    expect(result.css).toContain("background:#fabcc");
    expect(result.css).toContain("color:#fff");
    expect(result.css).toContain("color:#0f0c");
  })
});
