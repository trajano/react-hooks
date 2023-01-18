import { act, render, screen } from "@testing-library/react";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { SubscriptionManager, useSubscription } from "../useSubscription";
import { usePolling } from "./usePolling";

interface PollingData {
  subscribe: SubscriptionManager["subscribe"];
  fetchData(): Promise<number[]>;
}
const renderCallback = jest.fn();
const PollingDataContext = createContext<PollingData>({} as PollingData);

function PollingDataProvider({ children }: PropsWithChildren<{}>): JSX.Element {
  const { subscribe, notify } = useSubscription();

  const dataRef = useRef<number[]>([]);

  function pollingCallback() {
    dataRef.current.push(Math.random());
    notify();
  }

  const fetchData = useCallback(async (): Promise<number[]> => Promise.resolve([...dataRef.current]), []);


  usePolling(pollingCallback);
  renderCallback();

  const contextValue = useMemo(() => ({ fetchData, subscribe }), [fetchData, subscribe])
  return (
    <PollingDataContext.Provider value={contextValue}>
      {children}
    </PollingDataContext.Provider>
  );
}

function usePollingData(): PollingData {
  return useContext(PollingDataContext);
}

describe("Polling with notifications", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work with just the callback", async () => {
    function MyComponent() {
      const { fetchData, subscribe } = usePollingData();
      const [data, setData] = useState<number[]>([]);

      useEffect(
        () => subscribe(async () => setData(await fetchData())),
        [subscribe, setData, fetchData]
      );

      return (
        <div data-testid="test">
          {data.map((r, index) => (
            <div key={r} data-testid={`.${index}`}>
              {r.toString()}
            </div>
          ))}
        </div>
      );
    }

    const { unmount } = render(
      <PollingDataProvider>
        <MyComponent />
      </PollingDataProvider>
    );
    expect(screen.queryByTestId(".0")).toBeFalsy();
    await act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId(".0")).toBeTruthy();
    expect(screen.queryByTestId(".1")).toBeFalsy();
    await act(() => {
      jest.advanceTimersByTime(54000);
    });
    expect(screen.getByTestId(".0")).toBeTruthy();
    expect(screen.queryByTestId(".1")).toBeFalsy();
    await act(() => {
      jest.advanceTimersByTime(1000);
    });
    expect(screen.getByTestId(".0")).toBeTruthy();
    expect(screen.queryByTestId(".1")).toBeFalsy();
    await act(() => {
      jest.advanceTimersByTime(60000);
    });
    expect(renderCallback).toBeCalledTimes(1);
    expect(screen.getByTestId(".1")).toBeTruthy();
    expect(screen.queryByTestId(".2")).toBeFalsy();
    unmount();
  });
});
