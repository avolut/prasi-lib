import { GFCol, PropOptRaw, createItem } from "../utils";
import get from "lodash.get";
import { GenMasterDetailArg } from "./utils";
import { gen_table_list } from "../gen_table_list/gen_table_list";
export const genList = async (
  arg: GenMasterDetailArg,
  fields: GFCol[],
  data: any
) => {
  for (const c of get(data, "child.content.childs") || []) {
    if (c.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491") {
      const childs = get(c, "component.props.child.content.childs") || [];
      childs.length = 0;
      childs.push(
        createItem({
          component: {
            id: "567d5362-2cc8-4ca5-a531-f771a5c866c2",
            props: {
              name: arg.gen_table,
              gen_table: arg.gen_table,
              generate: "y",
              selected: "",
              on_load: "",
              gen_fields: [arg.gen_fields],
              child: {
                childs: [],
              },
            },
          },
        })
      );
      const data = childs[0].component.props;
      const modify = async (props: any) => {};
      gen_table_list(modify, data, { mode: "table" });
    }
  }
};
