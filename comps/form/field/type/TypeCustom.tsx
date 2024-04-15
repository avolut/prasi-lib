import { FC, isValidElement } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { useLocal } from "@/utils/use-local";
import { FieldTypeText } from "./TypeText";

export const TypeCustom: FC<{ field: FieldLocal; fm: FMLocal }> = ({
  field,
  fm,
}) => {
  const local = useLocal({
    custom: null as any,
    exec: false,
    result: null as any,
  });

  if (!local.custom && field.custom) {
    local.custom = field.custom;
  }

  if (field.custom) {
    const res = local.custom();
    if (res instanceof Promise) {
      console.error("Custom Function cannot be async");
      return null;
    } else {
      local.result = res;
    }
  }

  let el = null as any;
  if (local.result) {
    if (isValidElement(local.result)) {
      el = local.result;
    } else {
      if (local.result.field === "text") {
        el = <FieldTypeText field={field} fm={fm} prop={local.result} />;
      }
    }
  }

  return <>{el}</>;
};
