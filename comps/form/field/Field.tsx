import { useLocal } from "@/utils/use-local";
import { call_prasi_events } from "lib/exports";
import { hashSum } from "lib/utils/hash-sum";
import { FC, useEffect } from "react";
import { FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { validate } from "../utils/validate";
import { FieldInput } from "./FieldInput";
import { Label } from "./Label";

const prepForSum = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((e) => prepForSum(e));
  }
  const new_obj: any = {};
  if (obj) {
    for (const [k, v] of Object.entries(obj) as any) {
      if (typeof v === "object" && v.id) {
        new_obj[k] = v.id;
        continue;
      }
      if (typeof v === "object" && v?.connect?.id) {
        new_obj[k] = v.connect.id;
        continue;
      }
      new_obj[k] = v;
    }
  }
  return new_obj;
};

export const Field: FC<FieldProp> = (arg) => {
  const showlabel = arg.show_label || "y";
  let sub_type: any = arg.sub_type; // tipe field

  const { fm } = arg;
  const field = useField(arg);
  const name = field.name;
  const local = useLocal({ prev_val: fm.data?.[name] });

  const w = field.width;

  useEffect(() => {
    if (fm.save_status === "init" || fm.status !== "ready") return;
    if (local.prev_val === undefined) {
      if (typeof fm.data[name] === "object" && fm.deps.md) {
        const sfied = hashSum(prepForSum(fm.data[name]));

        if (sfied !== local.prev_val) {
          local.prev_val = sfied;
        } else {
          return;
        }
      } else {
        local.prev_val = fm.data[name];
      }

      if (!fm.events) {
        fm.events = {
          on_change(name, new_value) {},
        };
      }

      fm.events.on_change(name, fm.data[name]);
      return;
    }

    if (local.prev_val !== fm.data[name]) {
      if (typeof fm.data[name] === "object") {
        const sfied = hashSum(prepForSum(fm.data[name]));

        if (sfied !== local.prev_val) {
          local.prev_val = sfied;
        } else {
          return;
        }
      } else {
        local.prev_val = fm.data[name];
      }

      if (
        (!local.prev_val && fm.data[name]) ||
        (local.prev_val && !fm.data[name])
      ) {
        validate(field, fm);
      }

      if (arg.on_change) {
        arg.on_change({ value: fm.data[name], name, fm });
      }

      if (fm.deps.md) {
        fm.save_status = "unsaved";
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
      mode={sub_type === "table-edit" ? "div" : field.label ? "label" : "div"}
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
          <div
            className={cx(
              "c-p-2 c-pl-0 c-text-xs",
              errors.length > 0 && "c-pb-1"
            )}
          >
            {field.desc}
          </div>
        )}
        {errors.length ? (
          <div
            className={cx(
              "field-error c-p-2 c-pl-0 c-text-xs c-text-red-600",
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
