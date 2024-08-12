import { useLocal } from "@/utils/use-local";
import { call_prasi_events } from "lib/exports";
import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { validate } from "../utils/validate";
import { FieldInput } from "./FieldInput";
import { Label } from "./Label";

export const Field: FC<FieldProp> = (arg) => {
  const showlabel = arg.show_label || "y";
  let sub_type: any = arg.sub_type; // tipe field

  const { fm } = arg;
  const field = useField(arg);
  const name = field.name;
  const local = useLocal({ prev_val: fm.data?.[name] });

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
      if (!fm.events) {
        fm.events = {
          on_change(name, new_value) {},
        };
      }

      fm.events.on_change(name, fm.data[name]);
      fm.render();

      call_prasi_events("field", "on_change", [fm, field]);
    }
  }, [fm.data[name]]);

  useEffect(() => {
    if (typeof arg.on_init === "function") {
      arg.on_init({ name, field });
    }
  }, [field]);
  if (field.status === "init" && !isEditor) return null;
  let errors = fm.error.get(name);
  if (field.error) {
    errors = [field.error];
  }
  const props = { ...arg.props };

  let editorClassName = "";
  if (isEditor) {
    editorClassName =
      props.className.split(" ").find((e: string) => e.startsWith("s-")) || "";
  }

  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  if (field.hidden) return <></>;

  return (
    <LabelDiv
      mode={sub_type === "table-edit" ? "div" : "label"}
      {...props}
      className={cx(
        "field",
        field.type,
        sub_type,
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
            border: 1px solid ${disabled ? "#ececeb" : "#cecece"};

            &.focused {
              border: 1px solid #1c4ed8;
              outline: 1px solid #1c4ed8;
            }
          }
        `
      )}
      ref={typeof arg.field_ref === "function" ? arg.field_ref : undefined}
    >
      {showlabel !== "n" && field.label && <Label field={field} fm={fm} />}
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
        {errors.length ? (
          <div
            className={cx(
              "field-error c-p-2 c-text-xs c-text-red-600",
              field.desc && "c-pt-0",
              css`
                padding-left: 0px !important;
              `
            )}
          >
            {errors.map((err) => {
              return <div>{err}</div>;
            })}
          </div>
        ) : (
          <></>
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
