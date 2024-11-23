import { FieldLoading } from "lib/comps/ui/field-loading";
import { Label } from "../field/Label";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { useField } from "../utils/use-field";
import { ReactNode } from "react";

export const BaseField = (
  arg: FieldProp & {
    children?: (arg: { fm: FMLocal; field: FieldLocal }) => ReactNode;
  }
) => {
  const field = useField(arg);
  const fm = arg.fm;
  arg.fm.fields[arg.name] = field;

  const w = field.width || "auto";
  const prefix =
    typeof field.prefix === "function"
      ? field.prefix()
      : typeof field.prefix === "string"
        ? field.prefix
        : null;
  const suffix =
    typeof field.suffix === "function"
      ? field.suffix()
      : typeof field.suffix === "string"
        ? field.prefix
        : null;
  const name = field.name;
  const errors = fm.error.get(name);
  const showlabel = arg.show_label || "y";
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  const show =
    typeof field.hidden === "function"
      ? field.hidden()
      : typeof field.hidden === "string"
        ? field.hidden === "n"
          ? false
          : true
        : typeof field.hidden === "boolean"
          ? field.hidden
          : true;

  return (
    <label
      className={cx(
        "field",
        name,
        "c-flex",
        css`
          padding: 5px 0px 0px 10px;
        `,
        w === "auto" && fm.size?.field === "full" && "c-w-full",
        w === "auto" && fm.size?.field === "half" && "c-w-1/2",
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
        `,
        field.focused && "focused",
        field.disabled && "disabled",
        typeof fm.data[name] !== "undefined" &&
          fm.data[name] !== null &&
          fm.data[name] !== "" &&
          "filled"
      )}
    >
      {arg.show_label !== "n" && <Label field={field} fm={fm} arg={arg} />}
      <div
        className={cx(
          "field-input c-flex c-flex-1 c-flex-col",
          errors.length > 0 &&
            css`
              .field-outer {
                border-color: red !important;
                background: #fff0f0;
              }
            `
        )}
      >
        <div
          className={cx(
            !["toggle", "button", "radio", "checkbox"].includes(
              arg.sub_type || ""
            )
              ? cx(
                  "field-outer c-overflow-hidden c-flex-1 c-flex c-flex-row c-text-sm c-bg-white",
                  "c-rounded "
                )
              : "",
            fm.status === "loading"
              ? css`
                  border-color: transparent;
                `
              : field.disabled
                ? "c-border-gray-100"
                : errors.length > 0
                  ? field.focused
                    ? "c-border-red-600 c-bg-red-50 c-outline c-outline-red-700"
                    : "c-border-red-600 c-bg-red-50"
                  : field.focused && "focused",
            css`
              & > .field-inner {
                min-height: 35px;
              }
            `
          )}
        >
          {prefix && prefix !== "" ? (
            <div
              className="
      c-px-2 c-bg-gray-200 c-flex c-flex-row c-items-center"
            >
              {prefix}
            </div>
          ) : (
            <></>
          )}
          {fm.status === "loading" ? (
            <FieldLoading />
          ) : (
            <div
              className={cx(
                "field-inner c-flex-1 c-flex c-items-center",
                field.focused && "focused",
                field.disabled && "c-pointer-events-none"
              )}
            >
              {typeof arg.children === "function" &&
                arg.children({ fm, field })}
            </div>
          )}
          {suffix && suffix !== "" ? (
            <div
              className="
      c-px-2 c-bg-gray-200 c-flex c-flex-row c-items-center"
            >
              {suffix}
            </div>
          ) : (
            <></>
          )}
        </div>
        {errors.length > 0 && (
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
        )}
      </div>
    </label>
  );
};
