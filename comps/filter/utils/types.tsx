import { BaseFormLocal } from "../../form/base/types";
import { GenField } from "../../form/typings";

export type FilterFieldType =
  | "search-all"
  | "text"
  | "number"
  | "boolean"
  | "date"
  | "options";

export const default_filter_local = {
  data: {} as any,
  columns: [] as string[],
  fields: [] as GenField[],
  tableName: "",
  form: null as null | BaseFormLocal<any>,
  modifiers: {} as Record<string, string>,
  types: {} as Record<string, FilterFieldType>,
  name: "",
  mode: "",
  raw_status: "init" as "init" | "loading" | "ready",
};

export const modifiers = {
  "search-all": {
    contains: "Contains",
    starts_with: "Starts With",
    ends_with: "Ends With",
    equal: "Equal",
    not_equal: "Not Equal",
  },
  text: {
    contains: "Contains",
    starts_with: "Starts With",
    ends_with: "Ends With",
    equal: "Equal",
    not_equal: "Not Equal",
  },
  boolean: {
    is_true: "Is True",
    is_false: "Is False",
  },
  number: {
    equal: "Equal",
    not_equal: "Not Equal",
    between: "Between",
    greater_than: "Greater Than",
    less_than: "Less Than",
  },
  date: {
    between: "Between",
    greater_than: "Greater Than",
    less_than: "Less Than",
  },
  options: {
    equal: "Equal",
    not_equal: "Not Equal",
    includes: "Includes",
    excludes: "Excludes",
  },
};
export type FilterModifier = typeof modifiers;

export type FilterLocal = typeof default_filter_local & { render: () => void };

export const filter_window = window as unknown as {
  prasi_filter: Record<
    string,
    Record<
      string,
      {
        filter: { ref: Record<string, FilterLocal>; render: () => void };
        list: {
          ref: Record<string, { reload: () => void }>;
          reload: () => void;
          render: () => void;
        };
      }
    >
  >;
  prasiContext: {
    render: () => void;
  };
};
