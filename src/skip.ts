/**
 * Parses a skip rule string. Supports:
 * - Plain string (exact match)
 * - "regex:pattern:flags" (full regex support)
 * Throws if unsafe or invalid regex.
 */
import {test as isVulnRegex} from "vuln-regex-detector";
export type SkipPattern=string|RegExp;

// --- Default skip list ---
const DEFAULT_SKIP=["content", "font-family", "counter-reset"];

function throwUnsafeRegex(
  rule:string|RegExp,
  idx:number,
  docsUrl:string
):never {
  const src=typeof rule==="string" ? rule :`/${rule.source}/`;
  throw new Error(
    `Unsafe regex in skip rule "${src}" at index ${idx}. Please choose a safe regex. See ${docsUrl}`
  );
}

function parseSkipRule(
  rule:string,
  idx:number,
  docsUrl:string
):SkipPattern {
  if(rule.startsWith("regex:")){
    // Parse pattern and flags:regex:pattern:flags
    const match=/^regex:(.*?)(?::([a-z]*))?$/.exec(rule);
    if(!match){
      throw new Error(`Invalid regex skip rule:"${rule}" (See ${docsUrl})`);
    }
    const [, pattern, flags]=match;
    if(isVulnRegex(pattern)){
      throwUnsafeRegex(rule, idx, docsUrl);
    }
    try {
      const regex=new RegExp(pattern, flags || undefined);
      if(isVulnRegex(regex.source)){
        throwUnsafeRegex(regex, idx, docsUrl);
      }
      return regex;
    } catch (e){
      throw new Error(
        `Invalid regex syntax in skip rule "${rule}" at index ${idx}:${(e as Error).message} (See ${docsUrl})`
      );
    }
  }
  return rule;
}

export function compileSkipRules(
  rules:(string|RegExp)[],
  docsUrl:string="https://github.com/yourorg/yourplugin#skip-rules"
):SkipPattern[] {
  return [...DEFAULT_SKIP, ...rules].map((rule, idx)=>{
    if(typeof rule==="string"){
      return parseSkipRule(rule, idx, docsUrl);
    } else if(rule instanceof RegExp){
      if(isVulnRegex(rule.source)){
        throwUnsafeRegex(rule, idx, docsUrl);
      }
      return rule;
    } else {
      throw new Error(
        `Invalid skip rule at index ${idx}:${String(rule)} (See ${docsUrl})`
      );
    }
  });
}

export function shouldSkip(item:string, skip:SkipPattern[]):boolean {
  for (const pat of skip){
    if(typeof pat==="string"){
      if(item===pat) return true;
    } else if(pat instanceof RegExp){
      if(pat.test(item)) return true;
    }
  }
  return false;
}
