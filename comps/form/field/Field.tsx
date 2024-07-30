import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { FieldInput } from "./FieldInput";
import { Label } from "./Label";
import { validate } from "../utils/validate";

export const Field: FC<FieldProp> = (arg) => {
  const showlabel = arg.show_label || "y";
  let sub_type: any = arg.sub_type; // tipe field

  const { fm } = arg;
  const field = useField(arg);
  const name = field.name;
  const local = useLocal({ prev_val: fm.data[name] });

  const w = field.width;

  useEffect(() => {
    if (local.prev_val !== fm.data[name]) {
      if (
        (!local.prev_val && fm.data[name]) ||
        (local.prev_val && !fm.data[name])
      ) {
        validate(field, fm);
      }

      if (arg.on_change) {
        arg.on_change({ value: fm.data[name], name, fm });
      }

      fm.events.on_change(name, fm.data[name]);
      fm.render();
    }
  }, [fm.data[name]]);

  if (field.status === "init" && !isEditor) return null;
  const errors = fm.error.get(name);
  const props = { ...arg.props };

  let editorClassName = "";
  if (isEditor) {
    editorClassName =
      props.className.split(" ").find((e: string) => e.startsWith("s-")) || "";
  }

  return (
    <LabelDiv
      mode={sub_type === "table-edit" ? "div" : "label"}
      {...props}
      className={cx(
        "field",
        "c-flex c-relative",
        editorClassName,
        field.type === "single-option" && sub_type === "checkbox"
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
        "c-flex-col c-space-y-1",
        css`
          .field-outer {
            border: 1px solid ${field.disabled ? "#ececeb" : "#cecece"};

            &.focused {
              border: 1px solid #1c4ed8;
              outline: 1px solid #1c4ed8;
            }
          }
        `
      )}
      ref={typeof arg.field_ref === "function" ? arg.field_ref : undefined}
    >
      {showlabel !== "n" && <Label field={field} fm={fm} />}
      <div className={cx("field-input c-flex c-flex-1 c-flex-col")}>
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
    </LabelDiv>
  );
};

const LabelDiv = (arg: any) => {
  const props = { ...arg };
  const mode = arg.mode;
  delete props.mode;

  if (mode === "label") {
    return <label {...props} />;
  }
  return <div {...props} />;
};
