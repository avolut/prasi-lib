import get from "lodash.get";
import { MDLocal, MDProps, MDRef } from "./typings";
import { getProp } from "lib/utils/get-prop";

export const mdBread = (md: MDLocal, mdr: MDRef, props: MDProps, item: PrasiItem) => {
 const child = get(item, "component.props.child.content.childs") || [];
 const master = child.find((e) => get(e, "component.id")=== "c68415ca-dac5-44fe-aeb6-936caf8cc491")
 let mode = "master";
  if (isEditor) {
    mode = md.props.editor_tab;
  } else {
    if (typeof md.selected === "object") {
      if (!md.tab.active) {
        md.tab.active = md.tab.list[0];
      }
      mode = md.tab.active;
    }
  }
  const done = (item: Array<any>) => {
    md.breadcrumb.list = item || [];
  }
  if(mode === "master"){
    const master_bread = getProp(master, "breadcrumb", { md });
    if (master_bread instanceof Promise) {
      master_bread.then((e) => {
        done(e)
      });
    } else {
      done(master_bread)
    }
  }else{
    const tab = child.find((e) => get(e, "component.id")=== "cb52075a-14ab-455a-9847-6f1d929a2a73" && eval(get(e, "component.props.name.value")) === mode)
    const master_bread = getProp(tab, "breadcrumb", { md });
    if (master_bread instanceof Promise) {
      master_bread.then((e) => {
        done(e)
      });
    } else {
      done(master_bread)
    }
  }
  console.log({mode})
};
