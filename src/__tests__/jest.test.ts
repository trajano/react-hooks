import noop from "lodash/noop";
describe("ensure jest works", () => {
  it("should work", () => {
    noop();
    expect(true).toBe(true);
  });
});
