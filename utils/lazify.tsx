import { FC, ReactNode, Suspense, lazy } from "react";

export const lazify = <T extends FC<any>>(fn: () => Promise<T>): T => {
  return lazy(async () => {
    const result = await fn();
    return {
      default: result,
    };
  }) as any;
};

export const lazifyMany = <T extends Record<string, FC<any>>>(fns: {
  [K in keyof T]: () => Promise<T[K]>;
}) => {
  const cached = {} as any;
  const result = {} as any;
  for (const [k, v] of Object.entries(fns)) {
    const fn = v as any;
    result[k] = lazy(async () => {
      if (cached[k]) return { default: cached[k] };

      const result = await fn();
      cached[k] = result;

      for (const [i, j] of Object.entries(fns)) {
        if (!cached[i]) {
          cached[i] = await (j as any)();
        }
      }

      return {
        default: result,
      };
    }) as any;
  }

  return result as T;
};
