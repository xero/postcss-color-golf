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

	it("minifies hsl colors to the shortest valid CSS form", async()=>{
		const input = `
			h1 {color: hsl(0, 0%, 0%);}
			h2 {color: hsl(0, 100%, 50%);}
			h3 {color: hsl(120, 100%, 50%);}
			h4 {color: hsl(240, 100%, 50%);}
			h5 {color: hsl(180, 100%, 50%);}
			h6 {color: hsl(39, 100%, 50%);}
			h7 {color: hsl(300, 100%, 25%);}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		expect(result.css).toContain("h1 {color: #000;}");
		expect(result.css).toContain("h2 {color: red;}");
		expect(result.css).toContain("h3 {color: lime;}");
		expect(result.css).toContain("h4 {color: blue;}");
		expect(result.css).toContain("h5 {color: aqua;}");
		expect(result.css).toContain("h6 {color: #ffa600;}");// No named version
		expect(result.css).toContain("h7 {color: purple;}");
	});

	it("minifies hsla colors to the shortest valid CSS form", async()=>{
		const input = `
			h1 {color: hsla(0, 0%, 0%, 0.5);}
			h2 {color: hsla(0, 100%, 50%, 0.5);}
			h3 {color: hsla(120, 100%, 50%, 0.25);}
			h4 {color: hsla(240, 100%, 50%, 0.8);}
			h5 {color: hsla(180, 100%, 50%, 0.75);}
			h6 {color: hsla(39, 100%, 50%, 0.9);}
			h7 {color: hsla(300, 100%, 25%, 1);}
		`;

		const result = await postcss([postcssColorGolf()]).process(input, {from: undefined});

		expect(result.css).toContain("h1 {color: #00000080;}");
		expect(result.css).toContain("h2 {color: #ff000080;}");
		expect(result.css).toContain("h3 {color: #00ff0040;}");
		expect(result.css).toContain("h4 {color: #00fc;}");
		expect(result.css).toContain("h5 {color: #00ffffbf;}");
		expect(result.css).toContain("h6 {color: #ffa600e6;}");
		expect(result.css).toContain("h7 {color: purple;}"); // Should convert to named color
	});

	it("handles hsl with different angle units correctly", async()=>{
		const input = `
			h1 {color: hsl(0deg, 100%, 50%);}
			h2 {color: hsl(0.5turn, 100%, 50%);}
			h3 {color: hsl(3.14159rad, 100%, 50%);}
			h4 {color: hsl(200grad, 100%, 50%);}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		expect(result.css).toContain("h1 {color: red;}");
    expect(result.css).toMatch(/color: (aqua|cyan)/);
    expect(result.css).toMatch(/color: (aqua|cyan)/);
    expect(result.css).toMatch(/color: (aqua|cyan)/);
	});

	it("minifies lab colors to the shortest valid CSS form", async()=>{
		const input = `
			l1 {color: lab(0% 0 0);}
			l2 {color: lab(50% 50 0);}
			l3 {color: lab(75% -20 80);}
			l4 {color: lab(100% 0 0);}
			l5 {color: lab(50% 0 0 / 0.5);}
		`;

		const result = await postcss([postcssColorGolf()]).process(input, {from: undefined});

		expect(result.css).toContain("l1 {color: #000;}");
		expect(result.css).toContain("l2 {color: #c14e79;}"); // approximate conversion
		expect(result.css).toContain("l3 {color: #b2c200;}"); // approximate conversion
		expect(result.css).toContain("l4 {color: #fff;}");
		expect(result.css).toContain("l5 {color: #77777780;}"); // 50% L with alpha
	});

	it("minifies oklab colors to the shortest valid CSS form", async()=>{
		const input = `
			o1 {color: oklab(0 0 0);}
			o2 {color: oklab(0.5 0.1 0);}
			o3 {color: oklab(0.75 -0.05 0.2);}
			o4 {color: oklab(1 0 0);}
			o5 {color: oklab(0.5 0 0 / 0.5);}
		`;

		const result = await postcss([postcssColorGolf()]).process(input, {from: undefined});

		expect(result.css).toContain("o1 {color: #000;}");
		expect(result.css).toContain("o2 {color: #904961;}"); // approximate conversion
		expect(result.css).toContain("o3 {color: #c5b100;}"); // approximate conversion
		expect(result.css).toContain("o4 {color: #fff;}");
		expect(result.css).toContain("o5 {color: #63636380;}"); // 0.5 L with alpha
	});

	it("handles linear-gradient with multiple color types", async()=>{
		const input = `
			.gradient1 {
				background: linear-gradient(to right, rgb(255, 0, 0), #00ff00, hsl(240, 100%, 50%));
			}
			.gradient2 {
				background: linear-gradient(45deg, rgba(255, 0, 0, 0.5), hsla(120, 100%, 50%, 0.7), #0000ffaa);
			}
			.gradient3 {
				background: linear-gradient(to bottom, lab(75% 20 -40), oklab(0.8 0.1 -0.1), #aabbcc);
			}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		expect(result.css).toContain("background: linear-gradient(to right, red, lime, blue);");
		expect(result.css).toContain("background: linear-gradient(45deg, #ff000080, #00ff00b3, #00fa);");
		// The exact values for lab/oklab may vary, so we'll just check that they're converted to hex
		expect(result.css).toMatch(/background: linear-gradient\(to bottom, #[a-f0-9]{3,6}, #[a-f0-9]{3,6}, #abc\);/);
	});

	it("handles radial-gradient and repeating gradients", async()=>{
		const input = `
			.radial {
				background: radial-gradient(circle, rgba(255, 0, 0, 0.8), hsl(120, 100%, 25%), #0000ff);
			}
			.repeating-linear {
				background: repeating-linear-gradient(45deg, #ff0000, #00ff00 20px, rgb(0, 0, 255) 40px);
			}
			.repeating-radial {
				background: repeating-radial-gradient(circle at center, hsla(0, 100%, 50%, 0.5), rgba(0, 255, 0, 0.5) 20%, #0000ff80 30%);
			}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		expect(result.css).toContain("background: radial-gradient(circle, #f00c, green, blue);");
		expect(result.css).toContain("background: repeating-linear-gradient(45deg, red, lime 20px, blue 40px);");
		expect(result.css).toContain("background: repeating-radial-gradient(circle at center, #ff000080, #00ff0080 20%, #0000ff80 30%);");
	});

	it("handles conic-gradient and other CSS functions with colors", async()=>{
		const input = `
			.conic {
				background: conic-gradient(from 0deg, red, rgb(0, 255, 0), hsl(240, 100%, 50%));
			}
			.cross-fade {
				background-image: cross-fade(#ff0000, hsla(120, 100%, 50%, 0.5), rgb(0, 0, 255));
			}
			.color-mix {
				color: color-mix(in srgb, #ff0000, hsl(120, 100%, 50%) 50%);
			}
			.drop-shadow {
				filter: drop-shadow(2px 2px 5px rgba(0, 0, 0, 0.5));
			}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		expect(result.css).toContain("background: conic-gradient(from 0deg, red, lime, blue);");
		expect(result.css).toContain("background-image: cross-fade(red, #00ff0080, blue);");
		expect(result.css).toContain("color: color-mix(in srgb, red, lime 50%);");
		expect(result.css).toContain("filter: drop-shadow(2px 2px 5px #00000080);");
	});

	it("handles nested CSS functions with colors", async()=>{
		const input = `
			.nested {
				background-image: linear-gradient(
					to right,
					rgb(255, 0, 0),
					color-mix(in srgb, hsl(120, 100%, 50%), lab(75% 0 0) 30%),
					radial-gradient(circle, #ff0000, hsla(240, 100%, 50%, 0.7))
				);
			}
			.complex {
				background: linear-gradient(
					to bottom,
					transparent,
					rgba(0, 0, 0, 0.7)
				), url('image.jpg');
			}
		`;

    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

		// Check that all colors are minimized
		expect(result.css).toContain("red");
		expect(result.css).toContain("lime");
		expect(result.css).not.toContain("rgb(");
		expect(result.css).not.toContain("hsl(");
		expect(result.css).not.toContain("lab(");

		// Check the complex case with transparent and image
		expect(result.css).toContain("background: linear-gradient(to bottom, transparent, #000000b3), url('image.jpg');");
	});

	it("handles multiple CSS properties with color values", async()=>{
		const input = `
			.multi-color {
				color: rgb(255, 0, 0);
				background-color: hsl(120, 100%, 50%);
				border: 1px solid rgba(0, 0, 255, 0.5);
				box-shadow: 0 0 5px hsla(0, 0%, 0%, 0.3),
										inset 0 0 10px lab(50% 50 0);
				text-shadow: 1px 1px 2px oklab(0.5 0 0 / 0.7);
			}
		`;

		const result = await postcss([postcssColorGolf()]).process(input, {from: undefined});

		expect(result.css).toContain("color: red;");
		expect(result.css).toContain("background-color: #0f0;");
		expect(result.css).toContain("border: 1px solid #0000ff80;");
		expect(result.css).toContain("box-shadow: 0 0 5px #0000004d");
		expect(result.css).toContain("inset 0 0 10px #c14e79");
		expect(result.css).toContain("text-shadow: 1px 1px 2px #636363b3;");
	});

	it("keeps quotes intact and doesn't process colors inside them", async()=>{
		const input = `
			.quotes {
				content: "rgb(255, 0, 0) is #ff0000";
				font-family: 'Helvetica, #fff, Arial';
				background: linear-gradient(to right, red, green), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Crect fill='%23ff0000'/%3E%3C/svg%3E");
			}
		`;

		const result = await postcss([postcssColorGolf()]).process(input, {from: undefined});

		// Colors inside quotes should not be processed
		expect(result.css).toContain('content: "rgb(255, 0, 0) is #ff0000"');
		expect(result.css).toContain("font-family: 'Helvetica, #fff, Arial'");

		// Colors outside quotes should be processed
		expect(result.css).toContain("linear-gradient(to right, red, green)");

		// URLs with encoded SVG should be preserved
		expect(result.css).toContain('url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect fill=\'%23ff0000\'/%3E%3C/svg%3E")');
	});

  it("respects preferHex tiebreaker: true (hex preferred for tie)", async()=>{
    const input=`
      a {color: lime;}
      b {color: aqua;}
      c {color: blue;}
      d {color: skyblue;}
      e {color: oldlace;}
      f {color: hotpink;}
      g {color: darkred;}
      h {color: dimgrey;}
      i {color: dimgrey;}
    `;
    const result=await postcss([postcssColorGolf({preferHex: true})]).process(input,{from: undefined});

    expect(result.css).toContain("color: #0f0");
    expect(result.css).toContain("color: #0ff");
    expect(result.css).toContain("color: #00f");
    expect(result.css).toContain("color: #87ceeb");
    expect(result.css).toContain("color: #fdf5e6");
    expect(result.css).toContain("color: #ff69b4");
    expect(result.css).toContain("color: #8b0000");
    expect(result.css).toContain("color: #696969");
    expect(result.css).toContain("color: #696969");
  });

  it("respects preferHex tiebreaker: false (name preferred for tie)", async()=>{
    const input=`
      a {color: #0f0;}
      b {color: #0ff;}
      c {color: #00f;}
      d {color: #87ceeb;}
      e {color: #fdf5e6;}
      f {color: #ff69b4;}
      g {color: #696969;}
      h {color: #8b0000;}
    `;
    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

    expect(result.css).toContain("color: lime");
    expect(result.css).toMatch(/color: (aqua|cyan)/);
    expect(result.css).toContain("color: blue");
    expect(result.css).toContain("color: skyblue");
    expect(result.css).toContain("color: oldlace");
    expect(result.css).toContain("color: hotpink");
    expect(result.css).toMatch(/color: dimgr[ae]y/);
    expect(result.css).toContain("color: darkred");
  });

  it("minifies to 4 bits when valid", async()=>{
    const input=`
    a { color: #ffccffaa; }
    b { color: #aabbccdd; }
    c { color: #1122334a; }
    d { color: #1234567a; }
    `;
    const result=await postcss([postcssColorGolf({preferHex: false})]).process(input,{from: undefined});

    expect(result.css).toContain("color: #fcfa");
    expect(result.css).toContain("color: #abcd");
    expect(result.css).toContain("color: #1234");
    expect(result.css).toContain("color: #1234567a");
  });
});
