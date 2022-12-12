/**
 * @jest-environment jsdom
 */
/* eslint-disable jsx-a11y/click-events-have-key-events  */
/* eslint-disable jsx-a11y/no-static-element-interactions  */
import { act, render } from '@testing-library/react';
import { parseISO } from 'date-fns';
import React from 'react';
import { useClockState } from "./useClockState";


describe("Clock update", () => {
    it("should work when starting at zero seconds", async () => {
        const renderCallback = jest.fn();

        const now = parseISO('2020-01-01T00:00:00Z');
        jest
            .useFakeTimers()
            .setSystemTime(now);

        function PerSecondClock() {
            const now = useClockState();
            renderCallback();
            return (<div data-testid="test">{now.toISOString()}</div>);
        }

        const { getByTestId } = render(<PerSecondClock />)
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:00.000Z');
        expect(renderCallback).toBeCalledTimes(1);

        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:00.000Z');

        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:01.000Z');
        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:01.000Z');

        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:02.000Z');
    });

    it("should work when starting at non-zero seconds", async () => {
        const renderCallback = jest.fn();

        const now = parseISO('2020-01-01T00:00:00.500Z');
        jest
            .useFakeTimers()
            .setSystemTime(now);

        function PerSecondClock() {
            const now = useClockState();
            renderCallback();
            return (<div data-testid="test">{now.toISOString()}</div>);
        }

        const { getByTestId } = render(<PerSecondClock />)
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:00.500Z');
        expect(renderCallback).toBeCalledTimes(1);

        await act(() => jest.advanceTimersByTime(499));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:00.500Z');

        await act(() => jest.advanceTimersByTime(1));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:01.000Z');
        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:01.000Z');

        await act(() => jest.advanceTimersByTime(500));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T00:00:02.000Z');
    });

    it("should work when starting at non-zero seconds with day interval", async () => {
        const renderCallback = jest.fn();

        const now = parseISO('2020-01-01T12:00:00.500Z');
        jest
            .useFakeTimers()
            .setSystemTime(now);

        function PerDayClock() {
            const now = useClockState(24 * 60 * 60 * 1000);
            renderCallback();
            return (<div data-testid="test">{now.toISOString()}</div>);
        }

        const { getByTestId } = render(<PerDayClock />)
        expect(getByTestId("test").textContent).toEqual('2020-01-01T12:00:00.500Z');
        expect(renderCallback).toBeCalledTimes(1);

        await act(() => jest.advanceTimersByTime(499));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T12:00:00.500Z');

        await act(() => jest.advanceTimersByTime(1));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T12:00:00.500Z');

        await act(() => jest.advanceTimersByTime(12 * 60 * 60 * 1000 - 2000));
        expect(getByTestId("test").textContent).toEqual('2020-01-01T12:00:00.500Z');

        await act(() => jest.advanceTimersByTime(1000));
        expect(getByTestId("test").textContent).toEqual('2020-01-02T00:00:00.000Z');

        await act(() => jest.advanceTimersByTime(24 * 60 * 60 * 1000));
        expect(getByTestId("test").textContent).toEqual('2020-01-03T00:00:00.000Z');
    });

    afterEach(() => {
        jest.useRealTimers();
    });
});
