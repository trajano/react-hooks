import { ComponentType, forwardRef, NamedExoticComponent, PropsWithoutRef, ReactElement, Ref, RefAttributes } from "react";

/**
 * This is a simple HoC that is a noop that supports ref forwarding.  The ref fowarding logic is added
 * as [refs are not passed through](https://reactjs.org/docs/higher-order-components.html#refs-arent-passed-through)
 * HoCs by default.
 * @param Component component to wrap
 * @param _options options for the HoC building
 * @typeParam P the exposed props of the higher order component (does not require Q props)
 * @typeParam Q the props for the wrapped component
 * @typeParam T type for ref attribute of the wrapped component
 * @typeParam O options for the HoC building
 * @returns A named exotic componentwith P props that accepts a ref
 */
export function withHoc<P extends Q, Q extends object, T, O = object>(
  Component: ComponentType<Q>,
  _options?: O
): NamedExoticComponent<PropsWithoutRef<P> & RefAttributes<T>> {
  function useWrapped(props: P, ref: Ref<T>): ReactElement<Q> {
    // the an unknown as Q here is an example, but P and Q can be different.
    const componentProps: Q = props as Q;
    return <Component {...componentProps} ref={ref} />;
  }
  const displayName =
    Component.displayName || Component.name || "AnonymousComponent";
  useWrapped.displayName = `hoc(${displayName})`;
  return forwardRef(useWrapped);
}
