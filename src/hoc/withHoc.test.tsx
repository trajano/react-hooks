import { act, render, screen } from "@testing-library/react";
import '@testing-library/jest-dom'
import React from "react";
import {
  ComponentType,
  forwardRef,
  NamedExoticComponent,
  PropsWithoutRef,
  ReactElement,
  Ref,
  RefAttributes,
  useEffect,
  useRef,
} from "react";

import { withHoc } from './withHoc'

type IgnoredProps = {
  foo: string;
  bar: string;
};

type MyComponentProps = { text: string }
function MyComponent({ text }: MyComponentProps) {
  return <span data-testid="my-element">{text}</span>
}
const MyComponentWithRef = forwardRef<HTMLSpanElement, MyComponentProps>(({ text }, ref) => <span data-testid="my-ref-element" ref={ref}>{text}</span>)

describe("hoc", () => {

  it("simple component should work as expected", async () => {
    render(<MyComponent text="bar" />);
    expect(screen.getByTestId("my-element")).toHaveTextContent("bar");
  })
  it("should work with simple component", () => {
    const HocMyComponent = withHoc<MyComponentProps, MyComponentProps, HTMLSpanElement>(MyComponent);

    const { asFragment } = render(<HocMyComponent text="should be as is" />);
    expect(screen.getByTestId("my-element")).toHaveTextContent("should be as is");
    const { asFragment: expectedAsFragment } = render(<span data-testid="my-element">should be as is</span>);
    expect(asFragment()).toStrictEqual(expectedAsFragment());
  });

  it("should work with reffed component", () => {
    const HocMyComponent = withHoc<MyComponentProps, MyComponentProps, HTMLSpanElement>(MyComponentWithRef);

    const { asFragment } = render(<HocMyComponent text="should be as is" />);
    expect(screen.getByTestId("my-ref-element")).toHaveTextContent("should be as is");
    const { asFragment: expectedAsFragment } = render(<span data-testid="my-ref-element">should be as is</span>);
    expect(asFragment()).toStrictEqual(expectedAsFragment());
  });

});
