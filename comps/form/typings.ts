import { GFCol } from "@/gen/utils";
import { FC, MutableRefObject, ReactElement, ReactNode } from "react";
import { editorFormData } from "./utils/ed-data";
import { MDLocal } from "../md/utils/typings";

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
  back_on_save: "y" | "n";
  label_width: number;
  gen_fields: any;
  gen_table: string;
  deps?: any;
  feature?: any[];
  sfd_field?: any;
  render_parent?: () => void;
};

export type GenField =
  | {
      name: string;
      is_pk: boolean;
      type: string;
      optional: boolean;
    }
  | {
      checked: GenField[];
      value: GFCol;
    };

type FieldType =
  | "-"
  | "date"
  | "link"
  | "input"
  | "single-option"
  | "multi-option";
export type FieldProp = {
  name: string;
  label: string;
  desc?: string;
  props?: any;
  upload?: { mode: "single-file" | "multi-file" };
  link: {
    text:
      | string
      | ((arg: {
          field: FieldLocal;
          Link: FC<{ children: any }>;
        }) => Promise<string> | string);
    url: string;
    params: (field: FieldLocal) => { where: any } | Promise<{ where: any }>;
  };
  fm: FMLocal;
  type: FieldType | (() => FieldType);
  required: ("y" | "n") | (() => "y" | "n");
  field_ref?: (ref: any) => void;
  required_msg: (name: string) => string | ReactElement;
  on_change: (arg: {
    value: any;
    name: string;
    fm: any;
  }) => void | Promise<void>;
  PassProp: any;
  disabled: ("y" | "n") | (() => true | false);
  child: any;
  selection: "single" | "multi";
  prefix: any;
  suffix: any;
  width: "auto" | "full" | "¾" | "½" | "⅓" | "¼";
  _item: PrasiItem;
  __props: any;
  custom?: () => CustomField;
  on_load: (
    arg?: any
  ) =>
    | { value: string; label: string }[]
    | Promise<{ value: string; label: string }[]>;
  opt_get_label: (
    row: any,
    mode: "list" | "label",
    opt?: { next?: any; prev?: any }
  ) => string;
  opt_get_value: (arg: {
    options: { label: string; value: string; item?: string }[];
    fm: FMLocal;
    name: string;
    type: string;
  }) => any;
  tbl_show_header?: "y" | "n";
  opt_set_value: (arg: {
    selected: string[];
    options: { label: string; value: string; item?: string }[];
    fm: FMLocal;
    name: string;
    type: string;
  }) => any;
  opt_selected: (arg: {
    item: { value: string; label: string; item?: any };
    current: any;
    options: { value: string; label: string; item?: any }[];
  }) => boolean;
  on_init: (arg: { field: any; name: string }) => void;
  pk: string;
  sub_type: string;
  placeholder: string;
  show_label: boolean | "y" | "n";
  msg_error: string;
  gen_table?: string;
  gen_fields?: string;
  model_upload?: "upload" | "import";
  max_date?: any;
  min_date?: any;
  upload_style?: "inline" | "full";
};

export type FMInternal = {
  status: "init" | "resizing" | "loading" | "saving" | "ready";
  data: any;
  deps: any;
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
    set: (name: string, error: (string | ReactElement)[]) => void;
    get: (name: string) => string[];
    clear: (name?: string) => void;
  };
  internal: {
    original_render?: () => void;
  };
  props: Exclude<FMProps, "body" | "PassProp">;
  size: {
    width: number;
    height: number;
    field: "full" | "half";
  };
  soft_delete: {
    field: any;
  };
  has_fields_container: boolean;
  is_newly_created: boolean;
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
  hidden: boolean;
  disabled: boolean | (() => boolean);
  required_msg: FieldProp["required_msg"];
  col?: GFCol;
  ref?: any;
  Child: () => ReactNode;
  custom: FieldProp["custom"];
  input: Record<string, any> & {
    render: () => void;
  };
  options: {
    on_load?: () => Promise<{ value: string; label: string }[]>;
  };
  reload_options: () => Promise<void>;
  on_change?: (arg: {
    value: any;
    name: string;
    fm: FMLocal;
  }) => void | Promise<void>;
  prop?: FieldProp;
  max_date?: FieldProp["max_date"];
  min_date?: FieldProp["min_date"];
  error?: any;
  table_fields?: any[];
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
    deps: any;
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
