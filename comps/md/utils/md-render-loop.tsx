import { MDLocal, MDProps, MDRef } from "./typings";

export const mdRenderLoop = (md: MDLocal, mdr: MDRef, props: MDProps) => {
  const childs =
    mdr.item.edit?.childs[0].edit?.childs.filter((e) => {
      return e.component?.id === "cb52075a-14ab-455a-9847-6f1d929a2a73";
    }) || [];

  const master = mdr.item.edit?.childs[0].edit?.childs.find((e) => {
    return e.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491";
  });
  if (master) {
    if (!md.master) md.master = { render() {}, reload() {} };
  }
  mdr.master = master;
  const tablist = [];
  for (const c of childs) {
    const props = c.edit?.props;
    if (props && props.name.mode === "string") {
      const name = props.name.value || "";
      if (name) {
        tablist.push(name);
        mdr.childs[name] = c;
        if (!md.childs[name]) {
          md.childs[name] = {
            name,
            hide() {},
            label: props.label.mode === "string" ? props.label.value : name,
            render() {},
            show() {},
          };
        }
      }
    }
  }
  md.tab.list = tablist;
};
