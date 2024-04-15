import { FC, isValidElement } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { useLocal } from "@/utils/use-local";
import { FieldTypeText } from "./TypeText";

export const TypeCustom: FC<{ field: FieldLocal; fm: FMLocal }> = ({
  field,
  fm,
}) => {
  const local = useLocal({ custom: null as any }, async () => {
    if (field.custom) {
      local.custom = await field.custom();
      local.render();
    }
  });

  let el = null as any;
  if (local.custom) {
    if (isValidElement(local.custom)) {
      el = local.custom;
    } else {
      if (local.custom.field === "text") {
        el = <FieldTypeText field={field} fm={fm} prop={local.custom} />;
      }
    }
  }

  return <>{el}</>;
};
