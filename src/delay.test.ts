import { waitFor } from "@testing-library/dom";
import { delay } from "./delay";

async function timerGame(delayTime: number, callback: () => void) {
  await delay(delayTime);
  callback();
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
    expect(callback).not.toBeCalled();
    jest.runAllTimers();
    await waitFor(() => expect(callback).toBeCalledTimes(1));
  });

  afterEach(() => {
    jest.useRealTimers();
  });
});
