import { FC } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MDDetail } from "../parts/MDDetail";
import { MDMaster } from "../parts/MDMaster";
import { MDLocal, MDRef } from "../utils/typings";
import { getPathname } from "lib/utils/pathname";

export const ModeVSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="vertical">
        <Panel className="c-border-b c-flex">
          <MDMaster md={md} mdr={mdr} />
        </Panel>
        {(md.selected || isEditor) && (
          <>
            <PanelResizeHandle />
            <Panel
              className="c-flex c-flex-col c-items-stretch"
              defaultSize={
                Number(
                  localStorage.getItem(
                    `prasi-md-${getPathname({ hash: false })}${md.name}`
                  )
                ) || md.detail_size
              }
              onResize={(e) => {
                if (e < 80 && !isEditor) {
                  localStorage.setItem(
                    `prasi-md-${getPathname({ hash: false })}${md.name}`,
                    e.toString()
                  );
                }
              }}
            >
              <MDDetail md={md} mdr={mdr} />
            </Panel>
          </>
        )}
      </PanelGroup>
    </div>
  );
};
