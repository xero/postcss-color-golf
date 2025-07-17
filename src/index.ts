import type {PluginCreator, Root, Declaration} from 'postcss';
import valueParser from 'postcss-value-parser';

// Add to the options interface:
export interface PostcssColorGolfOptions {
  preferHex?: boolean; // Prefer hex over named colors when same length
  smallest?: boolean;  // If true, use non-standard shortest hex minification (default: true)
}

/**
 * PostCSS Color Golf Plugin
 * Minimizes CSS color values to their shortest representation.
 */
const postcssColorGolf=((opts:PostcssColorGolfOptions={})=>{
	// Default options
	const options={
		preferHex:true,
		smallest:true,
		...opts
	};

  // Color name to hex map
  const namedColors:Record<string,string>={
    aliceblue: '#f0f8ff', antiquewhite: '#faebd7', aqua: '#0ff', aquamarine: '#7fffd4',
    azure: '#f0ffff', beige: '#f5f5dc', bisque: '#ffe4c4', black: '#000',
    blanchedalmond: '#ffebcd', blue: '#00f', blueviolet: '#8a2be2', brown: '#a52a2a',
    burlywood: '#deb887', cadetblue: '#5f9ea0', chartreuse: '#7fff00',
    chocolate: '#d2691e', coral: '#ff7f50', cornflowerblue: '#6495ed', cornsilk: '#fff8dc',
    crimson: '#dc143c', cyan: '#0ff', darkblue: '#00008b', darkcyan: '#008b8b',
    darkgoldenrod: '#b8860b', darkgray: '#a9a9a9', darkgreen: '#006400', darkgrey: '#a9a9a9',
    darkkhaki: '#bdb76b', darkmagenta: '#8b008b', darkolivegreen: '#556b2f', darkorange: '#ff8c00',
    darkorchid: '#9932cc', darkred: '#8b0000', darksalmon: '#e9967a', darkseagreen: '#8fbc8f',
    darkslateblue: '#483d8b', darkslategray: '#2f4f4f', darkslategrey: '#2f4f4f',
    darkturquoise: '#00ced1', darkviolet: '#9400d3', deeppink: '#ff1493', deepskyblue: '#00bfff',
    dimgray: '#696969', dimgrey: '#696969', dodgerblue: '#1e90ff', firebrick: '#b22222',
    floralwhite: '#fffaf0', forestgreen: '#228b22', fuchsia: '#f0f', gainsboro: '#dcdcdc',
    ghostwhite: '#f8f8ff', gold: '#ffd700', goldenrod: '#daa520', gray: '#808080',
    green: '#008000', greenyellow: '#adff2f', grey: '#808080', honeydew: '#f0fff0',
    hotpink: '#ff69b4', indianred: '#cd5c5c', indigo: '#4b0082', ivory: '#fffff0',
    khaki: '#f0e68c', lavender: '#e6e6fa', lime: '#0f0', linen: '#faf0e6',
    magenta: '#f0f', maroon: '#800000', mediumaquamarine: '#66cdaa', mediumblue: '#0000cd',
    mediumorchid: '#ba55d3', mediumpurple: '#9370db', mediumseagreen: '#3cb371',
    mediumslateblue: '#7b68ee', mediumspringgreen: '#00fa9a', mediumturquoise: '#48d1cc',
    mediumvioletred: '#c71585', midnightblue: '#191970', mintcream: '#f5fffa',
    mistyrose: '#ffe4e1', moccasin: '#ffe4b5', navajowhite: '#ffdead', navy: '#000080',
    oldlace: '#fdf5e6', olive: '#808000', olivedrab: '#6b8e23', orange: '#ffa500',
    orangered: '#ff4500', orchid: '#da70d6', palegoldenrod: '#eee8aa', palegreen: '#98fb98',
    paleturquoise: '#afeeee', palevioletred: '#db7093', papayawhip: '#ffefd5',
    peachpuff: '#ffdab9', peru: '#cd853f', pink: '#ffc0cb', plum: '#dda0dd',
    powderblue: '#b0e0e6', purple: '#800080', rebeccapurple: '#663399', red: '#f00',
    rosybrown: '#bc8f8f', royalblue: '#4169e1', saddlebrown: '#8b4513', salmon: '#fa8072',
    sandybrown: '#f4a460', seagreen: '#2e8b57', seashell: '#fff5ee', sienna: '#a0522d',
    silver: '#c0c0c0', skyblue: '#87ceeb', slateblue: '#6a5acd', slategray: '#708090',
    slategrey: '#708090', snow: '#fffafa', springgreen: '#00ff7f', steelblue: '#4682b4',
    tan: '#d2b48c', teal: '#008080', thistle: '#d8bfd8', tomato: '#ff6347',
    turquoise: '#40e0d0', violet: '#ee82ee', wheat: '#f5deb3', white: '#fff',
    whitesmoke: '#f5f5f5', yellow: '#ff0', yellowgreen: '#9acd32',
    transparent: 'rgba(0,0,0,0)'
  };

  // Build hex to name map for efficient lookups
  const hexToName:Record<string,string>={};
  for(const[name,hex]of Object.entries(namedColors)) {
    const shortHex=shortenHex(hex);
    if(!hexToName[shortHex]||name.length<hexToName[shortHex].length){
      hexToName[shortHex]=name;
    }
  }

  /**
   * Converts a 6-digit hex color to 3-digit if possible
   * Or an 8-digit hex to 4-digit if possible
   */
  function shortenHex(hex:string):string {
    hex=hex.toLowerCase();
		// Handle 8-digit hex (#RRGGBBAA)
		if (hex.length===9) {
			const r=hex.slice(1,3);
			const g=hex.slice(3,5);
			const b=hex.slice(5,7);
			const a=hex.slice(7,9);
			if(
				a==='00'&&
				r==='00'&&
				g==='00'&&
				b==='00'){
				return 'transparent'
			}
			if(
				r[0]===r[1]&&
				g[0]===g[1]&&
				b[0]===b[1]&&
				a[0]===a[1]){
				return `#${r[0]}${g[0]}${b[0]}${a[0]}`
			}
			return hex;
		}

		// Handle 6-digit hex (#RRGGBB)
		if(hex.length===7){
			const r=hex.slice(1,3);
			const g=hex.slice(3,5);
			const b=hex.slice(5,7);
      if(
				r[0]===r[1]&&
				g[0]===g[1]&&
				b[0]===b[1]){
        return `#${r[0]}${g[0]}${b[0]}`;
      }
      return hex;
    }
    return hex;
  }

  /**
   * Converts RGB values to hex format
   */
	function rgbToHex(r:number,g:number,b:number,a:number=1):string {
		// Ensure values are within valid ranges
		r=Math.max(0,Math.min(255,Math.round(r)));
		g=Math.max(0,Math.min(255,Math.round(g)));
		b=Math.max(0,Math.min(255,Math.round(b)));
		a=Math.max(0,Math.min(1,a));

		// Helper to convert to 2-digit hex
		const toHex=(n:number):string=>{
			const hex=n.toString(16);
			return hex.length===1?'0'+hex:hex;
		};

		const rHex=toHex(r);
		const gHex=toHex(g);
		const bHex=toHex(b);

		// Full transparency
		if(a===0){return 'transparent'}

		// Fully opaque
		if(a===1){return `#${rHex}${gHex}${bHex}`}

		// With alpha channel
		const aHex=toHex(Math.round(a*255));
		return `#${rHex}${gHex}${bHex}${aHex}`;
	}

  /**
   * Gets the shortest representation of a color
   */
  function getShortestForm(color:string):string {
    // Already normalized to lowercase before reaching here

    // Handle named colors
    if(Object.prototype.hasOwnProperty.call(namedColors,color)){
      const hexVersion=namedColors[color];
      const shortHex=shortenHex(hexVersion);

      // Compare lengths
      if(color.length<shortHex.length){
				// Named color is shorter
				return color;
      }else if(color.length===shortHex.length) {
        // Same length - use preference
        return options.preferHex?shortHex:color;
      }else{
				// Hex is shorter
				return shortHex;
      }
    }

    // Handle hex colors
    if(color.startsWith('#')){
      const shortHex=shortenHex(color);
      const possibleName=hexToName[shortHex];

      // Use name if it exists and is shorter
      if(possibleName&&possibleName.length<shortHex.length){
        return possibleName;
      }else if(possibleName&&possibleName.length===shortHex.length) {
        // Same length - use preference
        return options.preferHex?shortHex:possibleName;
      }
      return shortHex;
    }

    // Handle rgb/rgba
    if(color.startsWith('rgb')){
      // Extract values
      const parts=color.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/i);
      if(!parts) return color;// Invalid format

      const r=parseInt(parts[1],10);
      const g=parseInt(parts[2],10);
      const b=parseInt(parts[3],10);
      const a=parts[4]?parseFloat(parts[4]):1;

      // Convert to hex
      const hexColor=rgbToHex(r,g,b,a);
      const shortHex=shortenHex(hexColor);
      const possibleName=hexToName[shortHex];

      // Use name if it exists and is shorter
      if(a===1&&possibleName&&possibleName.length<shortHex.length){
        return possibleName;
      }else if(possibleName&&possibleName.length===shortHex.length){
        // Same length - use preference
        return options.preferHex?shortHex:possibleName;
      }
      return shortHex;
    }
    // Return original for other formats
    return color;
  }

  /**
   * Process RGB/RGBA value from CSS
   */
  function processRgb(value:string):string {
    // Match all rgb/rgba values
    const rgbRegex=/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)/gi;
    return value.replace(rgbRegex,(match)=>{
      return getShortestForm(match.toLowerCase());
    });
  }

  /**
   * Process a CSS declaration value
   */
  function processValue(value:string):string {
    // Handle special cases with quotation marks
    if(value.includes('"') || value.includes("'")){
      // Don't process quoted strings
      const regex=/"([^"]*)"|'([^']*)'/g;
      const quotedParts:string[]=[];

      // Extract and preserve quoted parts
      const processedValue=value.replace(regex,(match)=>{
        quotedParts.push(match);
        return `__QUOTED_${quotedParts.length-1}__`;
      });

      // Process the rest
      const result=doProcessValue(processedValue);

      // Restore quoted parts
      return result.replace(/__QUOTED_(\d+)__/g,(_,index)=>{
        return quotedParts[parseInt(index,10)];
      });
    }
    return doProcessValue(value);
  }

  /**
   * Core processing function for CSS values
   */
  function doProcessValue(value:string):string{
    // Skip if contains url() but not colors
    if (value.includes('url(')&&
        !value.includes('#')&&
        !value.includes('rgb(')&&
        !value.includes('rgba(')){
      return value;
    }

    // Special case for linear-gradients
    if(value.includes('linear-gradient')){
      // Parse as CSS value
      const parsed=valueParser(value);

      parsed.walk(node=>{
        if (node.type==='function'&&node.value==='linear-gradient') {
          // Process each node in the gradient
          node.nodes.forEach(childNode=>{
            if (childNode.type==='word'){
              // Named color
              if(Object.prototype.hasOwnProperty.call(namedColors,childNode.value.toLowerCase())){
                childNode.value=getShortestForm(childNode.value.toLowerCase());
							// Hex color
              }else if(childNode.value.startsWith('#')){
                childNode.value=getShortestForm(childNode.value.toLowerCase());
              }
						}else if(childNode.type==='function' &&
							(childNode.value==='rgb'||childNode.value==='rgba')){
							const funcString=valueParser.stringify(childNode);
							const shortValue=getShortestForm(funcString);
							const index=node.nodes.indexOf(childNode);
							if(index!==-1){
								node.nodes.splice(index,1,{
									type:'word',
									value:shortValue,
									sourceIndex:childNode.sourceIndex??0,
									sourceEndIndex:childNode.sourceEndIndex??childNode.sourceIndex??0
								});
							}
            }
          });
					// Add the missing spaces and commas
					for(let i=0;i<node.nodes.length;i++){
						if(node.nodes[i].type==='div'&&node.nodes[i].value===','){
							// Make sure there's exactly one space after the comma
							if(i+1<node.nodes.length&&node.nodes[i+1].type==='space'){
								node.nodes[i+1].value=' ';
							}else{
								node.nodes.splice(i+1,0,{
									type:'space',
									value:' ',
									sourceIndex:node.nodes[i].sourceIndex??0,
									sourceEndIndex:node.nodes[i].sourceEndIndex??node.nodes[i].sourceIndex??0
								});
							}
						}
					}
				}
			});
			let result = parsed.toString();
			// Normalize spaces: only one space after comma
			result = result.replace(/,\s+/g, ', ');
			// Remove double spaces (if any)
			result = result.replace(/\s{2,}/g, ' ');
			return result;
    }

    // Process RGB/RGBA colors
    value=processRgb(value);

    // Process named and hex colors
    const parsed=valueParser(value);

    parsed.walk(node=>{
      if(node.type==='word'){
        // Named colors
        if(Object.prototype.hasOwnProperty.call(namedColors,node.value.toLowerCase())){
          node.value=getShortestForm(node.value.toLowerCase());
				// Hex colors
        }else if(node.value.startsWith('#')){
          node.value=getShortestForm(node.value.toLowerCase());
        }
      }
    });
    return parsed.toString();
  }

  // Main plugin function
  return (root:Root)=>{
    root.walkDecls((decl:Declaration)=>{
      // Skip properties that shouldn't contain colors
      const skipProps=['content','font-family','counter-reset'];
      if(skipProps.includes(decl.prop)) return;

      // Process the value
      const originalValue=decl.value;
      const newValue=processValue(originalValue);

      // Update if changed
      if (newValue!==originalValue) {
        decl.value=newValue;
      }
    });
  };
}) as unknown as PluginCreator<PostcssColorGolfOptions>;

// Register plugin metadata
Object.assign(postcssColorGolf,{
  postcssPlugin:'postcss-color-golf',
  postcss: true
});
export default postcssColorGolf;
