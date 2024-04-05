import { FC } from "react";
import { MDLocal } from "./utils/typings";

export const should_show_tab = (md: MDLocal) => {
  if (isEditor) {
    if (md.tab.active !== "") return true;
  }
  return false;
};

export const MDTab: FC<{ md: MDLocal }> = ({ md }) => {
  return <div></div>;
};
