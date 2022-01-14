import React, { useCallback, useEffect, useRef } from "react";
export function useMounted(): () => boolean {
  const mountedRef = useRef(false);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);
  return useCallback(() => mountedRef.current, [mountedRef]);
}
