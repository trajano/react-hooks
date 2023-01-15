/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import noop from "lodash/noop";
import React from "react";

import { usePollingIf } from "./usePollingIf";

describe("usePollingIf with an error", () => {
  let errorMock: jest.SpyInstance;
  beforeEach(() => {
    errorMock = jest.spyOn(console, "error").mockImplementation(noop);
  });
  it("should keep on going even if there are errors", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    callback.mockImplementation(() => {
      throw new Error();
    });
    let renderCount = 0;
    function MyComponent() {
      usePollingIf(() => true, callback);
      ++renderCount;
      return <div data-testid="test">{renderCount}</div>;
    }

    render(<MyComponent />);
    expect(screen.getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(1);
    expect(errorMock.mock.calls[0][0]).toEqual("Error while polling");
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(2);
    expect(errorMock.mock.calls[1][0]).toEqual("Error while polling");
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
    });
    expect(callback).toBeCalledTimes(3);
    expect(errorMock.mock.calls[2][0]).toEqual("Error while polling");
  });

  afterEach(() => {
    jest.useRealTimers();
    errorMock.mockReset();
  });
});
