import get from "lodash.get";
import { FC, isValidElement } from "react";
import { FieldLoading } from "../../ui/field-loading";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { TableEdit } from "./table-edit/TableEdit";
import { FieldTypeInput, PropTypeInput } from "./type/TypeInput";
import { MultiOption } from "./type/TypeMultiOption";
import { SingleOption } from "./type/TypeSingleOption";

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
}> = ({ field, fm, arg, _item, PassProp, child }) => {
  // return <></>
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
  let type_field: any = typeof arg.type === "function" ? arg.type() : arg.type; // tipe field

  let custom = <></>;
  if (field.type === "custom") {
    let res = arg.custom?.() || <></>;
    if (isValidElement(res)) custom = res;
    else {
      let f = res as any;
      if (typeof f.type === "string") {
        type_field = f.type as any;
        arg.sub_type = f.sub_type as any;
      }
    }
  }

  let table_edit = null;
  if (type_field === "multi-option" && arg.sub_type === "table-edit") {
    const childsTableEdit = get(
      _item,
      "edit.props.child.value.childs"
    ) as unknown as Array<PrasiItem>;
    const tableEdit = {
      child: get(_item, "edit.props.child.value") as PrasiItem,
      bottom: childsTableEdit.find((e) => e.name === "bottom") as PrasiItem,
    };
    table_edit = (
      <TableEdit
        on_init={() => {
          return fm;
        }}
        show_header={arg.tbl_show_header}
        name={arg.name}
        child={child}
        PassProp={PassProp}
        item={_item}
        bottom={tableEdit.bottom}
        body={tableEdit.child}
      />
    );
  }

  let not_ready: any = false;
  if (
    arg.type === "multi-option" &&
    arg.sub_type === "table-edit" &&
    (!arg.gen_fields?.length || arg.gen_fields?.length === 1)
  ) {
    not_ready = (
      <>
        <div className="c-m-1 c-p-2 c-border c-border-red-500">
          ⚠️ Field: {arg.label} is not ready
          <br />
          <div
            className={css`
              font-size: 12px;
              font-weight: normal;
              white-space: pre;
            `}
          >
            Please select fields in relation and click generate.
          </div>
        </div>
      </>
    );
  }

  return (
    <div
      className={cx(
        !["toogle", "button", "radio", "checkbox"].includes(arg.sub_type)
          ? "field-outer c-overflow-hidden c-flex c-flex-1 c-flex-row c-rounded c-border c-text-sm c-bg-white"
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
            field.focused && "focused",
            field.disabled && "c-pointer-events-none"
          )}
        >
          {not_ready ? (
            not_ready
          ) : (
            <>
              {type_field === "custom" && arg.custom ? (
                <>{custom}</>
              ) : (
                <>
                  {["date", "input"].includes(type_field) ? (
                    <FieldTypeInput
                      field={field}
                      fm={fm}
                      arg={arg}
                      prop={
                        {
                          type: type_field as any,
                          sub_type: arg.sub_type,
                        } as PropTypeInput
                      }
                    />
                  ) : ["single-option"].includes(type_field) ? (
                    <SingleOption arg={arg} field={field} fm={fm} />
                  ) : ["multi-option"].includes(type_field) ? (
                    arg.sub_type === "table-edit" ? (
                      table_edit
                    ) : (
                      <MultiOption arg={arg} field={field} fm={fm} />
                    )
                  ) : (
                    <>{isValidElement(type_field) && type_field}</>
                  )}
                </>
              )}
            </>
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
