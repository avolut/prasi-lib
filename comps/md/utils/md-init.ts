import { MDLocal } from "./typings";
import { getProp } from "./get-prop";
import get from "lodash.get";

export const masterDetailInit = (
  md: MDLocal,
  child: any,
  editor_tab: string
) => {
  const childs = get(
    child,
    "props.meta.item.component.props.child.content.childs"
  );
  if (Array.isArray(childs)) {
    md.master.internal = null;
    md.childs = {};
    md.tab.list = [];
    if (isEditor && editor_tab === "master") {
      if (md.tab.active) {
        md.tab.active = "";
        setTimeout(md.render);
      }
    }

    for (const child of childs) {
      const cid = child?.component?.id;
      if (cid) {
        if (cid === "c68415ca-dac5-44fe-aeb6-936caf8cc491") {
          md.master.internal = child;
        }
        if (cid === "cb52075a-14ab-455a-9847-6f1d929a2a73") {
          const name = getProp(child, "name");
          if (typeof name === "string") {
            if (isEditor && editor_tab !== "master") {
              if (name === editor_tab && md.tab.active !== name) {
                md.tab.active = name;
                setTimeout(md.render);
              }
            }
            md.tab.list.push(name);
            md.childs[name] = {
              breadcrumb: getProp(child, "breadcrumb"),
              actions: getProp(child, "actions"),
              internal: child,
              name,
              hide() {},
              show() {},
              render() {},
              data: {},
            };
          }
        }
      }
    }
  }
};
