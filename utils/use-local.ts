import { useEffect, useRef, useState } from "react";

export const useLocal = <T extends object>(
  data: T,
  effect?: (arg: {
    init: boolean;
  }) => Promise<void | (() => void)> | void | (() => void),
  deps?: any[]
): {
  [K in keyof T]: T[K] extends Promise<any> ? null | Awaited<T[K]> : T[K];
} & { render: (force?: boolean) => void } => {
  const [, _render] = useState({});
  const _ = useRef({
    data: data as unknown as T & {
      render: (force?: boolean) => void;
    },
    deps: (deps || []) as any[],
    ready: false,
  });
  const local = _.current;

  useEffect(() => {
    local.ready = true;
    if (effect) effect({ init: true });
  }, []);

  if (local.ready === false) {
    local.data.render = (force) => {
      if (force) _render({});
      else if (local.ready) _render({});
    };
  } else {
    if (local.deps.length > 0 && deps) {
      for (const [k, dep] of Object.entries(deps) as any) {
        if (local.deps[k] !== dep) {
          local.deps[k] = dep;

          if (effect) {
            setTimeout(() => {
              effect({ init: false });
            });
          }
          break;
        }
      }
    }
  }

  return local.data as any;
};
