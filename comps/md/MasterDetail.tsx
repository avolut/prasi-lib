import { useLocal } from "@/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { refreshBread } from "./MDBread";
import { MDHeader } from "./MDHeader";
import { MDTab, should_show_tab } from "./MDTab";
import {
  masterDetailApplyParams,
  masterDetailParseHash as masterDetailParseParams,
} from "./utils/md-hash";
import { masterDetailInit, masterDetailSelected } from "./utils/md-init";
import { MDLocal, MDLocalInternal, MDProps, MDRef } from "./utils/typings";
import { editorMDInit } from "./utils/editor-init";

export const MasterDetail: FC<MDProps> = (arg) => {
  const {
    PassProp,
    child,
    name,
    mode,
    show_head,
    tab_mode,
    editor_tab,
    gen_fields,
    gen_table,
    on_init,
  } = arg;
  const _ref = useRef({ PassProp, child });
  const md = useLocal<MDLocalInternal>({
    name,
    actions: [],
    breadcrumb: [],
    selected: null,
    tab: {
      active: "",
      list: [],
    },
    internal: { action_should_refresh: true },
    childs: {},
    props: {
      mode,
      show_head,
      tab_mode,
      editor_tab,
      gen_fields,
      gen_table,
      on_init,
    },
    params: {
      hash: {},
      tabs: {},
      parse: () => {
        masterDetailParseParams(md);
      },
      apply: () => {
        masterDetailApplyParams(md);
      },
    },
    master: { internal: null, render() {} },
    panel: {
      size: 25,
      min_size: 0,
    },
  });

  const local = useLocal({ init: false });
  if (isEditor) {
    editorMDInit(md, arg);
  }

  _ref.current.PassProp = PassProp;
  _ref.current.child = child;

  useEffect(() => {
    local.init = false;
    local.render();
  }, [editor_tab]);

  // refreshBread ga ditaro di useEffect karena
  // butuh ubah breadcrumb berdasarkan mode master-detailnya
  refreshBread(md);

  if (!local.init || isEditor) {
    local.init = true;
    masterDetailInit(md, child, editor_tab);
    masterDetailSelected(md);
  }
  return (
    <div
      className={cx(
        "c-flex-1 c-flex-col c-flex c-w-full c-h-full c-overflow-hidden"
      )}
    >
      {md.props.show_head === "always" && (
        <MDHeader md={md} mdr={_ref.current} />
      )}
      {md.props.mode === "full" && <ModeFull md={md} mdr={_ref.current} />}
      {md.props.mode === "v-split" && <ModeVSplit md={md} mdr={_ref.current} />}
      {md.props.mode === "h-split" && <ModeHSplit md={md} mdr={_ref.current} />}
    </div>
  );
};

const ModeFull: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  if (should_show_tab(md)) {
    return <MDTab md={md} mdr={mdr} />;
  }

  return (
    <>
      {!md.selected && <Master md={md} mdr={mdr} />}
      {md.selected && <MDTab md={md} mdr={mdr} />}
    </>
  );
};

const ModeVSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="vertical">
        <Panel
          className="c-border-b"
          defaultSize={md.panel.size}
          minSize={md.panel.min_size}
        >
          <Master md={md} mdr={mdr} />
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
            <MDTab md={md} mdr={mdr} />
          </Panel>
        </>
      </PanelGroup>
    </div>
  );
};
const ModeHSplit: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  return (
    <div className={cx("c-flex-1")}>
      <PanelGroup direction="horizontal">
        <Panel
          className="c-border-r"
          defaultSize={md.panel.size}
          minSize={md.panel.min_size}
        >
          <Master md={md} mdr={mdr} />
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
const Master: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const PassProp = mdr.PassProp;
  return (
    <>
      {md.props.show_head === "only-master" && <MDHeader md={md} mdr={mdr} />}
      <PassProp md={md}>{md.master.internal}</PassProp>
    </>
  );
};
