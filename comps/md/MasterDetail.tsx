import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { masterDetailApplyHash, masterDetailStoreHash } from "./utils/md-hash";
import { masterDetailInit } from "./utils/md-init";
import { MDLocal, MDLocalInternal } from "./utils/typings";
import { MDTab, should_show_tab } from "./MDTab";
import { getProp } from "./utils/get-prop";

export const MasterDetail: FC<{
  child: any;
  PassProp: any;
  name: string;
  mode: "full" | "h-split" | "v-split";
  show_head: "always" | "only-master" | "only-child" | "hidden";
  tab_mode: "h-tab" | "v-tab" | "hidden";
  editor_tab: string;
}> = ({ PassProp, child, name, mode, show_head, tab_mode, editor_tab }) => {
  const md = useLocal<MDLocalInternal>({
    name,
    actions: [],
    breadcrumb: [],
    selected: null,
    tab: {
      active: "",
      list: [],
    },
    childs: {},
    props: { mode, show_head, tab_mode },
    params: { hash: {}, tabs: {} },
    master: { internal: null, render() {}, pk: null },
  });
  const local = useLocal({ init: false });

  useEffect(() => {
    local.init = false;
    local.render();
  }, [editor_tab]);

  useEffect(() => {
    (async () => {
      if (!md.selected) {
        const master_bread = await getProp(md.master.internal, "breadcrumb");
      }
    })();
  }, [md.selected]);

  if (!local.init) {
    local.init = true;
    masterDetailInit(md, child, editor_tab);
    masterDetailApplyHash(md);
  } else {
    masterDetailStoreHash(md);
  }

  return (
    <div
      className={cx(
        "c-flex-1 c-flex-col c-flex c-w-full c-h-full c-overflow-hidden"
      )}
    >
      <Header md={md} child={child} PassProp={PassProp} />
      {md.props.mode === "full" && <ModeFull md={md} PassProp={PassProp} />}
      {md.props.mode === "v-split" && (
        <ModeVSplit md={md} PassProp={PassProp} />
      )}
    </div>
  );
};

const ModeFull: FC<{ md: MDLocal; PassProp: any }> = ({ md, PassProp }) => {
  if (should_show_tab(md)) {
    return <MDTab md={md} />;
  }

  return (
    <>
      {!md.selected && <PassProp md={md}>{md.master.internal}</PassProp>}
      {md.selected && <MDTab md={md} />}
    </>
  );
};

const ModeVSplit: FC<{ md: MDLocal; PassProp: any }> = ({ md, PassProp }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="vertical">
        <Panel className="c-border-b">
          <PassProp md={md}>{md.master.internal}</PassProp>
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
          ></Panel>
        </>
      </PanelGroup>
    </div>
  );
};

const Header: FC<{ md: MDLocal; child: any; PassProp: any }> = ({
  md,
  child,
  PassProp,
}) => {
  const head = get(child, "props.meta.item.component.props.header.content");
  const show_head = md.props.show_head;

  if (show_head === "always") {
    return <PassProp md={md}>{head}</PassProp>;
  } else if (show_head === "only-master" && !md.selected) {
    return <PassProp md={md}>{head}</PassProp>;
  } else if (show_head === "only-child" && md.selected) {
    return <PassProp md={md}>{head}</PassProp>;
  }
};
