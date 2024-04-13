import { createItem } from "@/gen/utils";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal } from "../typings";
import { genFieldMitem, updateFieldMItem } from "../utils/gen-mitem";
import { fieldMapping } from "./mapping";
import { FieldLoading } from "./raw/FieldLoading";

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
}> = ({ field, fm, PassProp, child, _meta, _item, _sync }) => {
  const prefix = typeof field.prefix === "function" ? field.prefix() : null;
  const suffix = typeof field.suffix === "function" ? field.suffix() : null;
  const errors = fm.error.get(field.name);
  const childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );

  let found = null as any;
  if (childs && childs.length > 0) {
    for (const child of childs) {
      const mp = (fieldMapping as any)[field.type];
      if (child.component?.id === mp.id) {
        found = child;

        if (mp.props) {
          const item = createItem({
            component: {
              id: "--",
              props:
                typeof mp.props === "function" ? mp.props(fm, field) : mp.props,
            },
          });

          const props = found.component.props;
          let should_update = false;
          for (const [k, v] of Object.entries(item.component.props) as any) {
            if (props[k] && props[k].valueBuilt === v.valueBuilt) {
              continue;
            } else {
              if (field.prop && !field.prop[k]) {
                props[k] = v;
                should_update = true;
              }
            }
          }

          if (should_update) {
            updateFieldMItem(_meta, found, _sync);
          }
        }
      }
    }
  }

  useEffect(() => {
    if (isEditor && !found) {
      genFieldMitem({ _meta, _item, _sync, field, fm });
    }
  }, []);

  return (
    <div
      className={cx(
        "field-outer c-flex c-flex-1 c-flex-row c-rounded c-border c-text-sm",
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
          > div {
            min-height: 35px;
            line-height: 35px;
          }
        `
      )}
    >
      {prefix && <></>}
      {fm.status === "loading" ? (
        <FieldLoading />
      ) : (
        <div
          className={cx(
            "field-inner c-flex-1 c-flex c-items-center c-justify-center",
            field.disabled && "c-pointer-events-none"
          )}
        >
          {!found && <FieldLoading />}
          {found && (
            <PassProp field={field} fm={fm}>
              {found}
            </PassProp>
          )}
        </div>
      )}
      {suffix && <></>}
    </div>
  );
};
