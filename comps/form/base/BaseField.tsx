import { FMLocal } from "../typings";
import { BaseLabel } from "./BaseLabel";
import { BaseFieldProps } from "./utils/type/field";
import { useField } from "./utils/use-field";

export const BaseField = <T extends Record<string, any>>(
  arg: BaseFieldProps<T> & { fm: FMLocal }
) => {
  const field = useField<T>(arg);
  const fm = arg.fm;
  const mode = fm.props.label_mode || "vertical";
  const props = arg.props;
  const w = field.width;
  const errors = fm.error.get(field.name);

  return (
    <label
      className={cx(
        "field",
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
        mode === "horizontal" && "c-flex-row c-items-center",
        mode === "vertical" && "c-flex-col c-space-y-1"
      )}
      {...props}
    >
      {mode !== "hidden" && <BaseLabel field={field} fm={fm} />}
      <div className="field-inner c-flex c-flex-1 c-flex-col">
        {field.desc && (
          <div className={cx("c-p-2 c-text-xs", errors.length > 0 && "c-pb-1")}>
            {field.desc}
          </div>
        )}
        {errors.length > 0 && (
          <div
            className={cx(
              "c-p-2 c-text-xs c-text-red-600",
              field.desc && "c-pt-0"
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
