import { FC } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MDMain } from "../parts/MDMaster";
import { MDTab } from "../parts/MDTab";
import { MDLocal, MDRef } from "../utils/typings";

export const ModeHSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="horizontal">
        <Panel
          className="c-border-r"
          defaultSize={md.panel.size}
          minSize={md.panel.min_size}
        >
          <MDMain md={md} mdr={mdr} />
        </Panel>
        <>
          <PanelResizeHandle />
          <Panel
            className="c-flex c-flex-col c-items-stretch c-w-10"
            defaultSize={
              parseInt(localStorage.getItem(`prasi-md-h-${md.name}`) || "") ||
              undefined
            }
            onResize={(e) => {
              if (e < 80) {
                localStorage.setItem(`prasi-md-h-${md.name}`, e.toString());
              }
            }}
          >
            <MDTab md={md} mdr={mdr} />
          </Panel>
        </>
      </PanelGroup>
    </div>
  );
};
