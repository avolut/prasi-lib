import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { validate } from "../utils/validate";
import { FieldInput } from "./FieldInput";
import { Label } from "./Label";

export const Field: FC<FieldProp> = (arg) => {
  const { fm } = arg;
  const field = useField(arg);

  const mode = fm.props.label_mode;
  const w = field.width;

  useEffect(() => {
    validate(field, fm);
    fm.events.on_change(field.name, fm.data[field.name]);
    fm.render();
  }, [fm.data[field.name]]);

  if (field.status === "init" && !isEditor) return null;

  const errors = fm.error.get(field.name);

  const props = { ...arg.props };
  delete props.className;

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
      {...props}
    >
      {mode !== "hidden" && <Label field={field} fm={fm} />}
      <div className="field-inner c-flex c-flex-1 c-flex-col">
        <FieldInput
          field={field}
          fm={fm}
          PassProp={arg.PassProp}
          child={arg.child}
          _meta={arg._meta}
          _item={arg._item}
        />
        {field.desc && (
          <div className={cx("c-p-2 c-text-xs", errors.length > 0 && "c-pb-1")}>
            {field.desc}
          </div>
        )}
        {errors.length > 0 && (
          <div
            className={cx(
              "c-p-2 c-text-xs c-text-red-600",
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
