import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { validate } from "../utils/validate";
import { FieldInput } from "./Input";
import { Label } from "./Label";

export const Field: FC<FieldProp> = (arg) => {
  const { fm } = arg;
  const field = useField(arg);

  const mode = fm.props.label_mode;
  const w = field.width;

  useEffect(() => {
    validate(field, fm);
    fm.events.on_change(field.name, fm.data[field.name]);
  }, [fm.data[field.name]]);

  if (field.status === "init" && !isEditor) return null;

  return (
    <label
      className={cx(
        "field",
        "c-flex",
        css`
          padding: 5px 0px 0px 10px;
        `,
        w === "auto" && fm.size.field === "full" && "c-w-full",
        w === "auto" && fm.size.field === "half" && "c-w-1/2",
        w === "full" && "c-w-full",
        w === "½" && "c-w-1/2",
        w === "⅓" && "c-w-1/3",
        w === "¼" && "c-w-1/4",
        mode === "horizontal" && "c-flex-row c-items-center",
        mode === "vertical" && "c-flex-col c-space-y-1"
      )}
    >
      {mode !== "hidden" && <Label field={field} fm={fm} />}
      <FieldInput field={field} fm={fm} />
    </label>
  );
};
