import { FC } from "react";
import { FieldProp } from "../typings";
import { createField } from "../utils/create-field";
import { Label } from "./Label";

export const Field: FC<FieldProp> = (arg) => {
  const field = createField(arg);

  if (field.status === "init") return null;

  const mode = field.label_mode;
  return (
    <div
      className={cx(
        "field",
        mode === "horizontal" && "",
        mode === "vertical" && ""
      )}
    >
      {mode !== "hidden" && <Label field={field} />}
    </div>
  );
};
