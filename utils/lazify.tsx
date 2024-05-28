import { FC, lazy } from "react";

export const lazify = <T extends FC<any>>(
  fn: () => Promise<T>,
  note?: string
): T => {
  return lazy(async () => {
    const result = await fn();
    return {
      default: result,
    };
  }) as any;
};
