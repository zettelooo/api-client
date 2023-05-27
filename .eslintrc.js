const productionErrorOtherwiseWarn = process.env.NODE_ENV === 'production' ? 'error' : 'warn'
const productionError = process.env.NODE_ENV === 'production' ? 'error' : 0
const productionWarn = process.env.NODE_ENV === 'production' ? 'warn' : 0

module.exports = {
  extends:
    process.env.NODE_ENV === 'production'
      ? ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended']
      : ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  plugins: ['@typescript-eslint', 'prettier'],
  env: {
    browser: true,
  },
  ignorePatterns: ['.*', '**/*.md', '**/package.json', '**/package-lock.json', '**/tsconfig.json', 'scripts/**'],
  rules: {
    '@typescript-eslint/ban-types': ['error', { types: { '{}': false } }], // To be able to have types like this: (string & {}) | 'something'
    '@typescript-eslint/explicit-function-return-type': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    '@typescript-eslint/lines-between-class-members': 0, // Properties in classes should stick together
    '@typescript-eslint/naming-convention': 0, // We convensionally name things fine, but it complains about other libraries too when we're decomposing objects, like MongoDB's default ID property name; "_id"
    '@typescript-eslint/no-empty-function': productionWarn,
    '@typescript-eslint/no-empty-interface': productionWarn,
    '@typescript-eslint/no-explicit-any': 0, // There are lots of unavoidable usecases for explicit any
    '@typescript-eslint/no-namespace': 0, // We make use of namespaces to structure component relatives without requiring extra name declarations
    '@typescript-eslint/no-non-null-asserted-optional-chain': 0, // Non-null assertion can be allowed after optional chain for the same reason it is anywhere else, and that reason is that the developer simply "knows" it is OK but the TS engine doesn't
    '@typescript-eslint/no-non-null-assertion': 0, // We only use ! operators when we are certain about it, it's more useful than just being avoided that easily
    '@typescript-eslint/no-redeclare': 0, // It complains over namespaces with the same names as their components, also whenever it's necessary, the compiler will complain about it in a more restricted way
    '@typescript-eslint/no-shadow': 0, // No complains on similarities between type names and enum keys
    '@typescript-eslint/no-var-requires': 'warn',
    '@typescript-eslint/no-unused-expressions': 0, // To allow using these operators: fn?.(), fn && fn(), etc.
    '@typescript-eslint/no-unused-vars': productionWarn, // It does no harm, instead, there are times we want to keep track of what arguments, types, variables, and so on possibilities we have for future work or keep consistency with the implementing interface, but we need to take care of unused imports ourselves
    '@typescript-eslint/no-use-before-define': 0, // Conflicts with Clean Code's instructions, interferes with working with types, we just do it in function components
    'array-callback-return': 0, // It's dumb! It does not consider the return statements inside a switch block
    'consistent-return': 0, // Handeled by TypeScript
    'default-case': 0, // Handeled by TypeScript
    'func-names': 0, // There are many places in our extensions code that we need to have unnamed functions, they just provide too many irrelevant warnings
    'import/export': 0, // There is no benefit but problems with the check, if the app can compile, then there are no problems with any import/export, therefore we don't need that
    'import/extensions': 0, // Handled nicely by the IDE, development tools, and build tools
    'import/no-cycle': 0, // Handled more accurately with the compiler itself
    'import/prefer-default-export': 0, // No default exports in this code base due to difficulties with working with the default exports
    'max-classes-per-file': 0, // We have our own file structure and we pretty much respect this rule most of the time. But, there are exceptional situations where our file structure has different requirements
    'no-await-in-loop': productionWarn, // We make sure not to serialize async actions when we can avoid that, but there are unavoidable situations where we need to do so, like fetching all the data from a paginated end-point, or synchronizing actions when the application order matters
    'no-bitwise': 0, // Why not? We need it to handle Node.js module "fs" flags
    'no-constant-condition': 0,
    'no-continue': 0, // Unlike the claim, in some situations it really helps in code clarity and readability, just like `break` it's a usefull flow control command of the language and we shall be free to use it when needed. Of course, we'll go with `break` alone anytime we can manage to do that nicely
    'no-debugger': productionError,
    // 'no-default-export': 2, // TODO: Activate this after installing and configuring these dependencies: eslint-plugin-import & @typescript-eslint/parser
    'no-empty-pattern': productionWarn,
    'no-irregular-whitespace': 'warn',
    'no-nested-ternary': 0, // We have found nested ternary operations very useful and readable
    'no-param-reassign': productionWarn, // In array reductions, to deal with keeping reference and caring for performance, we have no other choice
    'no-template-curly-in-string': 0, // There are cases where we have regular string literals (not templates) with curly braces, like "${name}"
    'no-underscore-dangle': 0, // We convensionally won't name things like "_abc", unless it comes from another library, like MongoDB's default ID property name; "_id"
    'no-unused-expressions': 0, // To allow using these operators: fn?.(), fn && fn(), etc.
    'no-void': 0, // We're going to use this operator for some usecases like arrow function expressions in useEffect clean-up functions
    'object-shorthand': ['error', 'always', { avoidQuotes: false }],
    'prefer-const': productionErrorOtherwiseWarn,
    'prettier/prettier': productionError,
    'spaced-comment': [productionErrorOtherwiseWarn, 'always'], // We use un-spaced comments for lines which we don't want to commit
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig.json',
  },
}
