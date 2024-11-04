import { FC, useEffect } from "react";
import { FMLocal, FieldLocal, FieldProp } from "../typings";

export const Label: FC<{ field: FieldLocal; fm: FMLocal; arg: FieldProp }> = ({
  field,
  fm,
  arg,
}) => {
  const errors = fm.error.get(field.name);
  const disabled =
    typeof field.disabled === "function" ? field.disabled() : field.disabled;
  useEffect(() => {
    if (field.name === "complete_description")
      console.log("log", field.required);
  }, []);
  const required =
    typeof arg.required === "string"
      ? arg.required === "y"
      : typeof arg.required === "function"
      ? arg.required()
      : false;
  if (typeof required === "boolean" && field.required !== required) {
    field.required = required;
    field.render();
  }
  return (
    <div
      className={cx(
        "label c-text-sm c-flex c-items-center",
        "c-mt-3 c-w-full c-justify-between"
      )}
    >
      <div>
        <span className={cx(errors.length > 0 && `c-text-red-600`)}>
          {field.label}
        </span>
        {required && !disabled && (
          <span className="c-text-red-600 c-mb-2 c-ml-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 6v12" />
              <path d="M17.196 9 6.804 15" />
              <path d="m6.804 9 10.392 6" />
            </svg>
          </span>
        )}
      </div>

      {field.label_action && (
        <div className="c-self-end">{field.label_action}</div>
      )}
    </div>
  );
};
