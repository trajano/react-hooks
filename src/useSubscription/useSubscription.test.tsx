/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import { createContext, PropsWithChildren, useContext, useEffect } from 'react';
import { waitFor } from "@testing-library/dom";
import { useSubscription } from "./useSubscription";
import { SubscriptionManager } from "./SubscriptionManager";

describe("useSubscription", () => {
  it("should notify with clicks", async () => {
    const callback = jest.fn();
    const MyContext = createContext<SubscriptionManager>({} as SubscriptionManager);
    function MyContextProvider({ children }: PropsWithChildren<{}>) {
      const { subscribe, notify } = useSubscription();
      return <MyContext.Provider value={{ subscribe, notify }}>{children}</MyContext.Provider>
    }
    function MyComponent() {
      const { subscribe, notify } = useContext(MyContext);
      function onClick() {
        notify();
      }
      useEffect(() => subscribe(callback), []);
      return (<div data-testid="test" onClick={onClick}>abc</div>);
    }
    const { getByTestId } = render(<MyContextProvider><MyComponent /></MyContextProvider>)
    const element = getByTestId("test");
    expect(element.textContent).toEqual("abc");
    await waitFor(() => expect(callback).toBeCalledTimes(0));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    element.click();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
  })
});
