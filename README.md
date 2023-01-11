# React Hooks

A collection of general purpose, side-effect free, hooks that can be used in React apps.  It is tested with React and React Native.

This targets React 18 to make it work with Expo 47.

## Origin

Originally this was *React Hook Tests* which is a bunch of hooks I wrote to learn how to use React hooks and have associated jest tests with it and attempt to get a [good test coverage](https://trajano.github.io/react-hooks/lcov-report/).

## Explicit linting rules

These are fixable using `--fix`

* [arrow-body-style](https://eslint.org/docs/latest/rules/arrow-body-style)
* [curly](https://eslint.org/docs/latest/rules/curly)
* [eqeqeq](https://eslint.org/docs/latest/rules/eqeqeq)
* [logical-assignment-operators](https://eslint.org/docs/latest/rules/logical-assignment-operators)
* [multiline-comment-style](https://eslint.org/docs/latest/rules/multiline-comment-style)
* [no-floating-decimal](https://eslint.org/docs/latest/rules/no-floating-decimal)
* [prefer-arrow-callback](https://eslint.org/docs/latest/rules/prefer-arrow-callback) since the naming is done automatically by babel
  * https://stackoverflow.com/questions/49306148/why-is-arrow-syntax-preferred-over-function-declaration-for-functional-react-com
  * https://stackoverflow.com/questions/32828698/difference-between-anonymous-function-vs-named-function-as-value-for-an-object-k/32830772#32830772
* [prefer-const](https://eslint.org/docs/latest/rules/prefer-const)
* "prefer-numeric-literals": "error",
* "prefer-object-spread": "error",
* "prefer-template": "error",
* "yoda": "error",
* [@typescript-eslint/ban-types](https://typescript-eslint.io/rules/ban-types) is ignored becaues React uses `{}` as the prop type default.
