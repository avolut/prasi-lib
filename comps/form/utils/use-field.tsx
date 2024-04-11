import { useLocal } from "@/utils/use-local";
import { FMLocal, FieldInternal, FieldProp } from "../typings";
import { useEffect } from "react";

export const useField = (arg: FieldProp) => {
  const field = useLocal<FieldInternal>({
    status: "init",
    name: arg.name,
    label: arg.label,
    type: arg.type,
    desc: arg.desc,
    prefix: arg.prefix,
    suffix: arg.suffix,
    width: arg.width,
    required: arg.required === "y",
    required_msg: arg.required_msg,
    Child: () => {
      return <arg.PassProp>{arg.child}</arg.PassProp>;
    },
  });

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
