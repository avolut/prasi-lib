import { createItem } from "@/gen/utils";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { genFieldMitem, updateFieldMItem } from "../utils/gen-mitem";
import { fieldMapping } from "./mapping";
import { FieldLoading } from "./raw/FieldLoading";
import { TypeCustom } from "./type/TypeCustom";
import { FieldTypeText, PropTypeText } from "./type/TypeText";
import { TypeDropdown } from "./type/TypeDropdown";
import { FieldToggle } from "./type/TypeToggle";
import { SingleOption } from "./type/TypeSingleOption";
import { MultiOption } from "./type/TypeMultiOption";

const modify = {
  timeout: null as any,
};

export const FieldInput: FC<{
  field: FieldLocal;
  fm: FMLocal;
  PassProp: any;
  child: any;
  _item: any;
  _meta: any;
  _sync: (mitem: any, item: any) => void;
  arg: FieldProp;
}> = ({ field, fm, PassProp, child, _meta, _item, _sync, arg }) => {
  // return <></>
  const prefix = typeof field.prefix === "function" ? field.prefix() : typeof field.prefix === "string" ? field.prefix : null;
  const suffix = typeof field.suffix === "function" ? field.suffix() : typeof field.suffix === "string" ? field.prefix : null;
  const errors = fm.error.get(field.name);
  const type_field = arg.type; // tipe field
  const sub_type_field = arg.sub_type;
  // sudah gk pake children
  // const childs = get(
  //   child,
  //   "props.meta.item.component.props.child.content.childs"
  // );

  // let found = null as any;

  // if (childs && childs.length > 0 && field.type !== "custom") {
  //   for (const child of childs) {
  //     let mp = (fieldMapping as any)[field.type];
  //     if (!mp) {
  //       mp = (fieldMapping as any)["text"];
  //     }
  //     if (child.component?.id === mp.id) {
  //       found = child;
  //       if (mp.props) {
  //         const item = createItem({
  //           component: {
  //             id: "--",
  //             props:
  //               typeof mp.props === "function" ? mp.props(fm, field) : mp.props,
  //           },
  //         });
  //         const props = found.component.props;
  //         let should_update = false;
  //         for (const [k, v] of Object.entries(item.component.props) as any) {
  //           if (props[k] && props[k].valueBuilt === v.valueBuilt) {
  //             continue;
  //           } else {
  //             if (field.prop && !field.prop[k]) {
  //               props[k] = v;
  //               should_update = true;
  //             }
  //           }
  //         }
  //         if (should_update) {
  //           updateFieldMItem(_meta, found, _sync);
  //         }
  //       }
  //     }
  //   }
  // }

  // useEffect(() => {
  //   if (isEditor && !found && field.type !== "custom") {
  //     genFieldMitem({ _meta, _item, _sync, field, fm });
  //   }
  // }, []);
  return (
    <div
      className={cx(
        !["toogle", "button", "radio","checkbox"].includes(arg.sub_type)
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
          {/* <FieldToggle arg={arg} field={field} fm={fm} /> */}
          {[
            "date",
            "input"
          ].includes(type_field) ? (
            <FieldTypeText
              field={field}
              fm={fm}
              prop={{ type: arg.type, sub_type: arg.sub_type, prefix, suffix} as PropTypeText}
            />
          ) : ["single-option"].includes(type_field) ? (
            <SingleOption arg={arg} field={field} fm={fm} />
          ) : ["multi-option"].includes(type_field) ? (
            <MultiOption arg={arg} field={field} fm={fm}/>
          ) : (
            <>OTW</>
          )}
          {/* Komentar nanti diaktifkan setelah input */}
          {/* {field.type === "custom" ? (
            <TypeCustom fm={fm} field={field} />
          ) : (
            <>
              {!found && <FieldLoading />}
              {found && (
                <PassProp field={field} fm={fm}>
                  {found}
                </PassProp>
              )}
            </>
          )} */}
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
