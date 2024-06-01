import { BaseFormLocal } from "../../form/base/types";
import { GenField } from "../../form/typings";

export type FilterFieldType = "text" | "number" | "boolean" | "date";
export const default_filter_local = {
  data: {} as any,
  columns: [] as string[],
  fields: [] as GenField[],
  tableName: "",
  form: null as null | BaseFormLocal<any>,
  modifiers: {} as Record<string, string>,
  types: {} as Record<string, FilterFieldType>,
  name: "",
};

export const modifiers = {
  text: { contains: "Contains", ends_with: "Ends With", equal: "Equal", not_equal: "Not Equal" },
  boolean: {
    is_true: "Is True",
    is_false: "Is False"
  },
  number: {
    equal: "Equal",
    not_equal: "Not Equal",
    between: "Between",
    greater_than: "Greater Than",
    less_than: "Less Than"
  },
  date: {
    between: "Between",
    greater_than: "Greater Than",
    less_than: "Less Than"
  },
};
export type FilterModifier = typeof modifiers;

export type FilterLocal = typeof default_filter_local & { render: () => void };

export const filter_window = window as unknown as {
  prasi_filter: Record<string, Record<string, Record<string, FilterLocal>>>;
  prasiContext: {
    render: () => void;
  };
};
