import { GFCol } from "@/gen/utils";
import { ReactNode } from "react";
import { FieldOptions } from "../form-old/type";
import { FormHook } from "../form-old/utils/utils";
import { editorFormData } from "./utils/ed-data";
import { PropTypeText } from "./field/type/TypeText";
import { PropTypeRelation } from "./field/type/TypeRelation";

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
  meta: any;
  item: any;
  label_mode: "vertical" | "horizontal" | "hidden";
  label_width: number;
  gen_fields: any;
};

export type FieldProp = {
  name: string;
  label: string;
  desc?: string;
  props?: any;
  fm: FMLocal;
  type: "text" | "relation";
  // | "number"
  // | "textarea"
  // | "dropdown"
  // | "password"
  // | "radio"
  // | "date"
  // | "datetime"
  // | "money"
  // | "slider"
  // | "master-link"
  // | "custom";
  required: "y" | "n";
  required_msg: (name: string) => string;
  options: FieldOptions;
  on_change: (arg: { value: any }) => void | Promise<void>;
  PassProp: any;
  disabled: "y" | "n";
  child: any;
  selection: "single" | "multi";
  prefix: any;
  suffix: any;
  width: "auto" | "full" | "¾" | "½" | "⅓" | "¼";
  _meta: any;
  _item: any;
  _sync: any;
};

export type FMInternal = {
  status: "init" | "resizing" | "loading" | "saving" | "ready";
  data: any;
  reload: () => Promise<void>;
  submit: () => Promise<void>;
  events: {
    on_change: (name: string, new_value: any) => void;
  };
  fields: Record<string, FieldLocal>;
  field_def: Record<string, GFCol>;
  error: {
    readonly list: { name: string; error: string[] }[];
    set: (name: string, error: string[]) => void;
    get: (name: string) => string[];
    clear: (name?: string) => void;
  };
  internal: {
    reload: {
      timeout: ReturnType<typeof setTimeout>;
      promises: Promise<void>[];
      done: any[];
    };
  };
  props: Exclude<FMProps, "body" | "PassProp">;
  size: {
    width: number;
    height: number;
    field: "full" | "half";
  };
};
export type FMLocal = FMInternal & { render: () => void };

type FieldInternalProp = {
  text: PropTypeText;
  number: PropTypeText;
  relation: PropTypeRelation;
};

export type FieldInternal<T extends FieldProp["type"]> = {
  status: "init" | "loading" | "ready";
  name: FieldProp["name"];
  type: T;
  label: FieldProp["label"];
  desc: FieldProp["desc"];
  prefix: FieldProp["prefix"];
  suffix: FieldProp["suffix"];
  width: FieldProp["width"];
  required: boolean;
  focused: boolean;
  disabled: boolean;
  required_msg: FieldProp["required_msg"];
  col?: GFCol;
  Child: () => ReactNode;
  input: Record<string, any> & {
    render: () => void;
  };
  prop?: FieldInternalProp[T];
};
export type FieldLocal = FieldInternal<any> & {
  render: () => void;
};

export const formType = (active: { item_id: string }, meta: any) => {
  let data = "null as any";

  const cache = editorFormData[active.item_id];
  if (cache && cache.data) {
    data = JSON.stringify(cache.data);
  } else {
    const m = meta[active.item_id];
    if (m && m.parent && m.parent.id) {
      const cache = editorFormData[m.parent.id];
      if (cache && cache.data) {
        data = JSON.stringify(cache.data);
      }
    }
  }

  return `
  const ___data = ${data};
  const fm = null as unknown as {
    status: "init" | "loading" | "saving" | "ready";
    data: typeof ___data;
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
  size: {
      width: number;
      height: number;
      field: "full" | "half";
    };
  }`;
};
