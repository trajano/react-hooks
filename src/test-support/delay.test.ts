/**
 * @jest-environment jsdom
 */
import { waitFor } from "@testing-library/react";
import { delay } from "./delay";

async function timerGame(delayTime: number, callback: () => void) {
  await delay(delayTime);
  callback();
}

async function pollingGame(delayTime: number, callback: () => void) {
  await delay(delayTime);
  callback();
  await pollingGame(delayTime, callback);
}

describe("delay", () => {
  it("calls the callback after 1 seconds unmocked", async () => {
    const callback = jest.fn();
    expect(callback).not.toBeCalled();
    await timerGame(1000, callback);
    await waitFor(() => expect(callback).toBeCalledTimes(1));
  });

  it("calls the callback after 10 seconds mocked", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    timerGame(10000, callback);
    await waitFor(() => expect(callback).not.toBeCalled());
    jest.runAllTimers();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
  });

  it("polls the callback after 10 seconds mocked", async () => {
    jest.useFakeTimers();
    const callback = jest.fn();
    pollingGame(10000, callback);
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    jest.runAllTimers();
    await waitFor(() => expect(callback).toBeCalledTimes(2));
    jest.runAllTimers();
    await waitFor(() => expect(callback).toBeCalledTimes(3));
  });

  it("polls the callback after 10 seconds mocked using modern timers", async () => {
    jest.useFakeTimers("modern");
    const callback = jest.fn();
    pollingGame(10000, callback);
    expect(callback).not.toBeCalled();
    jest.advanceTimersByTime(10000);
    await waitFor(() => expect(callback).toBeCalledTimes(1));
    jest.advanceTimersByTime(10000);
    await waitFor(() => expect(callback).toBeCalledTimes(2));
    jest.advanceTimersByTime(10000);
    await waitFor(() => expect(callback).toBeCalledTimes(3));
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
