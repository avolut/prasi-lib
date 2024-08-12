import get from "lodash.get";
import { FC, isValidElement } from "react";
import { FieldLoading } from "../../ui/field-loading";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { TableEdit } from "./table-edit/TableEdit";
import { FieldTypeInput, PropTypeInput } from "./type/TypeInput";
import { FieldLink } from "./type/TypeLink";
import { MultiOption } from "./type/TypeMultiOption";
import { SingleOption } from "./type/TypeSingleOption";

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

  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
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

  // console.log(prefix, suffix);

  return (
    <div
      className={cx(
        !["toggle", "button", "radio", "checkbox"].includes(arg.sub_type)
          ? cx(
              "field-outer c-overflow-hidden c-flex-1 c-flex c-flex-row c-text-sm c-bg-white",
              "c-rounded "
            )
          : "",
        fm.status === "loading"
          ? css`
              border-color: transparent;
            `
          : disabled
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
      {fm.status === "loading" ? (
        <FieldLoading />
      ) : (
        <>
          {prefix && prefix !== "" ? (
            <div
              className={cx(
                "c-px-2 c-flex c-flex-row c-items-center",
                css`
                  color: gray;
                `
              )}
            >
              {prefix}
            </div>
          ) : (
            <></>
          )}
          <div
            className={cx(
              "field-inner c-flex-1 c-flex c-items-center",
              field.focused && "focused",
              disabled && "c-pointer-events-none",
              disabled &&
                !["checkbox"].includes(arg.sub_type) &&
                " c-bg-gray-50"
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
                    {type_field === "link" && (
                      <FieldLink field={field} fm={fm} arg={arg} />
                    )}
                    {["date", "input"].includes(type_field) ? (
                      <FieldTypeInput
                        field={field}
                        fm={fm}
                        arg={arg}
                        prop={
                          {
                            type: type_field as any,
                            sub_type: arg.sub_type,
                            model_upload: arg.model_upload,
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
          {suffix && suffix !== "" ? (
            <div
              className={cx(
                "c-px-2 c-flex c-flex-row c-items-center",
                css`
                  color: gray;
                `
              )}
            >
              {suffix}
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </div>
  );
};
