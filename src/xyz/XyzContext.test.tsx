import { render, screen } from "@testing-library/react";
import React from "react";
import { XyzProvider } from "./XyzProvider";
import { useXyz } from "./useXyz";

describe("xyzContext", () => {
  it("should render", () => {
    function MyComponent() {
      const xyz = useXyz();
      return <div data-testid="test">{JSON.stringify(xyz)}</div>;
    }
    render(
      <XyzProvider>
        <MyComponent />
      </XyzProvider>
    );
    expect(screen.getByTestId("test").textContent).toEqual("{}");
  });
});
