import { useClock, useDeepState } from '@trajano/react-hooks';
import { useState } from 'react';
export function App(): JSX.Element {
  const { useSubscribeEffect } = useClock();
  const [date, setDate] = useState<number>(Date.now());
  useSubscribeEffect(setDate)

  useDeepState("foo");
  return <div>Hello world {date}</div>
}
