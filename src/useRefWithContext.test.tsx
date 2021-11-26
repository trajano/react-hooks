import { waitFor } from "@testing-library/dom";
import { render } from '@testing-library/react';
import { useRef } from 'react';
import { RenderingContext, RerenderingProvider } from "./RerenderingContext";
describe('useRef with context', () => {
  it("should get the same object when the parent rerenders using component, but the component will not rerender as there is no state change", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    let x = 0;
    function MyComponent({ value }: { value: number }) {
      const random = Math.random();
      const myRef = useRef({ random })
      if (x === 0) {
        x = myRef.current.random
      }
      callback();
      return (<>
        <div data-testid="test">{JSON.stringify(myRef.current)}</div>
        <div data-testid="random">{JSON.stringify(random)}</div>
      </>);
    }

    const { getByTestId } = render(<RerenderingProvider><RenderingContext.Consumer >{value => (<MyComponent value={value.value} />)}</RenderingContext.Consumer></RerenderingProvider>)
    expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
    expect(callback).toBeCalledTimes(1);
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(JSON.stringify({ random: x }));
      expect(callback).toBeCalledTimes(2);
    });
  })

  afterEach(() => {
    jest.useRealTimers();
  })
})
