import { useLocal } from "@/utils/use-local";
import { getProp } from "./utils/get-prop";
import { MDLocal } from "./utils/typings";
import { BreadItem } from "../custom/Breadcrumb";

export const refreshBread = (md: MDLocal) => {
  const local = useLocal({
    crumb: null as any,
    last_render: Date.now(),
    selected: null as any,
  });

  if (isEditor) {
    refreshBreadInternal(md, () => {
      if (Date.now() - local.last_render > 1000) {
        md.render();
      }
      local.last_render = Date.now();
    });
  } else {
    if (local.crumb !== md.breadcrumb || md.selected !== local.selected) {
      refreshBreadInternal(md, () => {
        local.crumb = md.breadcrumb;
        local.selected = md.selected;
        md.render();
      });
    }
  }
};

const refreshBreadInternal = (md: MDLocal, callback: () => void) => {

  let mode = "master";
  if (isEditor) {
    mode = md.props.editor_tab;
  } else {
    if (md.selected) {
      if (!md.tab.active) {
        md.tab.active = md.tab.list[0];
      }
      mode = md.tab.active;
    }
  }
  if (mode === "master") {
    const master_bread = getProp(md.master.internal, "breadcrumb", { md });
    if (master_bread instanceof Promise) {
      master_bread.then((e) => {
        done(md, e, callback);
      });
    } else {
      done(md, master_bread, callback);
    }
  } else {
    const detail = md.childs[mode];
    if (detail) {
      const detail_bread = getProp(detail.internal, "breadcrumb", { md });
      if (detail_bread instanceof Promise) {
        detail_bread.then((e) => done(md, e, callback));
      } else {
        done(md, detail_bread, callback);
      }
    }
  }
};

const done = (md: MDLocal, bread: BreadItem[], callback: () => void) => {
  if (Array.isArray(bread)) {
    md.breadcrumb = bread;
    callback();
  }
};
