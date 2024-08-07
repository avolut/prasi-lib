import { FC } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { MDMaster } from "../parts/MDMaster";
import { MDDetail } from "../parts/MDDetail";
import { MDLocal, MDRef } from "../utils/typings";
import { getPathname } from "@/utils/pathname";

export const ModeHSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="horizontal">
        <Panel className="c-border-r c-flex">
          <MDMaster md={md} mdr={mdr} />
        </Panel>
        {(md.selected || isEditor) && (
          <>
            <PanelResizeHandle />
            <Panel
              className="c-flex c-flex-col c-items-stretch c-w-10"
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
