import { FC, lazy } from "react";

export const lazify = <T extends FC<any>>(fn: () => Promise<T>): T => {
  return lazy(async () => {
    const result = await fn();
    return {
      default: result,
    };
  }) as any;
};

// export const lazify = <
//   MAPS extends {
//     [NAME in string]: () => Promise<FC<any>>;
//   }
// >(
//   maps: MAPS
// ) => {
//   type KEYS = keyof MAPS;
//   const result: any = {};
//   for (const [k, v] of Object.entries(maps)) {
//     result[k] = single_lazy(v);
//   }

//   return result as { [K in KEYS]: Awaited<ReturnType<MAPS[K]>> };
// };
