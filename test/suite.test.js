import {describe, it, expect} from "vitest";
import postcss from "postcss";
import postcssColorGolf from "../dist/index.mjs";

describe("postcss-color-golf",()=>{
  it("minifies color values", async()=>{
    const input=`
      --ts-color-black:#000000;
      a {color:rgb(255,0,0);background:aliceblue;border:1px solid #aabbcc;}
      b {color:rgba(255, 170, 187);}
      c {background:rgba(255, 170, 187, 0.8)};
      d {color:rgb(255, 255, 255, 1);}
      e {color: rgb(0, 255, 0, 0.8);}
      e {color:#0f0}
      e {color:lime}
      f {box-shadow: inset 0 1px 2px rgba(0,0,0,.69), 0 -1px 1px #FFFFFF, 0 1px 0 #FFFFFF;}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("--ts-color-black:#000");
    expect(result.css).toContain("color:red");
    expect(result.css).toContain("background:#f0f8ff");
    expect(result.css).toContain("border:1px solid #abc");
    expect(result.css).toContain("color:#fab");
    expect(result.css).toContain("background:#fabc");
    expect(result.css).toContain("color:#fff");
    expect(result.css).toContain("color: #0f0c"); // The exact format
    expect(result.css).toContain("color:#0f0");  // From the direct #0f0 value
    expect(result.css).toContain("box-shadow: inset 0 1px 2px #000000b0");
 });

  it("converts rgb to named colors when shorter", async()=>{
    const input=`
      a {color: rgb(255, 0, 0);}
      b {color: rgb(0, 255, 0);}
      c {color: rgb(0, 0, 255);}
      d {color: rgb(0, 255, 255);}
      e {color: rgb(255, 0, 255);}
      f {color: rgb(255, 255, 0);}
      g {color: rgb(255, 255, 255);}
      h {color: rgb(0, 0, 0);}
    `;
    const result=await postcss([postcssColorGolf({preferHex: true})]).process(input,{from: undefined});

    expect(result.css).toContain("color: red");
    expect(result.css).toContain("color: #0f0");
    expect(result.css).toContain("color: #00f");
    expect(result.css).toContain("color: #0ff");
    expect(result.css).toContain("color: #f0f");
    expect(result.css).toContain("color: #ff0");
    expect(result.css).toContain("color: #fff");
    expect(result.css).toContain("color: #000");
 });

  it("converts rgba to hex with alpha", async()=>{
    const input=`
      a {color: rgba(255, 0, 0, 0.5);}
      b {color: rgba(0, 255, 0, 0.25);}
      c {color: rgba(0, 0, 255, 0.75);}
      d {color: rgba(255, 255, 255, 0.1);}
      e {color: rgba(0, 0, 0, 0.9);}
      f {color: rgba(170, 187, 204, 0.8);}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("color: #ff000080");
    expect(result.css).toContain("color: #00ff0040");
    expect(result.css).toContain("color: #0000ffbf"); // strict, not non-standard
    expect(result.css).toContain("color: #ffffff1a"); // strict, not non-standard
    expect(result.css).toContain("color: #000000e6");
    expect(result.css).toContain("color: #abcc");
 });

  it("shortens hex colors", async()=>{
    const input=`
      a {color: #ff0000;}
      b {color: #00ff00;}
      c {color: #0000ff;}
      d {color: #ffffff;}
      e {color: #000000;}
      f {color: #aabbcc;}
      g {color: #123456;}
      h {color: #ffaa00;}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("color: red");
    expect(result.css).toContain("color: #0f0");
    expect(result.css).toContain("color: #00f");
    expect(result.css).toContain("color: #fff");
    expect(result.css).toContain("color: #000");
    expect(result.css).toContain("color: #abc");
    expect(result.css).toContain("color: #123456");
    expect(result.css).toContain("color: #fa0");
 });

  it("converts named colors to hex when shorter", async()=>{
    const input=`
      a {color: aliceblue;}
      b {color: blanchedalmond;}
      c {color: cornflowerblue;}
      d {color: red;}
      e {color: lime;}
      f {color: blue;}
      g {color: transparent;}
    `;
    const result=await postcss([postcssColorGolf({preferHex: true})]).process(input,{from: undefined});

    expect(result.css).toContain("color: #f0f8ff");
    expect(result.css).toContain("color: #ffebcd");
    expect(result.css).toContain("color: #6495ed");
    expect(result.css).toContain("color: red");
    expect(result.css).toContain("color: #0f0");
    expect(result.css).toContain("color: #00f");
    expect(result.css).toContain("color: transparent");
 });

  it("handles 8-digit hex colors (with alpha)", async()=>{
    const input=`
      a {color: #ff000080;}
      b {color: #00ff0040;}
      c {color: #0000ffbf;}
      d {color: #ffffff1a;}
      e {color: #aabbccdd;}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("color: #ff000080");
    expect(result.css).toContain("color: #00ff0040");
    expect(result.css).toContain("color: #0000ffbf"); // strict, not non-standard
    expect(result.css).toContain("color: #ffffff1a");
    expect(result.css).toContain("color: #abcd");
 });

  it("handles edge cases", async()=>{
    const input=`
      a {color: rgb(255, 255, 255);}
      b {color: rgba(255, 255, 255, 1);}
      c {color: rgba(255, 255, 255, 1.0);}
      d {color: rgb(0, 0, 0);}
      e {color: rgba(0, 0, 0, 0);}
      f {color: rgba(255, 255, 255, 0);}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("color: #fff");
    expect(result.css).toContain("color: #fff");
    expect(result.css).toContain("color: #fff");
    expect(result.css).toContain("color: #000");
    expect(result.css).toContain("color: transparent");
    expect(result.css).toContain("color: transparent");
 });

  it("handles multiple colors in one declaration", async()=>{
    const input=`
      a {
        background: linear-gradient(red, blue, rgba(255, 0, 255, 0.533));
        border: 1px solid rgb(170, 187, 204);
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.3), inset 0 1px white;
     }
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("red, #00f, #f0f8");
    expect(result.css).toContain("border: 1px solid #abc");
    expect(result.css).toContain("box-shadow: 0 0 10px #0000004d, inset 0 1px #fff");
 });

  it("preserves non-color values", async()=>{
    const input=`
      a {
        width: 100px;
        height: 50vh;
        margin: 10px 20px;
        content: "rgb(255, 0, 0)";
        background-image: url("test.jpg");
        transform: rotate(45deg);
     }
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("width: 100px");
    expect(result.css).toContain("height: 50vh");
    expect(result.css).toContain("margin: 10px 20px");
    expect(result.css).toContain('content: "rgb(255, 0, 0)"');
    expect(result.css).toContain('background-image: url("test.jpg")');
    expect(result.css).toContain("transform: rotate(45deg)");
 });

  it("handles case insensitive color names", async()=>{
    const input=`
      a {color: RED;}
      b {color: Blue;}
      c {color: GREEN;}
      d {color: AliceBlue;}
    `;
    const result=await postcss([postcssColorGolf({preferHex: true})]).process(input,{from: undefined});

    expect(result.css).toContain("color: red");
    expect(result.css).toContain("color: #00f");
    expect(result.css).toContain("color: green");
    expect(result.css).toContain("color: #f0f8ff");
 });

  it("handles whitespace variations", async()=>{
    const input=`
      a {color: rgb( 255 , 0 , 0 );}
      b {color: rgba( 255, 255, 255, 0.5 );}
      c {color:rgb(0,255,0);}
      d {color: rgba(0,0,0,.8);}
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

		expect(result.css).toContain("color: red");
		expect(result.css).toContain("color: #ffffff80");
		expect(result.css).toContain("color:#0f0");
		expect(result.css).toContain("color: #000c");
	});

  it("minifies linear-gradient colors", async()=>{
    const input=`
      a {
        background: linear-gradient(red, blue, rgba(0, 255, 0, 0.533));
        background: linear-gradient(red, blue, rgba(255, 0, 255, 0.5));
        background: linear-gradient(red, #FF0000, rgb(255,0,0));
     }
    `;
    const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

    expect(result.css).toContain("red, #00f, #0f08");
    expect(result.css).toContain("red, #00f, #ff00ff80");
    expect(result.css).toContain("red, red, red");
 });

	it("minifies rgba colors to the shortest valid CSS hex form", async()=>{
		const input=`
			a0 {color: rgba(0, 0, 0, 0.5);}
			a1 {color: rgba(255, 0, 0, 0.5);}
			a2 {color: rgba(0, 255, 0, 0.25);}
			a3 {color: rgba(170, 187, 204, 0.8);}
			a4 {color: rgba(0, 0, 255, 0.75);}
			a5 {color: rgba(0, 0, 0, 0.9);}
			`;

		const result=await postcss([postcssColorGolf()]).process(input,{from: undefined});

		expect(result.css).toContain(result.css, "a0 {color: #00000080;}");
		expect(result.css).toContain(result.css, "a1 {color: #ff000080;}");
		expect(result.css).toContain(result.css, "a2 {color: #00ff0040;}");
		expect(result.css).toContain(result.css, "a3 {color: #abcc;}");
		expect(result.css).toContain(result.css, "a4 {color: #0000ffbf;}");
		expect(result.css).toContain(result.css, "a5 {color: #000000e6;}");
	});
});
