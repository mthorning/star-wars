import { useRef, useEffect } from "react";

type UseUpdateEffectArgs = [cb: () => void, dependencies: any[]];
export function useUpdateEffect(...args: UseUpdateEffectArgs) {
  const [cb, dependencies] = args;
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
