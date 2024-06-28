import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { FieldInput } from "./FieldInput";
import { Label } from "./Label";
import { validate } from "../utils/validate";

export const Field: FC<FieldProp> = (arg) => {
  const showlabel = arg.show_label || "y";

  let type: any = typeof arg.type === "function" ? arg.type() : arg.type; // tipe field
  let sub_type: any = arg.sub_type; // tipe field

  const { fm } = arg;
  const field = useField(arg);
  const name = field.name;
  const local = useLocal({ prev_val: fm.data[name] });

  const mode = fm.props.label_mode;
  const w = field.width;

  useEffect(() => {
    if (local.prev_val !== fm.data[name]) {
      if (
        (!local.prev_val && fm.data[name]) ||
        (local.prev_val && !fm.data[name])
      ) {
        validate(field, fm);
      }
      fm.events.on_change(name, fm.data[name]);
      fm.render();
    }
  }, [fm.data[name]]);
  if (field.status === "init" && !isEditor) return null;
  const errors = fm.error.get(name);
  const props = { ...arg.props };
  delete props.className;

  return (
    <label
      className={cx(
        "field",
        "c-flex",
        type === "single-option" && sub_type === "checkbox"
          ? css`
              padding: 5px 0px 0px 7.5px;
            `
          : css`
              padding: 5px 0px 0px 10px;
            `,
        w === "auto" && fm.size.field === "full" && "c-w-full",
        w === "auto" && fm.size.field === "half" && "c-w-1/2",
        w === "full" && "c-w-full",
        w === "¾" && "c-w-3/4",
        w === "½" && "c-w-1/2",
        w === "⅓" && "c-w-1/3",
        w === "¼" && "c-w-1/4",
        mode === "horizontal" && "c-flex-row c-items-center",
        mode === "vertical" && "c-flex-col c-space-y-1"
      )}
      {...props}
      ref={typeof arg.field_ref === "function" ? arg.field_ref : undefined}
    >
      {mode !== "hidden" && showlabel === "y" && (
        <Label field={field} fm={fm} />
      )}
      <div className="field-inner c-flex c-flex-1 c-flex-col">
        <FieldInput
          field={field}
          fm={fm}
          PassProp={arg.PassProp}
          child={arg.child}
          _item={arg._item}
          arg={arg}
        />
        {field.desc && (
          <div className={cx("c-p-2 c-text-xs", errors.length > 0 && "c-pb-1")}>
            {field.desc}
          </div>
        )}
        {errors.length > 0 && (
          <div
            className={cx(
              "field-error c-p-2 c-text-xs c-text-red-600",
              field.desc && "c-pt-0"
            )}
          >
            {errors.map((err) => {
              return <div>{err}</div>;
            })}
          </div>
        )}
      </div>
    </label>
  );
};
