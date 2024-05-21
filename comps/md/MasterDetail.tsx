import { useLocal } from "@/utils/use-local";
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
import { MDLocalInternal, MDProps } from "./utils/typings";
import { mdRenderLoop } from "./utils/md-render-loop";

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
    status: "init",
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
    editorMDInit(md, mdr, arg);
  }

  return (
    <div
      className={cx(
        "c-flex-1 c-flex-col c-flex c-w-full c-h-full c-overflow-hidden"
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
