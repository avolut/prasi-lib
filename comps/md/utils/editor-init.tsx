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

  const props = mdr.item.edit.props;
  if (props) {
    const child = props.child.value as PrasiItem;
    let master = child.edit.childs.find(
      (e) => e.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491"
    );
    let details = child.edit.childs.filter(
      (e) => e.component?.id === "cb52075a-14ab-455a-9847-6f1d929a2a73"
    );

    if (master?.childs.length === 0 && md.breadcrumb.length === 0) {
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
    }

    if (master && details.length > 0) {
      md.breadcrumb = [];
      md.status = "ready";
    }
  }
};
