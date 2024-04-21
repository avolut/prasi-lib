import { FC, ReactNode } from "react";
import { BaseFieldProps } from "./field";

export type BaseFormProps<T extends Record<string, any>> = {
  onLoad: () => Promise<T | null>;
  onSubmit: (arg: { data: T | null }) => Promise<boolean>;
  children?: (arg: { Field: FC<BaseFieldProps<T>> }) => ReactNode;
};
