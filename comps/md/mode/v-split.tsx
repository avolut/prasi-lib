import { FC } from "react";
import { MDMaster } from "../parts/MDMaster";
import { MDLocal, MDRef } from "../utils/typings";
import { MDDetail, should_show_tab } from "../parts/MDDetail";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const ModeVSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="vertical">
        <Panel
          className="c-border-b"
          defaultSize={md.panel.size}
          minSize={md.panel.min_size}
        >
          <MDMaster md={md} mdr={mdr} />
        </Panel>
        <>
          <PanelResizeHandle />
          <Panel
            className="c-flex c-flex-col c-items-stretch"
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
            <MDDetail md={md} mdr={mdr} />
          </Panel>
        </>
      </PanelGroup>
    </div>
  );
};
