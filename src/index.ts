import type { Plugin, Root } from 'postcss';
export interface PostcssColorGolfOptions {}
const postcssColorGolf=(opts:PostcssColorGolfOptions={}):Plugin=>({
	postcssPlugin: 'postcss-color-golf',
	Once(root: Root) {
		const M={
			aliceblue:'#f0f8ff', antiquewhite:'#faebd7', aqua:'#0ff', aquamarine:'#7fffd4', azure:'#f0ffff', beige:'#f5f5dc', bisque:'#ffe4c4', black:'#000',
			blanchedalmond:'#ffebcd', blue:'#00f', blueviolet:'#8a2be2', brown:'#a52a2a', burlywood:'#deb887', cadetblue:'#5f9ea0', chartreuse:'#7fff00',
			chocolate:'#d2691e', coral:'#ff7f50', cornflowerblue:'#6495ed', cornsilk:'#fff8dc', crimson:'#dc143c', cyan:'#0ff', darkblue:'#00008b',
			darkcyan:'#008b8b', darkgoldenrod:'#b8860b', darkgray:'#a9a9a9', darkgreen:'#006400', darkgrey:'#a9a9a9', darkkhaki:'#bdb76b',
			darkmagenta:'#8b008b', darkolivegreen:'#556b2f', darkorange:'#ff8c00', darkorchid:'#9932cc', darkred:'#8b0000', darksalmon:'#e9967a',
			darkseagreen:'#8fbc8f', darkslateblue:'#483d8b', darkslategray:'#2f4f4f', darkslategrey:'#2f4f4f', darkturquoise:'#00ced1', darkviolet:'#9400d3',
			deeppink:'#ff1493', deepskyblue:'#00bfff', dimgray:'#696969', dimgrey:'#696969', dodgerblue:'#1e90ff', firebrick:'#b22222', floralwhite:'#fffaf0',
			forestgreen:'#228b22', fuchsia:'#f0f', gainsboro:'#dcdcdc', ghostwhite:'#f8f8ff', gold:'#ffd700', goldenrod:'#daa520', gray:'#808080',
			green:'#008000', greenyellow:'#adff2f', grey:'#808080', honeydew:'#f0fff0', hotpink:'#ff69b4', indianred:'#cd5c5c', indigo:'#4b0082',
			ivory:'#fffff0', khaki:'#f0e68c', lavender:'#e6e6fa', lime:'#0f0', linen:'#faf0e6', magenta:'#f0f', maroon:'#800000', mediumaquamarine:'#66cdaa',
			mediumblue:'#0000cd', mediumorchid:'#ba55d3', mediumpurple:'#9370db', mediumseagreen:'#3cb371', mediumslateblue:'#7b68ee',
			mediumspringgreen:'#00fa9a', mediumturquoise:'#48d1cc', mediumvioletred:'#c71585', midnightblue:'#191970', mintcream:'#f5fffa',
			mistyrose:'#ffe4e1', moccasin:'#ffe4b5', navajowhite:'#ffdead', navy:'#000080', oldlace:'#fdf5e6', olive:'#808000', olivedrab:'#6b8e23',
			orange:'#ffa500', orangered:'#ff4500', orchid:'#da70d6', palegoldenrod:'#eee8aa', palegreen:'#98fb98', paleturquoise:'#afeeee',
			palevioletred:'#db7093', papayawhip:'#ffefd5', peachpuff:'#ffdab9', peru:'#cd853f', pink:'#ffc0cb', plum:'#dda0dd', powderblue:'#b0e0e6',
			purple:'#800080', rebeccapurple:'#663399', red:'#f00', rosybrown:'#bc8f8f', royalblue:'#4169e1', saddlebrown:'#8b4513', salmon:'#fa8072',
			sandybrown:'#f4a460', seagreen:'#2e8b57', seashell:'#fff5ee', sienna:'#a0522d', silver:'#c0c0c0', skyblue:'#87ceeb', slateblue:'#6a5acd',
			slategray:'#708090', slategrey:'#708090', snow:'#fffafa', springgreen:'#00ff7f', steelblue:'#4682b4', tan:'#d2b48c', teal:'#008080',
			thistle:'#d8bfd8', tomato:'#ff6347', turquoise:'#40e0d0', violet:'#ee82ee', wheat:'#f5deb3', white:'#fff', whitesmoke:'#f5f5f5', yellow:'#ff0',
			yellowgreen:'#9acd32', transparent:'rgba(0,0,0,0)'
		},
		// shorten hex code if possible (#112233 → #123)
		shortHex=(H:string)=>{
			H=H.toLowerCase();
			if(/^#([\da-f])\1([\da-f])\2([\da-f])\3$/i.test(H)){ return "#"+H[1]+H[3]+H[5] }
			return H;
		},
		// rgb to hex
		rgbHex=(R: string | number, G: string | number, B: string | number) =>
			"#"+[R,G,B].map(X=>("0"+(+X).toString(16)).slice(-2)).join(""),
		// optimize rgba/hex if possible
		optColor=(V:string)=>
			V.replace(
				/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*([.\d]+))?\s*\)/gi,
				(_,r,g,b,a)=>{
					r=+r;
					g=+g;
					b=+b;
					a=a==null?1:+a;
					let X=rgbHex(r,g,b);
					if (a===1) return shortHex(X);
					let Y=Math.round(a*255).toString(16).padStart(2,"0");
					return X+Y;
				})
			.replace(
				/#[\da-f]{6}/gi,
				H => shortHex(H)
			)
			.replace(
				new RegExp("\\b("+Object.keys(M).join("|")+")\\b","gi"),
				k=>M[k.toLowerCase() as keyof typeof M]
			);
		// apply to all declarations
		root.walkDecls(decl=>{
			const v=decl.value;
			const newv=optColor(v);
			if(v!==newv) decl.value=newv;
		})}});
(postcssColorGolf as any).postcss=true;
export default postcssColorGolf;
