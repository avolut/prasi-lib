import { Skeleton } from "@/comps/ui/skeleton";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { FMLocal, FieldLocal } from "../typings";
import { fieldMapping } from "./mapping";
import { Loader2 } from "lucide-react";
import { genFieldMitem } from "../utils/gen-mitem";

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
}> = ({ field, fm, PassProp, child, _meta, _item }) => {
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
      if (child.component?.id === fieldMapping[field.type].id) {
        found = child;
      }
    }
  }

  useEffect(() => {
    if (isEditor && !found) {
      genFieldMitem({ _meta, _item, field, fm });
    }
  }, []);

  return (
    <div
      className={cx(
        "field-inner c-flex c-flex-1 c-flex-row c-rounded c-border c-text-sm",
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
        <div className="c-flex c-flex-col c-space-y-1 c-p-1 c-justify-center">
          <div className="c-flex c-space-x-1">
            <Skeleton
              className={css`
                width: 50px;
                height: 10px;
              `}
            />
            <Skeleton
              className={css`
                width: 50px;
                height: 10px;
              `}
            />
          </div>
          <Skeleton
            className={css`
              width: 80px;
              height: 10px;
            `}
          />
        </div>
      ) : (
        <div
          className={cx(
            "field-inner c-flex-1 c-flex c-items-center c-justify-center",
            field.disabled && "c-pointer-events-none"
          )}
        >
          {!found && <Loader2 className="c-h-4 c-w-4 c-animate-spin" />}
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
