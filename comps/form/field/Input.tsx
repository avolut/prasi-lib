import { FC } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";
import { InputText } from "./input/InputText";
import { Skeleton } from "@/comps/ui/skeleton";

export const FieldInput: FC<{ field: FieldLocal; fm: FMLocal }> = ({
  field,
  fm,
}) => {
  const prefix = typeof field.prefix === "function" ? field.prefix() : null;
  const suffix = typeof field.suffix === "function" ? field.suffix() : null;

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
            : field.focused && "c-border-blue-700 c-outline c-outline-blue-700",
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
            "field-inner c-flex-1 c-flex",
            field.disabled && "c-pointer-events-none"
          )}
        >
          {(["text", "password", "number"] as FieldProp["type"][]).includes(
            field.type
          ) && <InputText field={field} fm={fm} />}
        </div>
      )}
      {suffix && <></>}
    </div>
  );
};
