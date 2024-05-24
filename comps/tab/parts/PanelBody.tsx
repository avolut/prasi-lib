import { FC } from "react";
import { PTProp } from "../utils/typings";

export const PanelBody: FC<PTProp> = ({
  header,
  child,
  tab,
  PassProp,
  item,
}) => {
  return <div onClick={() => {}}>{child}</div>;
};
