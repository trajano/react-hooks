import { useClock, useDeepState } from '@trajano/react-hooks';
import React from "react";

export function App(): JSX.Element {
  const { useSubscribeEffect } = useClock();
  const [date, setDate] = useDeepState<number>(Date.now());
  useSubscribeEffect(setDate)

  return <div>Hello world {date}</div>
}
