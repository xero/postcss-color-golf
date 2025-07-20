import {parse as culoriParse, converter, formatHex, formatHex8} from "culori";
const APPROXIMATED_SPACES=[
  "lab", // CIELAB
  "lch", // CIELCH
  "luv", // CIELUV
  "din99", // DIN99 Lab
  "din99o", // DIN99o Lab
  "din99d", // DIN99d Lab
  "oklab",
  "oklch",
  "okhsl",
  "okhsv",
  "jzazbz",
  "yiq",
  "xyz", // CIE XYZ
  "xyb",
  "ictcp",
  "display-p3",
  "rec2020",
  "a98-rgb",
  "prophoto-rgb",
  "gray", // CSS gray()
  "cubehelix"
];
// --- Named Color Maps
const namedColors:Record<string, string>={
	aliceblue:'#f0f8ff', antiquewhite:'#faebd7', aqua:'#0ff', aquamarine:'#7fffd4',
	azure:'#f0ffff', beige:'#f5f5dc', bisque:'#ffe4c4', black:'#000',
	blanchedalmond:'#ffebcd', blue:'#00f', blueviolet:'#8a2be2', brown:'#a52a2a',
	burlywood:'#deb887', cadetblue:'#5f9ea0', chartreuse:'#7fff00',
	chocolate:'#d2691e', coral:'#ff7f50', cornflowerblue:'#6495ed', cornsilk:'#fff8dc',
	crimson:'#dc143c', cyan:'#0ff', darkblue:'#00008b', darkcyan:'#008b8b',
	darkgoldenrod:'#b8860b', darkgray:'#a9a9a9', darkgreen:'#006400', darkgrey:'#a9a9a9',
	darkkhaki:'#bdb76b', darkmagenta:'#8b008b', darkolivegreen:'#556b2f', darkorange:'#ff8c00',
	darkorchid:'#9932cc', darkred:'#8b0000', darksalmon:'#e9967a', darkseagreen:'#8fbc8f',
	darkslateblue:'#483d8b', darkslategray:'#2f4f4f', darkslategrey:'#2f4f4f',
	darkturquoise:'#00ced1', darkviolet:'#9400d3', deeppink:'#ff1493', deepskyblue:'#00bfff',
	dimgray:'#696969', dimgrey:'#696969', dodgerblue:'#1e90ff', firebrick:'#b22222',
	floralwhite:'#fffaf0', forestgreen:'#228b22', fuchsia:'#f0f', gainsboro:'#dcdcdc',
	ghostwhite:'#f8f8ff', gold:'#ffd700', goldenrod:'#daa520', gray:'#808080',
	green:'#008000', greenyellow:'#adff2f', grey:'#808080', honeydew:'#f0fff0',
	hotpink:'#ff69b4', indianred:'#cd5c5c', indigo:'#4b0082', ivory:'#fffff0',
	khaki:'#f0e68c', lavender:'#e6e6fa', lime:'#0f0', linen:'#faf0e6',
	magenta:'#f0f', maroon:'#800000', mediumaquamarine:'#66cdaa', mediumblue:'#0000cd',
	mediumorchid:'#ba55d3', mediumpurple:'#9370db', mediumseagreen:'#3cb371',
	mediumslateblue:'#7b68ee', mediumspringgreen:'#00fa9a', mediumturquoise:'#48d1cc',
	mediumvioletred:'#c71585', midnightblue:'#191970', mintcream:'#f5fffa',
	mistyrose:'#ffe4e1', moccasin:'#ffe4b5', navajowhite:'#ffdead', navy:'#000080',
	oldlace:'#fdf5e6', olive:'#808000', olivedrab:'#6b8e23', orange:'#ffa500',
	orangered:'#ff4500', orchid:'#da70d6', palegoldenrod:'#eee8aa', palegreen:'#98fb98',
	paleturquoise:'#afeeee', palevioletred:'#db7093', papayawhip:'#ffefd5',
	peachpuff:'#ffdab9', peru:'#cd853f', pink:'#ffc0cb', plum:'#dda0dd',
	powderblue:'#b0e0e6', purple:'#800080', rebeccapurple:'#663399', red:'#f00',
	rosybrown:'#bc8f8f', royalblue:'#4169e1', saddlebrown:'#8b4513', salmon:'#fa8072',
	sandybrown:'#f4a460', seagreen:'#2e8b57', seashell:'#fff5ee', sienna:'#a0522d',
	silver:'#c0c0c0', skyblue:'#87ceeb', slateblue:'#6a5acd', slategray:'#708090',
	slategrey:'#708090', snow:'#fffafa', springgreen:'#00ff7f', steelblue:'#4682b4',
	tan:'#d2b48c', teal:'#008080', thistle:'#d8bfd8', tomato:'#ff6347',
	turquoise:'#40e0d0', violet:'#ee82ee', wheat:'#f5deb3', white:'#fff',
	whitesmoke:'#f5f5f5', yellow:'#ff0', yellowgreen:'#9acd32',
	transparent:'rgba(0,0,0,0)'
};
let ignoreApproximatedSpaces:boolean=false;
let ignoredSpaces:boolean|string[]=[];
let preferHex:boolean=true;

const hexToName:Record<string, string>={};
// Build hex to name map (shortest name for each hex)
for (const [name, hex] of Object.entries(namedColors)) {
  const shortHex=shortenHex(hex);
  if(!hexToName[shortHex] || name.length < hexToName[shortHex].length) {
    hexToName[shortHex]=name;
  }
}

function shortenHex(hex:string):string {
  hex=hex.toLowerCase();
  if(!hex.startsWith("#")) hex="#" + hex;

  // Handle 8-digit hex (#RRGGBBAA)
  if(hex.length===9) {
    // Check for potential 4-digit hex shorthand
    const r=hex.slice(1, 3);
    const g=hex.slice(3, 5);
    const b=hex.slice(5, 7);
    const a=hex.slice(7, 9);

    // Check for fully transparent
    if(a==="00") {
      return "transparent";
    }

    // Check for 4-digit shorthand possibility
    if(
			r[0]===r[1] &&
			g[0]===g[1] &&
			b[0]===b[1] &&
			a[0]===a[1]){
      return `#${r[0]}${g[0]}${b[0]}${a[0]}`;
    }
    return hex;
  }
  // Handle 6-digit hex (#RRGGBB)
  if(hex.length===7 && hex.startsWith("#")) {
    const r=hex.slice(1, 3);
    const g=hex.slice(3, 5);
    const b=hex.slice(5, 7);
    if(
			r[0]===r[1] &&
			g[0]===g[1] &&
			b[0]===b[1]){
      return `#${r[0]}${g[0]}${b[0]}`;
    }
    return hex;
  }
  // Prevents unnecessary processing ifthe hex is already in its shortest form (3 or 4 digits).
  if((hex.length===4 || hex.length===5) && hex.startsWith("#")) {
    return hex;
  }
  return hex;
}

export function setOpt(o:string, v:boolean|string[]):void {
  switch (o) {
    case "preferHex":
      if(typeof v==="boolean") preferHex=v;
     break;
    case "ignoreApproximatedSpaces":
      if(typeof v==="boolean") ignoreApproximatedSpaces=v;
     break;
    case "ignoredSpaces":
      if(Array.isArray(v)) ignoredSpaces=v;
     break;
    default:
      console.log("unknown option");
     break;
  }
}
export function getShortestColorFormat(hex:string):string {
  // Special case for transparent
  if(hex==="#00000000") return "transparent";

  const shortHex=shortenHex(hex);

  // Look up a potential named color (case insensitive)
  const lowerHex=shortHex.toLowerCase();
  const name=hexToName[lowerHex];

  if(shortHex==="transparent" || name==="transparent")
    return "transparent";
  if(name && name.length < lowerHex.length) return name;
  if(name && name.length===lowerHex.length) {
    return preferHex ? lowerHex :name;
  }
  return shortHex;
}

// Helper to pre-process non-standard formats that Culori can't parse
function preprocessNonStandardColor(color:string):string {
  // Handle rgba(#hex, ...) format
  return color.replace(
    /rgba?\(\s*#([a-f0-9]{3,8})\s*,\s*([^,]+)\s*,\s*([^,]+)(?:\s*,\s*([^)]+))?\s*\)/gi,
    (match, hex, g, b, a)=>{
      // Convert the hex to r,g,b values
      const parsedHex=culoriParse(`#${hex}`);
      if(!parsedHex) return match;

      const rgb=converter("rgb")(parsedHex);
      if(!rgb) return match;

      // Format as standard rgba
      const r=Math.round((rgb.r || 0) * 255);
      return a ? `rgba(${r}, ${g}, ${b}, ${a})` :`rgb(${r}, ${g}, ${b})`;
    }
  )
}

// --- Helper:Normalize whitespace around commas ---
export function normalizeCommasAndSpaces(str:string):string {
  // Ensure exactly one space after each comma
  let result=str.replace(/,\s+/g, ", ");
  // Remove spaces around parentheses
  result=result.replace(/\(\s+/g, "(").replace(/\s+\)/g, ")");
  // Remove excessive spaces
  return result.replace(/\s{2,}/g, " ");
}

export function colorToMinified(input:string):string {
  // Skip non-colors
  if(
    !input ||
    input.includes("url(") ||
    input.startsWith('"') ||
    input.startsWith("'")
  ) {
    return input;
  }
  // Opt-out of minifying approximated color spaces
  if((ignoreApproximatedSpaces &&
      APPROXIMATED_SPACES.some((space)=>input.toLowerCase().includes(space)))
		|| (Array.isArray(ignoredSpaces) &&
      ignoredSpaces.length > 0 &&
      ignoredSpaces.some((space)=>input.toLowerCase().includes(space)))
  ){
    return input;
  }

  // Pre-process non-standard formats like rgba(#hex, ...) that Culori can't handle directly
  const preprocessed=preprocessNonStandardColor(input);

  const parsed=culoriParse(preprocessed);
  if(!parsed) return input;

  // Special case:fully transparent
  if("alpha" in parsed && parsed.alpha===0) {
    return "transparent";
  }

  // Convert to RGB
  const rgb=converter("rgb")(parsed);
  if(!rgb) return input;

  // Format as hex/hex8 based on alpha
  const formattedHex =
    rgb.alpha!==undefined && rgb.alpha < 1 ? formatHex8(rgb) :formatHex(rgb);

  if(!formattedHex) return input;

  // CRITICAL:Always run through our shortening function
  const shortestHex=shortenHex(formattedHex);

  // Compare with named colors
  return getShortestColorFormat(shortestHex);
}
