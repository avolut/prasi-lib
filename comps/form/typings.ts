import { GFCol } from "@/gen/utils";
import { ReactNode } from "react";
import { editorFormData } from "./utils/ed-data";

export type FMProps = {
  on_init: (arg: { fm: FMLocal; submit: any; reload: any }) => any;
  on_load: (arg: { fm: FMLocal }) => any;
  on_submit: (arg: { fm: FMLocal; form: any; error: any }) => Promise<any>;
  body: any;
  PassProp: any;
  props: any;
  sonar: "on" | "off";
  layout: "auto" | "1-col" | "2-col";
  meta: any;
  item: any;
  label_mode: "vertical" | "horizontal" | "hidden";
  label_width: number;
  gen_fields: any;
  gen_table: string;
  on_load_deps?: any[];
};

export type GenField = {
  name: string,
  is_pk: boolean,
  type: string,
  optional: boolean,
} | {
  checked: GenField[],
  value: GFCol
};

type FieldType =
  | "-"
  | "relation"
  | "switch"
  | "input"
  | "single-option"
  | "multi-option";
export type FieldProp = {
  name: string;
  label: string;
  desc?: string;
  props?: any;
  fm: FMLocal;
  type: FieldType | (() => FieldType);
  required: ("y" | "n") | (() => "y" | "n");
  required_msg: (name: string) => string;
  on_change: (arg: { value: any }) => void | Promise<void>;
  PassProp: any;
  disabled: "y" | "n";
  child: any;
  selection: "single" | "multi";
  prefix: any;
  suffix: any;
  width: "auto" | "full" | "¾" | "½" | "⅓" | "¼";
  _item: PrasiItem;
  custom?: () => CustomField;
  on_load: () => any | Promise<any>;
  on_row: (row: any) => string;
  pk: string;
  sub_type: string;
  placeholder: string;
};

export type FMInternal = {
  status: "init" | "resizing" | "loading" | "saving" | "ready";
  data: any;
  reload: () => Promise<void>;
  submit: () => Promise<boolean>;
  events: {
    on_change: (name: string, new_value: any) => void;
  };
  fields: Record<string, FieldLocal>;
  field_def: Record<string, GFCol>;
  error: {
    readonly object: Record<string, string>;
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
    submit: {
      promises: Promise<boolean>[];
      timeout: ReturnType<typeof setTimeout>;
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

export type FieldInternal<T extends FieldProp["type"]> = {
  status: "init" | "loading" | "ready";
  name: FieldProp["name"];
  type: T | (() => T);
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
  custom: FieldProp["custom"];
  input: Record<string, any> & {
    render: () => void;
  };
  prop?: any;
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
    render: () => void;
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

export const fieldType = (item: PrasiItem, meta: any, fm: FMLocal) => {
  const m = meta[item.id];
  if (m && item.edit.props?.name.mode === "string") {
    const name = item.edit.props?.name.value || "";
    const field = fm.fields[name];
    const def = fm.field_def[name];
    return `
    const field = null as unknown as {
      status: "init" | "loading" | "ready";
      name: "${name}";
      type: "${field.type}";
      label: any;
      desc: any;
      prefix: any;
      suffix: any;
      width: any;
      required: boolean;
      focused: boolean;
      disabled: boolean;
      required_msg: any;
      col?: GFCol;
      Child: () => ReactNode;
      input: Record<string, any> & {
        render: () => void;
      };
      prop?: any;
    }
  `;
  }
};

export type CustomField =
  | { field: "text"; type: "text" | "password" | "number" }
  | { field: "relation"; type: "has-many" | "has-one" };

export const FieldTypeCustom = `type CustomField = 
  { field: "text", type: "text" | "password" | "number" | "date" | "datetime" }
| { field: "relation", type: "has-many" | "has-one" }
`;
