import { ReactNode } from "react";
import { SliderOptions } from "../form-old/Slider/types";
import { FieldOptions } from "../form-old/type";
import { FormHook } from "../form-old/utils/utils";
import { editorFormData } from "./utils/ed-data";

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
};

export type FieldProp = {
  name: string;
  label: string;
  desc?: string;
  label_mode: "vertical" | "horizontal" | "hidden";
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
  prefix: any;
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
  fields: Record<string, FieldLocal>;
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

export type FieldInternal = {
  status: "init" | "loading" | "ready";
  name: FieldProp["name"];
  type: FieldProp["type"];
  label: FieldProp["label"];
  desc: FieldProp["desc"];
  prefix: FieldProp["prefix"];
  suffix: FieldProp["suffix"];
  label_mode: FieldProp["label_mode"];
  Child: () => ReactNode;
};
export type FieldLocal = FieldInternal & { render: () => void };

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
  }`;
};
