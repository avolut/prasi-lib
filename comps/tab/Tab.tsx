import { useLocal } from "lib/utils/use-local";
import get from "lodash.get";
import { FC, ReactNode, useEffect } from "react";
import { PTLocalInternal, PTProp } from "./utils/typings";
export const PanelTab: FC<PTProp> = ({ header, body, tab, PassProp, item }) => {
  const local = useLocal<PTLocalInternal>({
    mode: "",
  });
  useEffect(() => {
    local.mode = tab;
    local.render();
    console.log({local})
  }, [tab])
  const header_list = get(item, "component.props.header.content.childs") || [];
  return (
    <div className="c-flex c-flex-col c-flex-grow c-h-full">
      <PassProp panel_tab={local}>{header}</PassProp>
      <PassProp panel_tab={local}>{body}</PassProp>
    </div>
  );
};





