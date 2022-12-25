import { act, renderHook } from "@testing-library/react-hooks";
import { useState } from "react";
import { useDateState } from "./useDateState";
test("useState as a sample", () => {
  const { result } = renderHook((props: [number]) => useState(...props), {
    initialProps: [0],
  });
  let [date, setDate] = result.current;
  expect(date).toStrictEqual(0);
  act(() => setDate(1));
  [date, setDate] = result.current;
  expect(date).toStrictEqual(1);
});
test("just initial set with Date", () => {
  const { result } = renderHook((props: [any]) => useDateState(...props), {
    initialProps: [new Date(0)],
  });
  expect(result.current[0]).toStrictEqual(new Date(0));
});
test("just initial set with number", () => {
  const { result } = renderHook((props: [number]) => useDateState(...props), {
    initialProps: [0],
  });
  expect(result.current[0]).toStrictEqual(new Date(0));
});
test("just initial set with function", () => {
  const { result } = renderHook((props: [any]) => useDateState(...props), {
    initialProps: [() => new Date(0)],
  });
  expect(result.current[0]).toStrictEqual(new Date(0));
});
test("update", () => {
  const { result } = renderHook((props: [number]) => useDateState(...props), {
    initialProps: [0],
  });
  let [date, setDate] = result.current;
  expect(date).toStrictEqual(new Date(0));

  act(() => setDate(1));
  [date, setDate] = result.current;
  expect(date).toStrictEqual(new Date(1));

  act(() => setDate(new Date(2)));
  [date, setDate] = result.current;
  expect(date).toStrictEqual(new Date(2));

  act(() => setDate(2));
  [date, setDate] = result.current;
  expect(date).toStrictEqual(new Date(2));
});
