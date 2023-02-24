/**
 * Interface that the context would provide.  `interface` instead of `type`,
 * this is because a context value is not just a set of values but also
 * functions, so `interface` is a more natural use of it.
 *
 * Even if this can be thought of as an internal representation, exporting
 * it allows TypeDoc to render the documentation.
 *
 * Another approach could be `Xyz` but there's a good likelihood that
 * an existing third-party module will be exposing the same type, as such
 * suffixing it with `Context` mitigates the issue.
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface XyzContext {}
