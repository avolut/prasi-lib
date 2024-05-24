import { FC } from "react";
import { PTProp } from "../utils/typings";

export const PanelHeader: FC<PTProp> = ({
  child,
  tab,
  PassProp,
  item,
  on_click,
  pt,
  name,
}) => {
  return (
    <div className="c-flex c-flex-row" onClick={on_click}>
      <PassProp active={pt.mode === name}>{child}</PassProp>
    </div>
  );
};
