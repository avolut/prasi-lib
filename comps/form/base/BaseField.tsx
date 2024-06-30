import { ReactNode } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { Label } from "../field/Label";
import { FieldLoading } from "../../ui/field-loading";

export const BaseField = (prop: {
  field: FieldLocal;
  fm: FMLocal;
  arg: FieldProp;
  children: (arg: {
    field: FieldLocal;
    fm: FMLocal;
    arg: FieldProp;
  }) => ReactNode;
}) => {
  const { field, fm, arg } = prop;
  const w = field.width;
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
  return (
    <label
      className={cx(
        "field",
        name,
        "c-flex",
        css`
          padding: 5px 0px 0px 10px;
        `,
        w === "auto" && fm.size.field === "full" && "c-w-full",
        w === "auto" && fm.size.field === "half" && "c-w-1/2",
        w === "full" && "c-w-full",
        w === "¾" && "c-w-3/4",
        w === "½" && "c-w-1/2",
        w === "⅓" && "c-w-1/3",
        w === "¼" && "c-w-1/4",
        field.type === "link"
          ? "c-flex-row c-items-stretch c-min-h-[78px]"
          : "c-flex-col c-space-y-1",
        field.focused && "focused",
        field.disabled && "disabled",
        typeof fm.data[name] !== "undefined" &&
          fm.data[name] !== null &&
          fm.data[name] !== "" &&
          "filled"
      )}
    >
      {arg.show_label !== "n" && <Label field={field} fm={fm} />}
      <div className="field-input c-flex c-flex-1 c-flex-col">
        <div
          className={cx(
            !["toogle", "button", "radio", "checkbox"].includes(arg.sub_type)
              ? cx(
                  "field-outer c-overflow-hidden c-flex-1 c-flex c-flex-row c-text-sm c-bg-white",
                  field.type === "link"
                    ? " c-items-center"
                    : "c-border c-rounded "
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
              : field.focused &&
                "c-border-blue-700 c-outline c-outline-blue-700",
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
                field.type === "link" && "c-justify-end",
                field.focused && "focused",
                field.disabled && "c-pointer-events-none"
              )}
            >
              {prop.children(prop)}
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
      </div>
    </label>
  );
};
