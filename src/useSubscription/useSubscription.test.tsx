/**
 * @jest-environment jsdom
 */
import { render, screen, waitFor } from "@testing-library/react";
import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
} from "react";

import type { SubscriptionManager } from "./SubscriptionManager";
import { useSubscription } from "./useSubscription";

describe("useSubscription", () => {
  it("should notify with clicks", async () => {
    const callback = jest.fn();
    const MyContext = createContext<SubscriptionManager>(
      {} as SubscriptionManager
    );
    function MyContextProvider({
      children,
    }: PropsWithChildren<Record<string, unknown>>) {
      const { subscribe, notify, useSubscribeEffect } = useSubscription();
      const contextValue = useMemo(()=>({subscribe, notify, useSubscribeEffect}),[subscribe, notify, useSubscribeEffect])
      return (
        <MyContext.Provider value={contextValue}>
          {children}
        </MyContext.Provider>
      );
    }
    function MyComponent() {
      const { subscribe, notify } = useContext(MyContext);
      function onClick() {
        notify();
      }
      useEffect(() => subscribe(callback), [subscribe]);
      return (
        <div data-testid="test" onClick={onClick}>
          abc
        </div>
      );
    }
    render(
      <MyContextProvider>
        <MyComponent />
      </MyContextProvider>
    );
    const element = screen.getByTestId("test");
    expect(element.textContent).toEqual("abc");
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
  });

  it("should notify with clicks using generated hook", async () => {
    const callback = jest.fn();
    const MyContext = createContext<SubscriptionManager>(
      {} as SubscriptionManager
    );
    function MyContextProvider({
      children,
    }: PropsWithChildren<Record<string, unknown>>) {
      const { subscribe, notify, useSubscribeEffect } = useSubscription();
      const contextValue = useMemo(()=>({subscribe, notify, useSubscribeEffect}),[subscribe, notify, useSubscribeEffect])
      return (
        <MyContext.Provider value={contextValue}>
          {children}
        </MyContext.Provider>
      );
    }
    function MyComponent() {
      const { useSubscribeEffect, notify } = useContext(MyContext);
      function onClick() {
        notify();
      }
      useSubscribeEffect(callback);
      return (
        <div data-testid="test" onClick={onClick}>
          abc
        </div>
      );
    }
    render(
      <MyContextProvider>
        <MyComponent />
      </MyContextProvider>
    );
    const element = screen.getByTestId("test");
    expect(element.textContent).toEqual("abc");
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
  });
});
