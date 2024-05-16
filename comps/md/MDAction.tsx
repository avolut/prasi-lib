import { useLocal } from "@/utils/use-local";
import { FC, Fragment, isValidElement } from "react";
import { getProp } from "./utils/get-prop";
import { MDActions, MDLocal } from "./utils/typings";

export const MDAction: FC<{ md: MDLocal; PassProp: any; child: any }> = ({
  md,
  PassProp,
  child,
}) => {
  const local = useLocal({
    last_render: Date.now(),
  });

  if (isEditor) {
    refreshActionInternal(md, () => {
      if (Date.now() - local.last_render > 1000) {
        md.render();
      }
      local.last_render = Date.now();
    });
  } else {
    if (md.internal.action_should_refresh) {
      refreshActionInternal(md, () => {
        md.render();
      });
    }
  }
  return (
    <div
      className={cx(
        "c-flex c-flex-row c-space-x-1 c-items-stretch c-self-stretch c-h-full"
      )}
    >
      {child}
      {/* {md.actions.map((e, idx) => {
        if (isValidElement(e)) {
          return <Fragment key={idx}>{e}</Fragment>;
        }
        if (typeof e === "object" && (e.action || e.label)) {
          return <PassProp item={e}>{child}</PassProp>;
        }
      })} */}
    </div>
  );
};

const refreshActionInternal = (md: MDLocal, callback: () => void) => {
  if (md.internal.action_should_refresh) {
    md.internal.action_should_refresh = false;
  }

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
    const master_bread = getProp(md.master.internal, "actions", { md });
    if (master_bread instanceof Promise) {
      master_bread.then((e) => done(md, e, callback));
    } else {
      done(md, master_bread, callback);
    }
  } else {
    const detail = md.childs[mode];
    if (detail) {
      const detail_bread = getProp(detail.internal, "actions", { md });

      if (detail_bread instanceof Promise) {
        detail_bread.then((e) => done(md, e, callback));
      } else {
        done(md, detail_bread, callback);
      }
    }
  }
};

const done = (md: MDLocal, actions: MDActions, callback: () => void) => {
  if (Array.isArray(actions)) {
    md.actions = actions;
    callback();
  }
};
