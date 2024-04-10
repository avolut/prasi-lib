import { FC } from "react";
import { FieldLocal } from "../typings";

export const Label: FC<{ field: FieldLocal }> = ({ field }) => {
  return <div className={cx("label")}>{field.label}</div>;
};
