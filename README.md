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

## Why lodash?

Instead of [Ramda](https://ramdajs.com/) and [Rambda](https://selfrefactor.github.io/rambda/)? [`debounce`](https://lodash.com/docs/4.17.15#debounce) is only implemented in Lodash.

## Why npm?

This project used Yarn earlier.  However, it has changed to npm again.  Reasons:

* [Facebook still uses Yarn 1 over Yarn Berry](https://shift.infinite.red/yarn-1-vs-yarn-2-vs-npm-a69ccf0229cd) so seems like a contention there.
* Since this this a stand alone project, I'd rather reduce the complexity of the setup.  For my [monorepo](https://github.com/trajano/spring-cloud-demo) that is using this Yarn works with it.
* `npm` is installed with NodeJS
* `npm` has workspace support as well.
* `npm` has stricter semver checks.

The [2020 article on Yarn 1 vs Yarn 2 vs NPM](https://shift.infinite.red/yarn-1-vs-yarn-2-vs-npm-a69ccf0229cd) gives a bit of insights and priorities though my order is slightly different

1. Broad support — needs to work with React Native, Node CLIs, web — anything we do. We work with a number of clients over a range of technologies and having a package manager that can be used for all our ~~JavaScript~~ TypeScript technologies is a must-have
2. Predictability — will install the same packages every time. Having different versions on different machines makes debugging quite difficult
3. Reliability — it’s not flaky nor does it fail randomly. Nothing seems to frustrate developers as fast as flaky tools
4. Speed — lowered the priority because I prefer predictability and reliability over speed.
5. Caching — local installs wherever possible. We all work remotely and so less network traffic/bandwidth is critical
6. Community adoption 
7. Cost of change
8. Key value-added features
