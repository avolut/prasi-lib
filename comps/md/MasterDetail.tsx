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
import { MDLocal, MDLocalInternal, MDRef } from "./utils/typings";

const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
};

export const MasterDetail: FC<{
  child: any;
  PassProp: any;
  name: string;
  mode: "full" | "h-split" | "v-split";
  show_head: "always" | "only-master" | "only-child" | "hidden";
  tab_mode: "h-tab" | "v-tab" | "hidden";
  editor_tab: string;
  gen_fields: any;
  gen_table: string;
  on_init: (md: MDLocal) => void;
}> = ({
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
}) => {
  let isGenerate = false as Boolean;
  try {
    isGenerate = false;
    if (w.generating_prasi_md["master_detail"]) {
      isGenerate = true;
    }
  } catch (ex) {}

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
  });
  const local = useLocal({ init: false });
  if (isEditor) {
    md.props.mode = mode;
    md.props.show_head = show_head;
    md.props.tab_mode = tab_mode;
    md.props.editor_tab = editor_tab;
    md.props.gen_fields = gen_fields;
    md.props.gen_table = gen_table;
    md.props.on_init = on_init;
  }
  _ref.current.PassProp = PassProp;
  _ref.current.child = child;

  useEffect(() => {
    local.init = false;
    local.render();
  }, [editor_tab]);

  refreshBread(md);

  if (!local.init || isEditor) {
    local.init = true;
    masterDetailInit(md, child, editor_tab);
    masterDetailSelected(md);
  }
  if (isGenerate) return <>Generating Master Detail...</>;
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
        <Panel className="c-border-b">
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

const Master: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const PassProp = mdr.PassProp;

  return (
    <>
      {md.props.show_head === "only-master" && <MDHeader md={md} mdr={mdr} />}
      <PassProp md={md}>{md.master.internal}</PassProp>
    </>
  );
};
