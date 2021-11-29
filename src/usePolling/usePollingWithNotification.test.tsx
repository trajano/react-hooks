import { waitFor } from "@testing-library/dom";
import { render } from '@testing-library/react';
import { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { usePolling } from './usePolling';

interface PollingData {
  subscribe(fn: () => void): () => void;
  fetchData(): Promise<number[]>;
}
const renderCallback = jest.fn();
const PollingDataContext = createContext<PollingData>({} as PollingData);

function PollingDataProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const subscribersRef = useRef<(() => void)[]>([]);
  const dataRef = useRef<number[]>([]);
  function subscribe(fn: () => void) {
    subscribersRef.current.push(fn);
    return () => { subscribersRef.current = subscribersRef.current.filter(subscription => !Object.is(subscription, fn)); }
  }
  function callback() {
    dataRef.current.push(Math.random());
    subscribersRef.current.forEach(fn => fn());
  }
  async function fetchData(): Promise<number[]> {
    return Promise.resolve([...dataRef.current]);
  }
  usePolling(callback);
  renderCallback();
  return <PollingDataContext.Provider value={{ fetchData, subscribe }}>{children}</PollingDataContext.Provider>
}

function usePollingData(): PollingData {
  return useContext(PollingDataContext);
}

describe("Polling with notifications", () => {
  it("should work with just the callback", async () => {
    jest.useFakeTimers();
    function MyComponent() {
      const { fetchData, subscribe } = usePollingData();
      const [data, setData] = useState<number[]>([]);

      useEffect(() => subscribe(async () => setData(await fetchData())), [])

      return (<div data-testid="test">{data.map((r) => (<div key={r}>{r.toString()}</div>))}</div>);
    }

    const { getByTestId } = render(<PollingDataProvider><MyComponent /></PollingDataProvider>)
    await waitFor(() => {
      expect(getByTestId("test").childElementCount).toEqual(0);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").childElementCount).toEqual(1);
    });
    jest.runAllTimers();
    await waitFor(() => {
      expect(getByTestId("test").childElementCount).toEqual(2);
    });
    expect(renderCallback.mock.calls.length).toEqual(1);
  })
  afterEach(() => {
    jest.useRealTimers();
  });

})
