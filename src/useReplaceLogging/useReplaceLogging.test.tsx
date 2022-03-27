/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React from 'react';
import { useReplaceLogging } from "./useReplaceLogging";

describe("useReplaceLogging", () => {

  it("should work and not rerender", async () => {
    const logCallback = jest.fn();
    const errorCallback = jest.fn();

    function MyComponent() {
      useReplaceLogging({
        log: logCallback,
        debug: logCallback,
        error: errorCallback,
      });

      console.log("Hello");

      return (<div data-testid="test">Hello world</div>);
    }

    const { unmount } = render(<MyComponent />)

    expect(logCallback.mock.calls).toEqual([["Hello"]]);
    unmount();
    console.log("This should be shown on the console");
    expect(logCallback.mock.calls).toEqual([["Hello"]]);

  })

})
