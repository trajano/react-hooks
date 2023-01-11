import { useRef } from "react";

export function useRenderCount(): number {
  const renderCountRef = useRef(0);
  renderCountRef.current = renderCountRef.current + 1;
  return renderCountRef.current;
}
