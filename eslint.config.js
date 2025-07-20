import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';

export default [
js.configs.recommended,
...tseslint.configs.recommended,
...tseslint.configs.stylistic,{
languageOptions:{
ecmaVersion:2020,
sourceType:'module',
globals:{...globals.node,...globals.es2020}}},{
files:['src/**/*.ts'],
languageOptions:{parser:tseslint.parser}},{
// xero style!
rules:{
// use your stuff
"no-unused-vars": "error",
"@typescript-eslint/no-unused-vars": "error",
// short circuits are golftastic!
"no-unused-expressions": "off",
"@typescript-eslint/no-unused-expressions": "off",
// this is typescript, type stuff!
"@typescript-eslint/no-inferrable-types": "off",
// no space before function parens
'space-before-function-paren':[
'error',{anonymous:'never',named:'never',asyncArrow:'never'}],
// no spaces inside brackets/braces/parens
'array-bracket-spacing':['error','never'],
'object-curly-spacing':['error','never'],
'object-curly-newline':['off'],
// no space before or after arrow
'arrow-spacing':['error',{before:false,after:false}],
// no comma-dangle
'comma-dangle':['error','never'],
// golf tabbing is cool
'indent':'off',
// no trailing whitespace
'no-trailing-spaces':'error',
// no multiple empty lines
'no-multiple-empty-lines':['error',{max:1}],
// prefer const, but allow let for reassignment
'prefer-const':'error',
// typeScript-specific:allow type-only imports/exports,prefer type imports
'@typescript-eslint/consistent-type-imports':[
'error',{prefer:'type-imports'}],
// allow generic arrow function spacing
'space-in-parens':['error','never']}},
// ignore build and deps
{ignores:['dist/','node_modules/']}];
