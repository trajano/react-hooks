import { renderHook } from "@testing-library/react";

import { useRenderCount } from "./useRenderCount";
describe("useRenderCount", () => {
  it("should start at 1", () => {
    const { result } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
  });
  it("should increment every rerender", () => {
    const { result, rerender } = renderHook(() => useRenderCount());
    expect(result.current).toBe(1);
    rerender();
    expect(result.current).toBe(2);
    rerender();
    expect(result.current).toBe(3);
    rerender();
    expect(result.current).toBe(4);
  });
});
