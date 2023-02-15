import debounce from "lodash/debounce";
describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.useRealTimers();
  });
  it("should work properly", () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 500);
    debounced();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    debounced();
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(499);
    expect(callback).not.toHaveBeenCalled();

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  it("should fire with lead", () => {
    const callback = jest.fn();
    const debounced = debounce(callback, 500, { leading: true });
    expect(callback).not.toHaveBeenCalled();
    debounced();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(100);
    debounced();
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(499);
    expect(callback).toHaveBeenCalledTimes(1);

    jest.advanceTimersByTime(1);
    expect(callback).toHaveBeenCalledTimes(2);
  });
});
