import get from "lodash.get";
import { GenMasterDetailArg, codeBuild } from "./utils";
import { createItem, formatName } from "../utils";
import { gen_form } from "../gen_form/gen_form";

export const genAtions = async (arg: GenMasterDetailArg, data: any) => {
  console.log({ arg, data });
  const header = get(data, "header");
  const action_right = header.content.childs.find(
    (e: any) => e.name === "right"
  );

  const list_action_right =
    typeof action_right === "object" ? action_right.childs : [];
  for (const c of get(data, "child.content.childs") || []) {
    if (c.component?.id === "cb52075a-14ab-455a-9847-6f1d929a2a73") {
      const name_tab = c.component.props.name.value.replaceAll('"', "");
      const is_already = list_action_right.length
        ? list_action_right.some(
            (action: any) =>
              action.component.props.name.value.replaceAll(/`/g, "") ===
              name_tab
          )
        : false;
      if (!is_already) {
        const res = await codeBuild({
          show: `\
() => {
  if (typeof md === "object") {
    const tab_active = md.tab.active;
    if (name === "master") {
      if (tab_active === "" || tab_active === "master") return true;
    } else {
      if (tab_active === name) return true;
    }
  }
  return false;
}
  `,
        });
        // const childs = get(action_right, "childs") || [];
        // childs.push(
        //   createItem({
        //     name: "action"
        //   })
        // );
        // const childs = get(data, "child.content.childs[3].childs") || [];
        // console.log(childs)
        // childs.push(
        //   createItem({
        //     name: "action",
        //     // component: {
        //     //   id: "83a2859d-2f72-4e7d-a0c6-9d3368e1ed85",
        //     //   props: {
        //     //     show: res.show,
        //     //     name: name_tab,
        //     //   },
        //     // },
        //   })
        // );
        // console.log({action_right})
      }
      console.log(is_already);
    }
  }
};
