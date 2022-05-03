/**
 * Interface that the context would provide.  `interface` instead of `type`,
 * this is because a context value is not just a set of values but also
 * functions, so `interface` is a more natural use of it.  When this exported
 * it drops the `I` prefix.
 *
 * Even if this can be thought of as an internal representation, exporting
 * it allows TypeDoc to render the documentation.
 * @internal
 */
export interface IXyzContext {}
