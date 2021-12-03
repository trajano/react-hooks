/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React, { useState } from 'react';
import { waitFor } from "@testing-library/dom";
import { useAsyncSetEffect } from "./useAsyncSetEffect";

describe("useAsyncSetEffect", () => {
  it("should work", async () => {
    function MyComponent() {
      const [foo, setFoo] = useState("bar");

      useAsyncSetEffect(() => Promise.resolve("foo"), setFoo, []);
      return (<div data-testid="test">{foo}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    const element = getByTestId("test");
    await waitFor(() => expect(element.textContent).toEqual("bar"));
    await waitFor(() => expect(element.textContent).toEqual("foo"));
  })
});
