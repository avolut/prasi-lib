import { useLocal } from "@/utils/use-local";
import { FMLocal, FieldInternal, FieldProp } from "../typings";
import { useEffect } from "react";

export const useField = (arg: FieldProp) => {
  const field = useLocal<FieldInternal>({
    status: "init",
    Child: () => {
      return <arg.PassProp>{arg.child}</arg.PassProp>;
    },
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
    focused: false,
    disabled: arg.disabled === "y",
  };
  for (const [k, v] of Object.entries(update_field)) {
    (field as any)[k] = v;
  }

  const fm = arg.fm;

  useEffect(() => {
    if (field.status === "init") {
      field.status = "ready";
      fm.fields[arg.name] = field;
      field.render();
    }
  }, []);

  return field;
};
