import { waitFor } from "@testing-library/dom";
import { render } from '@testing-library/react';
import { usePolling } from './usePolling';


describe("usePolling", () => {

  it("should work with a real clock", async () => {
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback, 500, true);
      ++renderCount;
      return (<div data-testid="test">{renderCount}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("1");
    expect(renderCount).toEqual(1);
    expect(callback).toBeCalledTimes(1);
    await waitFor(() => {
      expect(callback).toBeCalledTimes(2);
      expect(renderCount).toEqual(1);
    });
    await waitFor(() => {
      expect(callback).toBeCalledTimes(3);
      expect(renderCount).toEqual(1);
    });
  })

  it("should work with just the callback", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback);
      ++renderCount;
      return (<div data-testid="test">{renderCount}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(1);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(2);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(3);
    });
  })

  it("should not start immediately if specified", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let renderCount = 0;
    function MyComponent() {
      usePolling(callback, 1000, false);
      ++renderCount;
      return (<div data-testid="test">{renderCount}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("1");
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(0);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(1);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(renderCount).toEqual(1);
      expect(callback).toBeCalledTimes(2);
    });

  })
  afterEach(() => {
    jest.useRealTimers();
  });

})
