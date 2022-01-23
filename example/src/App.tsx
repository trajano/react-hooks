import { useClock, useDeepState } from '@trajano/react-hooks';
export function App(): JSX.Element {
  useClock();
  useDeepState("foo");
  return <div>Hello world</div>
}
