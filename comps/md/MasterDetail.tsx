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
import { parseGenField } from "lib/gen/utils";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import get from "lodash.get";
const w = window as unknown as {
  generating_prasi_md: Record<string, true>;
};

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

  if (get(w, "generating_prasi_md.master_detail"))
    return (
      <div className="c-relative c-p-4 c-w-full c-bg-white c-rounded-lg c-overflow-hidden c-h-full c-shadow c-flex c-justify-center c-items-center">
        <Loader2 className="c-h-4 c-w-4 c-animate-spin" />
        Loading Master Detail...
      </div>
    );
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
