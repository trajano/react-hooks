/**
 * @jest-environment jsdom
 */
import { act, render, screen, waitFor } from "@testing-library/react";
import React, { createContext, PropsWithChildren, useContext, useEffect, useRef, useState } from 'react';
import { SubscriptionManager } from "../useSubscription";
import { useNotifiedPollingIf } from "./useNotifiedPollingIf";

interface PollingData {
  subscribe: SubscriptionManager["subscribe"];
  fetchData(): Promise<number[]>;
}
const renderCallback = jest.fn();
const PollingDataContext = createContext<PollingData>({} as PollingData);

function PollingDataProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const dataRef = useRef<number[]>([]);
  async function pollingCallback() {
    const newData = Math.random();
    dataRef.current.push(newData);
    return newData;
  }
  const { subscribe } = useNotifiedPollingIf(() => true, pollingCallback);

  async function fetchData(): Promise<number[]> {
    return Promise.resolve([...dataRef.current]);
  }

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

      useEffect(() => subscribe(async () => setData(await fetchData())), [fetchData, subscribe])

      return (<div data-testid="test">{data.map((r, index) => (<div key={r} data-testid={"." + index}>{r.toString()}</div>))}</div>);
    }

    const { unmount } = render(<PollingDataProvider><MyComponent /></PollingDataProvider>)
    expect(screen.queryByTestId(".0")).toBeFalsy();
    await act(() => { jest.runAllTimers() });
    await waitFor(() => {
      expect(screen.getByTestId(".0")).toBeTruthy();
    });
    await act(() => { jest.runAllTimers() });
    await waitFor(() => {
      expect(screen.getByTestId(".1")).toBeTruthy();
    });
    expect(renderCallback.mock.calls.length).toEqual(1);
    unmount();
  })
  afterEach(() => {
    jest.useRealTimers();
  });

})
