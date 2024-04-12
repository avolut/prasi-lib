import { FC } from "react";
import { FMLocal, FieldLocal } from "../typings";

export const Label: FC<{ field: FieldLocal; fm: FMLocal }> = ({
  field,
  fm,
}) => {
  return (
    <div
      className={cx(
        "label",
        fm.props.label_mode === "horizontal" &&
          css`
            font-size: 14px;
            width: ${fm.props.label_width}px;
          `
      )}
    >
      {field.label}
    </div>
  );
};
