"use client";

import { useCallback, useSyncExternalStore } from "react";

function getServerSnapshot() {
  return false;
}

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener("change", callback);
      window.addEventListener("resize", callback);
      return () => {
        mediaQueryList.removeEventListener("change", callback);
        window.removeEventListener("resize", callback);
      };
    },
    [query],
  );

  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
