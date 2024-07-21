import { useLocal } from "lib/utils/use-local";
import { FC, useEffect } from "react";
import { MDLocal, MDRef } from "../utils/typings";
import { MDHeader } from "./MDHeader";

const w = window as unknown as {
  md_panel_master: any;
};
export const MDRenderMaster: FC<{
  size: any;
  min_size: any;
  child: any;
  on_init: () => MDLocal;
  breadcrumb: () => Array<any>;
}> = ({ child, on_init, min_size, size, breadcrumb }) => {
  const local = useLocal({ md: null as null | MDLocal });
  if (!local.md) {
    local.md = on_init();
  }
  const md = local.md;
  md.header.master.breadcrumb = breadcrumb;

  useEffect(() => {
    md.header.render();
    if (md) {
      let width = 0;
      let min_width = 0;
      try {
        width = Number(size) || 0;
        min_width = Number(min_size) || 0;
      } catch (e: any) {}
      w.md_panel_master = JSON.stringify({
        size: width,
        min_size: min_width,
      });
      if (md.panel) {
        md.panel.min_size = min_width;
        md.panel.size = width;
      }
    }
  }, Object.values(md.deps || {}) || []);

  return <>{child}</>;
};

export const MDMaster: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const PassProp = mdr.PassProp;
  return (
    <>
      {md.props.show_head === "only-master" && <MDHeader md={md} mdr={mdr} />}
      <div
        className={cx(
          css`
            > div {
              flex: 1;
            }
          `,
          "c-flex c-flex-1"
        )}
      >
        <PassProp md={md}>{mdr.master}</PassProp>
      </div>
    </>
  );
};
