import get from "lodash.get";
import { MDLocal, MDProps, MDRef } from "./typings";

export const editorMDInit = (md: MDLocal, mdr: MDRef, arg: MDProps) => {
  const {
    mode,
    show_head,
    tab_mode,
    editor_tab,
    gen_fields,
    gen_table,
    on_init,
  } = arg;
  md.props.mode = mode;
  md.props.show_head = show_head;
  md.props.tab_mode = tab_mode;
  md.props.editor_tab = editor_tab;
  md.props.gen_fields = gen_fields;
  md.props.gen_table = gen_table;
  md.props.on_init = on_init;

  console.log(get(mdr, "master.edit.childs.0"));
  if (!mdr.master || (mdr.master && !get(mdr, "master.edit.childs.0.childs.length"))) {
    md.breadcrumb = [
      {
        label: (
          <>
            ⚠️ Master Detail is not ready
            <br />
            <div
              className={css`
                font-size: 12px;
                font-weight: normal;
              `}
            >
              Please generate master detail props first
            </div>
          </>
        ),
      },
    ];
    md.status = "unready";
  } else {
    md.breadcrumb = [];
    md.status = "ready";
  }
};
