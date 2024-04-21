import { FC } from "react";
import { BaseFieldLocal } from "./utils/type/field";
import { FMLocal } from "../typings";

export const BaseLabel = <T extends Record<string, any>>({
  field,
  fm,
}: {
  field: BaseFieldLocal<T>;
  fm: FMLocal;
}) => {
  const errors = fm.error.get(field.name);

  return (
    <div
      className={cx(
        "label c-text-sm c-flex c-items-center",
        fm.props.label_mode === "horizontal" &&
          css`
            width: ${fm.props.label_width}px;
          `,
        fm.props.label_mode === "vertical" && "c-mt-3"
      )}
    >
      <span className={cx(errors.length > 0 && `c-text-red-600`)}>
        {field.label}
      </span>
      {field.required && (
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
  );
};
