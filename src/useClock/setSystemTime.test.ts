export {}

describe("setSystemTime", () => {
  beforeEach(() => {
    jest.useFakeTimers("modern");
  });
  it("should give the proper mocked values", () => {
    jest.setSystemTime(new Date("2020-01-01T00:00:00Z").getTime());

    expect(Date.now()).toEqual(new Date("2020-01-01T00:00:00Z").getTime());
    jest.advanceTimersByTime(59999);
    expect(Date.now()).toEqual(new Date("2020-01-01T00:00:59.999Z").getTime());
  });

  it("should give the proper mocked values async", async () => {
    jest.setSystemTime(new Date("2020-01-01T01:00:00Z").getTime());

    expect(Date.now()).toEqual(new Date("2020-01-01T01:00:00Z").getTime());
    jest.advanceTimersByTime(59999);
    expect(Date.now()).toEqual(new Date("2020-01-01T01:00:59.999Z").getTime());
  });
  afterEach(() => {
    jest.useRealTimers();
  });
});
