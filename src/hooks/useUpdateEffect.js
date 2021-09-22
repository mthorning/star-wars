import { useRef, useEffect } from "react";

export function useUpdateEffect(cb, dependencies) {
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
    } else {
      return cb();
    }

    // This is a wrapper around useEffect so we can ignore
    // the linter here.

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}
