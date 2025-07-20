import type {PluginCreator, Root} from "postcss";
import valueParser from "postcss-value-parser";
import {shouldSkip, compileSkipRules, type SkipPattern} from "./skip.js";
import {normalizeCommasAndSpaces, colorToMinified, setOpt} from "./color-minify.js";

// --- Options & Defaults ---
export interface ColorGolfOptions {
  skip?:(string|RegExp)[]; // list of properties or regex patterns to not process
  preferHex?:boolean; // If true, prefer hex over name for ties
  ignoreApproximatedSpaces?:boolean; // if true, ignore approximated spaces
  ignoredSpaces?:string[];
}

// --- Main Value Processor ---
function processValue(value:string, opts:ColorGolfOptions):string {
  if(!value) return value;
  const parsed=valueParser(value);
  opts.preferHex!==undefined && setOpt("preferHex",opts.preferHex);
  opts.ignoreApproximatedSpaces!==undefined && setOpt("ignoreApproximatedSpaces",opts.ignoreApproximatedSpaces);
  opts.ignoredSpaces!==undefined && setOpt("ignoredSpaces",opts.ignoredSpaces);

  parsed.walk((node, index, nodes)=>{
    // Skip quoted strings, urls, and comments
    if(
      node.type==="string" ||
      (node.type==="function" && node.value==="url") ||
      node.type==="comment"
    ){
      return false;
    }
    if(node.type==="word"){
      const parsedColor=colorToMinified(node.value);
      if(parsedColor){
        node.value=parsedColor;
      }
    } else if(node.type==="function"){
      // Only minify the function node itself if it's a color function (rgb, rgba, hsl, hsla, lab, oklab, etc)
      const colorFuncNames=[
        "rgb",
        "rgba",
        "hsl",
        "hsla",
        "lab",
        "lch",
        "oklab",
        "oklch",
        "color"
      ];
      if(colorFuncNames.includes(node.value.toLowerCase())){
        const asString=valueParser.stringify(node);
        const parsedColor=colorToMinified(asString);
        if(parsedColor && nodes){
          nodes[index]={
            type:"word",
            value:parsedColor,
            sourceIndex:node.sourceIndex,
            sourceEndIndex:
              "sourceEndIndex" in node &&
              typeof node.sourceEndIndex==="number"
                ? node.sourceEndIndex
                :node.sourceIndex
          };
        }
      } else {
        // Recursively walk children for non-color functions (e.g., gradients)
        if(node.nodes){
          // Process each child node
          for (let i=0; i < node.nodes.length; i++){
            const childNode=node.nodes[i];

            if(childNode.type==='word'){
              // Process simple word nodes (named colors, hex)
              const parsedColor=colorToMinified(childNode.value);
              if(parsedColor && parsedColor!==childNode.value){
                childNode.value=parsedColor;
              }
            }
            else if(childNode.type==='function'){
              // Handle color functions directly
              const colorFuncNames=["rgb", "rgba", "hsl", "hsla", "lab", "lch", "oklab", "oklch", "color"];
              if(colorFuncNames.includes(childNode.value.toLowerCase())){
                const asString=valueParser.stringify(childNode);
                const parsedColor=colorToMinified(asString);
                if(parsedColor && parsedColor!==asString){
                  node.nodes[i]={
                    type:"word",
                    value:parsedColor,
                    sourceIndex:childNode.sourceIndex,
                    sourceEndIndex:childNode.sourceEndIndex || childNode.sourceIndex
                  };
                }
              }
              // For non-color functions, process their children recursively
              else if(childNode.nodes){
                // Process the function's nodes
                valueParser.walk(childNode.nodes, (nestedNode, nestedIndex, nestedParent)=>{
                  if(nestedNode.type==='word'){
                    const nestedColor=colorToMinified(nestedNode.value);
                    if(nestedColor && nestedColor!==nestedNode.value){
                      nestedNode.value=nestedColor;
                    }
                  }
                  else if(nestedNode.type==='function'){
                    const nestedString=valueParser.stringify(nestedNode);
                    const nestedResult=colorToMinified(nestedString);
                    if(nestedResult && nestedResult!==nestedString && nestedParent){
                      nestedParent[nestedIndex]={
                        type:"word",
                        value:nestedResult,
                        sourceIndex:nestedNode.sourceIndex,
                        sourceEndIndex:nestedNode.sourceEndIndex || nestedNode.sourceIndex
                      }
                    }
                  }
                  return false; // Don't traverse deeper automatically
                })
              }
            }
          }
        }
      }
    }
  })
  // Normalize commas and spaces for gradients and multi-value functions
  return normalizeCommasAndSpaces(parsed.toString());
}

// --- Main Plugin ---
const colorGolfPlugin:PluginCreator<ColorGolfOptions>=(opts={})=>{
  const options:ColorGolfOptions={
    preferHex:true,
    skip:[],
    ignoreApproximatedSpaces:false,
    ignoredSpaces:[],
    ...opts
  };
  // Compile skip list
  const patterns:SkipPattern[]=compileSkipRules(opts.skip || []);
  return {
    postcssPlugin:"postcss-color-golf",
    Once(root:Root){
      root.walkDecls((decl)=>{
        if(shouldSkip(decl.prop, patterns)) return;
        const orig=decl.value;
        const next=processValue(orig, options);
        if(next!==orig) decl.value=next;
      })
    }
  }
};
colorGolfPlugin.postcss=true;
export default colorGolfPlugin;
