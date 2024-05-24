import { FC } from "react";
import { IMenuItem } from "../utils/type-menu";

export const MenuItem: FC<IMenuItem> = ({ data, child }) => {
  return <div onClick={() => {}}>{child}</div>;
};
