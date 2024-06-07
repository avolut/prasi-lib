import { FC, isValidElement } from "react";
import { FMLocal, FieldLocal } from "../../typings";
import { useLocal } from "@/utils/use-local";
import { FieldTypeInput } from "./TypeInput";

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

  if (!local.exec) {
    local.exec = true;
    const callback = (value: any, should_render: boolean) => {
      local.result = value;
      if (should_render) {
        local.render();
        setTimeout(() => {
          local.exec = false;
        }, 100);
      }
    };
    if (field.custom) {
      const res = local.custom();
      if (res instanceof Promise) {
        res.then((value) => {
          callback(value, true);
        });
      } else {
        callback(res, false);
      }
    }
  }

  let el = null as any;
  if (local.result) {
    if (isValidElement(local.result)) {
      el = local.result;
    }
  }

  return <>{el}</>;
};
