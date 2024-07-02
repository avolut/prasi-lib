import { useLocal } from "@/utils/use-local";
import { useEffect, useRef } from "react";
import { FieldInternal, FieldProp } from "../typings";

export const useField = (
  arg: Omit<FieldProp, "name" | "label"> & {
    name: string | (() => string);
    label: string | (() => string);
  }
) => {
  const field = useLocal<FieldInternal<typeof arg.type>>({
    status: "init",
    Child: () => {
      return <arg.PassProp>{arg.child}</arg.PassProp>;
    },
    input: {},
    ref: null as any,
  } as any);
  const ref = useRef(null as any)
  field.ref = ref;
  
  const name = typeof arg.name === "string" ? arg.name : arg.name();
  const label = typeof arg.label === "string" ? arg.label : arg.label();
  const required =
    typeof arg.required === "string" ? arg.required : arg.required();
  const update_field = {
    name: name.replace(/\s*/gi, ""),
    label: label,
    type: arg.type,
    desc: arg.desc,
    prefix: arg.prefix,
    suffix: arg.suffix,
    width: arg.width,
    custom: arg.custom,
    required: required === "y",
    required_msg: arg.required_msg,
    disabled: typeof arg.disabled === "function" ? arg.disabled : arg.disabled === "y",
    on_change: arg.on_change,
  };

  if (field.status === "init" || isEditor) {
    for (const [k, v] of Object.entries(update_field)) {
      (field as any)[k] = v;
    }
  }

  const fm = arg.fm;

  useEffect(() => {
    if (field.status === "init" || !fm.fields[name]) {
      field.status = "ready";
      fm.fields[name] = field;
      field.render();
    }
  }, []);

  return field;
};
