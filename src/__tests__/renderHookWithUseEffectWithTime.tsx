/**
 * @jest-environment jsdom
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import React, { useEffect, useState } from "react";

const useRenderHookWithUseEffectWithTime = (effectCallback: () => void, cleanupEffectCallback: () => void) => {
  useEffect(() => {
    const timeoutID = setTimeout(effectCallback, 100);
    return () => { cleanupEffectCallback(); clearTimeout(timeoutID) }
  }, [effectCallback, cleanupEffectCallback])
};
describe("renderHook with useEffect", () => {
  beforeEach(() => { jest.useFakeTimers() });
  afterEach(() => { jest.useRealTimers() });
  it("should fire effect and cleanup", () => {
    const effect1 = jest.fn();
    const cleanup1 = jest.fn();
    const { unmount } = renderHook(
      ({ effectCallback, cleanupEffectCallback }: {
        effectCallback: () => void,
        cleanupEffectCallback: () => void
      }) =>
        useRenderHookWithUseEffectWithTime(effectCallback, cleanupEffectCallback)
      , { initialProps: { effectCallback: effect1, cleanupEffectCallback: cleanup1 } });
    expect(effect1).toBeCalledTimes(0);
    jest.advanceTimersByTime(100);
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(0);
    unmount();
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(1);
  });

  it("should unmount when rerendering", () => {
    const effect1 = jest.fn();
    const cleanup1 = jest.fn();
    const effect2 = jest.fn();
    const cleanup2 = jest.fn();
    const { unmount, rerender } = renderHook(
      ({ effectCallback, cleanupEffectCallback }: {
        effectCallback: () => void,
        cleanupEffectCallback: () => void
      }) =>
        useRenderHookWithUseEffectWithTime(effectCallback, cleanupEffectCallback)
      , { initialProps: { effectCallback: effect1, cleanupEffectCallback: cleanup1 } });
    expect(effect1).toBeCalledTimes(0);
    jest.advanceTimersByTime(100);
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(0);
    expect(effect2).toBeCalledTimes(0);
    expect(cleanup2).toBeCalledTimes(0);
    rerender({ effectCallback: effect2, cleanupEffectCallback: cleanup2 })
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(1);
    expect(effect2).toBeCalledTimes(0);
    expect(cleanup2).toBeCalledTimes(0);
    jest.advanceTimersByTime(100);
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(1);
    expect(effect2).toBeCalledTimes(1);
    expect(cleanup2).toBeCalledTimes(0);
    unmount();
    expect(effect1).toBeCalledTimes(1);
    expect(cleanup1).toBeCalledTimes(1);
    expect(effect2).toBeCalledTimes(1);
    expect(cleanup2).toBeCalledTimes(1);
  });


});
