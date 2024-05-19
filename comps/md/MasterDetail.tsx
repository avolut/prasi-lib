import { useLocal } from "@/utils/use-local";
import { FC, useEffect, useRef } from "react";
import { ModeFull } from "./mode/full";
import { ModeHSplit } from "./mode/h-split";
import { ModeVSplit } from "./mode/v-split";
import { MDHeader } from "./parts/MDHeader";
import { editorMDInit } from "./utils/editor-init";
import {
  masterDetailApplyParams,
  masterDetailParseHash as masterDetailParseParams,
} from "./utils/md-hash";
import { masterDetailInit, masterDetailSelected } from "./utils/md-init";
import { MDLocalInternal, MDProps } from "./utils/typings";

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
    _item,
  } = arg;
  const _ref = useRef({ PassProp, child, item: _item });
  const mdr = _ref.current;
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

  mdr.PassProp = PassProp;
  mdr.child = child;
  mdr.item = _item;

  useEffect(() => {
    local.init = false;
    local.render();
  }, [editor_tab]);

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
      {md.props.show_head === "always" && <MDHeader md={md} mdr={mdr} />}
      {md.props.mode === "full" && <ModeFull md={md} mdr={mdr} />}
      {md.props.mode === "v-split" && <ModeVSplit md={md} mdr={mdr} />}
      {md.props.mode === "h-split" && <ModeHSplit md={md} mdr={mdr} />}
    </div>
  );
};
