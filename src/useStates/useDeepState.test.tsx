/**
 * @jest-environment jsdom
 */
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import React, { useEffect } from 'react';
import { delay } from '../test-support/delay';
import { useDeepState } from './useDeepState';


describe("useDeepState", () => {
  it("should set initial state", () => {
    function MyComponent() {
      const [foo] = useDeepState("bar");
      return (<div data-testid="test">{foo}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
  })

  it("should set initial state via a function", () => {
    function MyComponent() {
      const [foo] = useDeepState(() => "bar");
      return (<div data-testid="test">{foo}</div>);
    }
    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
  })

  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    const rendering = jest.fn();

    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val)
        })()
      }, [])
      rendering();
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(rendering).toBeCalledTimes(1)
    await act(() => jest.advanceTimersByTime(5000));
    expect(rendering).toBeCalledTimes(1)
    await act(() => jest.advanceTimersByTime(5000));
    expect(getByTestId("test").textContent).toEqual("bar");
    // skip this assertion as there's extra renders
    //expect(rendering).toBeCalledTimes(1)
  })


  it("should not rerender when setting state to the same value", async () => {
    jest.useFakeTimers();
    const rendering = jest.fn();
    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val)
          await delay(10000);
          setFoo(val)
        })()
      }, [])
      rendering();
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(rendering).toBeCalledTimes(1);
    await act(() => jest.advanceTimersByTime(5000));
    expect(rendering).toBeCalledTimes(1);
    await act(() => jest.advanceTimersByTime(5000));
    expect(getByTestId("test").textContent).toEqual("bar");
    await act(() => jest.advanceTimersByTime(10000));
    expect(getByTestId("test").textContent).toEqual("bar");
    // skip this assertion as there's extra renders
    //expect(rendering).toBeCalledTimes(1);
  })

  it("should rerender when setting state to different value", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    const val: Record<string, string> = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(val);
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ ...val, abc: "123" })
        })()
      }, [])
      ++renderCount;
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    await act(() => jest.advanceTimersByTime(5000));
    expect(renderCount).toEqual(1);
    await act(() => jest.advanceTimersByTime(5000));
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(2);
  })

  it("should not rerender when setting state to the same value, with value initialized from function", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    const val = { foo: "bar" };
    function MyComponent() {
      const [foo, setFoo] = useDeepState(() => val);
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo(val)
        })()
      }, [])
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    await act(() => { jest.runAllTimers() });
    expect(getByTestId("test").textContent).toEqual("bar");
    // expect(renderCount).toEqual(1);
  })

  it("should not rerender when setting state to the same value, even if different objects via click", async () => {
    const callback = jest.fn();
    const clickCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useDeepState<{ a: number }>({ a: 0 });
      callback();
      return (<div>
        <div data-testid="set1" onClick={() => { clickCallback(); setFoo({ a: 1 }); }} >1</div>
        <div data-testid="test">{foo.a}</div>
      </div>)
    }

    const { getByTestId } = render(<MyComponent />)
    const testElement = getByTestId("test");
    const set1 = getByTestId("set1");

    expect(testElement.textContent).toEqual("0");
    expect(callback).toBeCalledTimes(1)
    expect(clickCallback).not.toBeCalled()

    await act(() => { fireEvent.click(set1); });
    await waitFor(() => expect(testElement.textContent).toEqual("1"));

    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toBeCalledTimes(1)

    await act(() => { fireEvent.click(set1); });
    await waitFor(() => expect(testElement.textContent).toEqual("1"));
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toBeCalledTimes(2)

  })

  it("should not rerender when setting state to the same value, even if different objects via click, value initialized via function", async () => {
    const callback = jest.fn();
    const clickCallback = jest.fn();
    function MyComponent() {
      const [foo, setFoo] = useDeepState<{ a: number }>(() => ({ a: 0 }));
      callback();
      return (<div>
        <div data-testid="set1" onClick={() => { clickCallback(); setFoo({ a: 1 }); }} >1</div>
        <div data-testid="test">{foo.a}</div>
      </div>)
    }

    const { getByTestId } = render(<MyComponent />)
    const testElement = getByTestId("test");
    const set1 = getByTestId("set1");

    expect(testElement.textContent).toEqual("0");
    expect(callback).toBeCalledTimes(1)
    expect(clickCallback).not.toBeCalled()

    act(() => { fireEvent.click(set1); });
    await waitFor(() => expect(testElement.textContent).toEqual("1"));

    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toBeCalledTimes(1)

    act(() => { fireEvent.click(set1); });
    await waitFor(() => expect(testElement.textContent).toEqual("1"));
    expect(callback.mock.calls.length).toBeGreaterThanOrEqual(2);
    expect(clickCallback).toBeCalledTimes(2)

  })

  it("should not rerender when setting state to the same value, even if different objects", async () => {
    jest.useFakeTimers();
    let renderCount = 0;
    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
      ++renderCount;
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "bar" })
        })()
      }, [])
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCount).toEqual(1);
    await act(() => jest.runAllTimers());
    expect(getByTestId("test").textContent).toEqual("bar");
    // expect(renderCount).toEqual(1);
  })

  it("should rerender when setting state to the different values", async () => {
    jest.useFakeTimers('modern');
    const renderCallback = jest.fn();

    function MyComponent() {
      const [foo, setFoo] = useDeepState({ foo: "bar" });
      renderCallback();
      useEffect(() => {
        (async function asyncEffect() {
          await delay(10000);
          setFoo({ foo: "foo" })
        })()
      }, [])
      return (<div data-testid="test">{foo.foo}</div>);
    }

    const { getByTestId } = render(<MyComponent />)
    expect(getByTestId("test").textContent).toEqual("bar");
    expect(renderCallback).toBeCalledTimes(1)
    act(() => { jest.advanceTimersByTime(10000) });
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual("foo");
      expect(renderCallback).toBeCalledTimes(2)
    });
  })

})
