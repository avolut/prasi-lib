import { FC, ReactNode } from "react";


export type BaseFieldWidth =
  | "auto"
  | "full"
  | "¾"
  | "½"
  | "⅓"
  | "¼"
  | "1/2"
  | "1/3"
  | "1/4"
  | "3/4";

export type BaseFieldType = "text" | "relation";
export type BaseFieldProps<T extends Record<string, any>> = {
  name: keyof T;
  label?: string;
  type?: BaseFieldType;
  props?: any;
  desc?: string;
  on_change?: (arg: { value: any }) => void | Promise<void>;

  prefix?: any;
  suffix?: any;

  required?: boolean;
  required_msg?: (name: string) => string;
  disabled?: boolean;

  width?: BaseFieldWidth;
};

export type BaseFieldInternal<T extends Record<string, any>> = {
  name: keyof T;
  label: ReactNode;
  type: BaseFieldType;
  desc: string;
  on_change: (arg: { value: any }) => void | Promise<void>;

  prefix: any;
  suffix: any;

  required: boolean;
  required_msg: (name: string) => string;
  disabled: boolean;

  width: BaseFieldWidth;
  status: "init" | "loading" | "ready";

  PassProp: any;
  child: any;
};

export type BaseFieldLocal<T extends Record<string, any>> =
  BaseFieldInternal<T>;
