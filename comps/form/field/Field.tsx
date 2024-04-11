import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { Label } from "./Label";

export const Field: FC<FieldProp> = (arg) => {
  const { fm } = arg;
  const field = useField(arg);

  const mode = fm.props.label_mode;
  const w = field.width;

  useEffect(() => {
    if (field.required && typeof field.required_msg === "function") {
      const error_msg = field.required_msg(field.name);
      const error_list = fm.error
        .get(field.name)
        .filter((e) => e !== error_msg);
      if (fm.data[field.name]) {
        fm.error.set(field.name, [error_msg, ...error_list]);
      } else {
        fm.error.set(field.name, error_list);
      }
    }

    fm.events.on_change(field.name, fm.data[field.name]);
  }, [fm.data[field.name]]);

  if (field.status === "init") return null;

  return (
    <label
      className={cx(
        "field",
        "c-flex",
        w === "auto" && fm.size.field === "full" && "c-w-full",
        w === "auto" && fm.size.field === "half" && "c-w-1/2",
        w === "full" && "c-w-full",
        w === "½" && "c-w-1/2",
        w === "⅓" && "c-w-1/3",
        w === "¼" && "c-w-1/4",
        mode === "horizontal" && "c-flex-row",
        mode === "vertical" && "c-flex-col"
      )}
    >
      {mode !== "hidden" && <Label field={field} fm={fm} />}
    </label>
  );
};
