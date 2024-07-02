import { useLocal } from "@/utils/use-local";
import { parseGenField } from "lib/gen/utils";
import { FC, useRef } from "react";
import { ModeFull } from "./mode/full";
import { ModeHSplit } from "./mode/h-split";
import { ModeVSplit } from "./mode/v-split";
import { MDHeader } from "./parts/MDHeader";
import { editorMDInit } from "./utils/editor-init";
import {
  masterDetailApplyParams,
  masterDetailParseHash as masterDetailParseParams,
} from "./utils/md-hash";
import { mdRenderLoop } from "./utils/md-render-loop";
import { MDLocalInternal, MDProps } from "./utils/typings";

export const MasterDetail: FC<MDProps> = (arg) => {
  const {
    PassProp,
    name,
    mode,
    show_head,
    tab_mode,
    editor_tab,
    gen_fields,
    gen_table,
    on_init,
    _item,
  } = arg;
  const _ref = useRef({ PassProp, item: _item, childs: {} });
  const mdr = _ref.current;
  const md = useLocal<MDLocalInternal>({
    name,
    status: isEditor ? "init" : "ready",
    actions: [],
    header: {
      breadcrumb: [],
      render: () => {},
    },
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
      item: _item,
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
    master: { render() {} },
    panel: {
      size: 25,
      min_size: 0,
    },
  });

  mdr.PassProp = PassProp;
  mdr.item = _item;
  mdRenderLoop(md, mdr, arg);
  if (isEditor) {
    md.tab.active = editor_tab;
    editorMDInit(md, mdr, arg);
  } else {
    md.status = "ready";
    const fields = parseGenField(gen_fields);
    const pk = fields.find((e) => e.is_pk);
    md.pk = pk;
    md.params.parse();
    if (pk) {
      const value = md.params.hash[md.name];
      if (value) {
        md.selected = { [pk.name]: value };
        const tab = md.params.tabs[md.name];
        if (tab && md.tab.list.includes(tab)) {
          md.tab.active = tab;
        } else {
          md.tab.active = "detail";
        }
      }
    }
  }

  return (
    <div
      className={cx(
        "c-flex-1 c-flex-col c-flex c-w-full c-h-full"
      )}
    >
      {md.props.show_head === "always" && <MDHeader md={md} mdr={mdr} />}
      {md.status === "ready" && (
        <>
          {md.props.mode === "full" && <ModeFull md={md} mdr={mdr} />}
          {md.props.mode === "v-split" && <ModeVSplit md={md} mdr={mdr} />}
          {md.props.mode === "h-split" && <ModeHSplit md={md} mdr={mdr} />}
        </>
      )}
    </div>
  );
};
