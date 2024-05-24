import { FC, isValidElement } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { FieldLoading } from "./raw/FieldLoading";
import { MultiOption } from "./type/TypeMultiOption";
import { SingleOption } from "./type/TypeSingleOption";
import { FieldTypeText, PropTypeText } from "./type/TypeText";

const modify = {
  timeout: null as any,
};

export const FieldInput: FC<{
  field: FieldLocal;
  fm: FMLocal;
  PassProp: any;
  child: any;
  _item: PrasiItem;
  arg: FieldProp;
}> = ({ field, fm, arg }) => {
  // return <></>
  const prefix = typeof field.prefix === "function" ? field.prefix() : typeof field.prefix === "string" ? field.prefix : null;
  const suffix = typeof field.suffix === "function" ? field.suffix() : typeof field.suffix === "string" ? field.prefix : null;
  const name = field.name;
  const errors = fm.error.get(name);
  let type_field = typeof arg.type === 'function' ? arg.type() : arg.type; // tipe field

  return (
    <div
      className={cx(
        !["toogle", "button", "radio", "checkbox"].includes(arg.sub_type)
          ? "field-outer c-flex c-flex-1 c-flex-row c-rounded c-border c-text-sm c-flex-wrap"
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
              : field.focused && "c-border-blue-700 c-outline c-outline-blue-700",
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
            field.disabled && "c-pointer-events-none",
          )}
        >
          {[
            "date",
            "input"
          ].includes(type_field) ? (
            <FieldTypeText
              field={field}
              fm={fm}
              arg={arg}
              prop={{ type: type_field as any, sub_type: arg.sub_type, prefix, suffix } as PropTypeText}
            />
          ) : ["single-option"].includes(type_field) ? (
            <SingleOption arg={arg} field={field} fm={fm} />
          ) : ["multi-option"].includes(type_field) ? (
            <MultiOption arg={arg} field={field} fm={fm} />
          ) : (
            <>{isValidElement(type_field) && type_field}</>
          )}
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
  );
};
