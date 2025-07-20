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
rules:{
"no-unused-vars": "error",
"@typescript-eslint/no-unused-vars": "error",
"no-unused-expressions": "off",
"@typescript-eslint/no-unused-expressions": "off",
"@typescript-eslint/no-inferrable-types": "off",
'space-before-function-paren':[
'error',{anonymous:'never',named:'never',asyncArrow:'never'}],
'array-bracket-spacing':['error','never'],
'object-curly-spacing':['error','never'],
'object-curly-newline':['off'],
'arrow-spacing':['error',{before:false,after:false}],
'comma-dangle':['error','never'],
'indent':'off',
'no-trailing-spaces':'error',
'no-multiple-empty-lines':['error',{max:1}],
'prefer-const':'error',
'@typescript-eslint/consistent-type-imports':[
'error',{prefer:'type-imports'}],
'space-in-parens':['error','never']}},
{ignores:['dist/','node_modules/']}];
