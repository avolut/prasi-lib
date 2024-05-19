import { MDLocal, MDProps } from "./typings";

export const editorMDInit = (md: MDLocal, arg: MDProps) => {
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
  md.props.mode = mode;
  md.props.show_head = show_head;
  md.props.tab_mode = tab_mode;
  md.props.editor_tab = editor_tab;
  md.props.gen_fields = gen_fields;
  md.props.gen_table = gen_table;
  md.props.on_init = on_init;
};
