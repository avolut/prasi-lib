import { SliderOptions } from "../form-old/Slider/types";
import { FieldOptions } from "../form-old/type";
import { FormHook } from "../form-old/utils/utils";

export type FMProps = {
  on_init: (arg: { fm: FMLocal; submit: any; reload: any }) => any;
  on_load: (arg: { fm: FMLocal }) => any;
  on_submit: (arg: { form: any; error: any }) => Promise<any>;
  body: any;
  form: FormHook;
  PassProp: any;
  props: any;
  sonar: "on" | "off";
  layout: "auto" | "1-col" | "2-col";
};

export type FieldProp = {
  name: string;
  label: string;
  desc?: string;
  fm: FMLocal;
  type:
    | "text"
    | "number"
    | "textarea"
    | "dropdown"
    | "relation"
    | "password"
    | "radio"
    | "date"
    | "datetime"
    | "money"
    | "slider"
    | "master-link"
    | "custom";
  required: "y" | "n";
  options: FieldOptions;
  on_change: (arg: { value: any }) => void | Promise<void>;
  PassProp: any;
  custom: "y" | "n";
  child: any;
  selection: "single" | "multi";
  suffix: any;
  placeholder?: any;
  rel_table: string;
  rel_fields: string[];
  rel_query: () => any;
};

export type FMInternal = {
  status: "init" | "loading" | "saving" | "ready";
  data: any;
  reload: () => Promise<void>;
  submit: () => Promise<void>;
  error: {
    list: { name: string; error: string }[];
    set: (name: string, error: string) => void;
    get: (name: string, error: string) => void;
    clear: () => void;
  };
  internal: {
    reload: {
      timeout: ReturnType<typeof setTimeout>;
      promises: Promise<void>[];
      done: any[];
    };
  };
  props: Exclude<FMProps, "body" | "PassProp">;
};
export type FMLocal = FMInternal & { render: () => void };

export const formType = (active: { item_id: string }) => {
  console.log("auoaou", typeof active);
  return `{
    status: "init" | "loading" | "saving" | "ready";
    data: any;
    reload: () => Promise<void>;
    submit: () => Promise<void>;
    error: {
      list: { name: string; error: string }[];
      set: (name: string, error: string) => void;
      get: (name: string, error: string) => void;
      clear: () => void;
    };
    internal: {
      reload: {
        timeout: ReturnType<typeof setTimeout>;
        promises: Promise<void>[];
        done: any[];
      };
    };
    props: any;
  }`;
};
