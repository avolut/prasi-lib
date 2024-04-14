import { useLocal } from "@/utils/use-local";
import { useEffect } from "react";
import { FieldInternal, FieldProp } from "../typings";

export const useField = (arg: FieldProp) => {
  const field = useLocal<FieldInternal<typeof arg.type>>({
    status: "init",
    Child: () => {
      return <arg.PassProp>{arg.child}</arg.PassProp>;
    },
    input: {},
  } as any);

  const update_field = {
    name: arg.name,
    label: arg.label,
    type: arg.type,
    desc: arg.desc,
    prefix: arg.prefix,
    suffix: arg.suffix,
    width: arg.width,
    required: arg.required === "y",
    required_msg: arg.required_msg,
    disabled: arg.disabled === "y",
  };
  if (field.status === "init" || isEditor) {
    for (const [k, v] of Object.entries(update_field)) {
      (field as any)[k] = v;
    }
  }

  const fm = arg.fm;

  useEffect(() => {
    if (field.status === "init" || !fm.fields[arg.name]) {
      field.status = "ready";
      fm.fields[arg.name] = field;
      field.render();
    }
  }, []);

  return field;
};
