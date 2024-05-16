import { FC } from "react";
import { MDLocal, MDRef, w } from "./utils/typings";
import { MDHeader } from "./MDHeader";

export const should_show_tab = (md: MDLocal) => {
  if (isEditor) {
    if (md.tab.active !== "") return true;
  }
  return false;
};

export const MDTab: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const detail = md.childs[md.tab.active];
  const PassProp = mdr.PassProp;
  if (!detail) {
    return null;
  }
  return (
    <>
      {md.props.show_head === "only-child" && <MDHeader md={md} mdr={mdr} />}
      <div
        className={cx(
          "c-w-full c-h-full c-flex c-flex-1",
          md.props.tab_mode === "v-tab" && "c-flex-col"
        )}
      >
        {md.props.tab_mode !== "hidden" && md.tab.list.length > 1 && (
          <MDNavTab md={md} mdr={mdr} />
        )}
        <PassProp md={md}>{detail.internal}</PassProp>
      </div>
    </>
  );
};

export const MDNavTab: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const mode = md.props.tab_mode;
  return (
    <div
      className={cx(
        "tab-list c-flex c-text-sm",
        mode === "v-tab" && "c-flex-row c-border-b c-pl-2 c-pt-2",
        mode === "h-tab" && "c-flex-col c-border-r c-pl-2 c-min-w-[100px]"
      )}
    >
      {md.tab.list.map((tab_name, idx) => {
        const child = md.childs[tab_name];
        if (!child) return null;
        return (
          <div
            className={cx(
              "tab-item c-py-1 hover:c-bg-blue-50 c-cursor-pointer c-relative",
              tab_name === md.tab.active && "active",
              mode === "v-tab" &&
                cx(
                  "c-px-3 c-border-t c-border-r",
                  idx === 0 && "c-border-l",
                  tab_name === md.tab.active &&
                    "c-border-b-[3px] c-border-b-blue-600 c-bg-blue-50"
                ),
              mode === "h-tab" &&
                cx(
                  "c-pl-3 c-border-l c-border-b",
                  idx === 0 && "c-border-t",
                  tab_name === md.tab.active && " c-bg-blue-50"
                )
            )}
            key={tab_name}
            onClick={() => {
              if (isEditor) {
                return;
              }
              md.tab.active = tab_name;
              md.params.apply();
              md.render();
            }}
          >
            {tab_name === md.tab.active && (
              <div
                className={cx(
                  "c-absolute",
                  mode === "h-tab" &&
                    cx(
                      "c-border-l-4 c-border-l-blue-600 c-left-0 c-bottom-0 c-top-0"
                    )
                )}
              ></div>
            )}
            {child.label}
          </div>
        );
      })}
    </div>
  );
};
