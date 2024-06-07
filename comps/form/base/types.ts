import { ReactNode } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";

export const default_base_form_local = {
  status: "init" as "init" | "submitting" | "ready",
  data: {} as any,
  internal: {
    width: 0,
  },
  fm: null as null | FMLocal,
  fields: {} as Record<string, any>,
};

type CreateFieldArg = {
  name: string;
  label?: string;
  prefix?: ReactNode | (() => ReactNode);
  onChange?: (value: any) => void;
  render?: () => void;
  onLoad?: () => { value: string; label: string }[];
  subType?: string;
};

export type BaseFormLocal<T> = Omit<typeof default_base_form_local, "data"> & {
  data: T;
  createArg: (arg: CreateFieldArg) => FieldProp;
  createField: (arg: CreateFieldArg) => FieldLocal;
  createFm: () => FMLocal;
  fieldProps: (arg: CreateFieldArg) => {
    fm: FMLocal;
    field: FieldLocal;
    arg: FieldProp;
  };
  submit: () => Promise<any> | any;
  render: () => void;
};
