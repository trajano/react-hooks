/**
 * @jest-environment jsdom
 */
/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable jsx-a11y/no-static-element-interactions  */
import { act, render, waitFor } from '@testing-library/react';
import React, { useState } from 'react';
import { useClock } from "./useClock";

const renderCallback = jest.fn();

function MyComponent() {
  const { useSubscribeEffect } = useClock();
  const [date, setDate] = useState<number>(Date.now());
  useSubscribeEffect(setDate)
  renderCallback();
  return (<div data-testid="test">{date}</div>);
}

describe("Clock update", () => {
  it("should work when starting at zero seconds", async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-01-01T00:00:00Z').getTime());

    const { getByTestId } = render(<MyComponent />)
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:00:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    jest.advanceTimersByTime(59999)
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:00:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    act(() => {
      jest.advanceTimersByTime(1);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:01:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(2);
    });
    act(() => {
      jest.advanceTimersByTime(60000);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:02:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(3);
    });
  })
  it("should work when not starting at zero seconds", async () => {
    jest
      .useFakeTimers('modern')
      .setSystemTime(new Date('2020-01-01T00:00:12.878Z').getTime());

    const { getByTestId } = render(<MyComponent />)
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:00:12.878Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    jest.advanceTimersByTime(59999 - 12878)
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:00:12.878Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(1);
    });
    act(() => {
      jest.advanceTimersByTime(1);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:01:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(2);
    });
    act(() => {
      jest.advanceTimersByTime(12878);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:01:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(2);
    });
    act(() => {
      jest.advanceTimersByTime(60000 - 12878);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:02:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(3);
    });
    act(() => {
      jest.advanceTimersByTime(12878);
    })
    await waitFor(() => {
      expect(getByTestId("test").textContent).toEqual(new Date('2020-01-01T00:02:00Z').getTime().toString());
      expect(renderCallback.mock.calls.length).toEqual(3);
    });
  })
  afterEach(() => {
    jest.useRealTimers()
      .resetAllMocks();
  });

})
