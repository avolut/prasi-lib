import { GFCol, PropOptRaw, createItem, formatName } from "../utils";
import get from "lodash.get";
import { GenMasterDetailArg, codeBuild } from "./utils";
import { gen_table_list } from "../gen_table_list/gen_table_list";
export const genList = async (arg: GenMasterDetailArg, data: any) => {
  for (const c of get(data, "child.content.childs") || []) {
    if (c.component?.id === "c68415ca-dac5-44fe-aeb6-936caf8cc491") {
      
      const res = await codeBuild({
        row_click: `\
({ row, rows, idx, event }: OnRowClick) => {
  md.selected = row;
  md.internal.action_should_refresh = true;
  md.params.apply();
  md.render();
};

type OnRowClick = {
  row: any;
  rows: any[];
  idx: any;
  event: React.MouseEvent<HTMLDivElement, MouseEvent>;
}
`,
        selected: `\
({ row, rows, idx }: SelectedRow) => {
  try {
    if (typeof md === "object") {
      if (Array.isArray(md.selected)) {
        if (md.selected.length) {
          let select = md.selected.find((e) => e === row)
          if(select) return true
        }
      } else {
        if (md.selected === row) {
          return true;
        }
      }
    }
  } catch (e) {
    
  }
  return false;
};

type SelectedRow = {
  row: any;
  rows: any[];
  idx: any;
}`,
        breadcrumb: `\
async () => {
  return [{ label: "List ${formatName(arg.gen_table)}" }] as BreadItem[];
};

type BreadItem = {
  label: React.ReactNode;
  url?: string;
  onClick?: () => void;
}`,
        actions: `\
async () => {
  return [
    {
      label: "Add ${formatName(arg.gen_table)}",
      onClick: async () => {
        md.selected = {};
        md.render();
      },
    },
  ] as ActionItem[];
};

type ActionItem =
  | {
      action?: string;
      label: React.ReactNode;
      onClick?: (e: any) => Promise<void>;
    }
  | React.ReactNode`,
      });
      const comp = createItem({
        component: {
          id: "c68415ca-dac5-44fe-aeb6-936caf8cc491",
          props: {
            breadcrumb: res.breadcrumb,
            actions: res.actions,
          },
        },
      });
      for (const [k, v] of Object.entries(comp.component.props)) {
        c.component.props[k] = v;
      }

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
              on_load: "",
              row_click: res.row_click,
              selected: res.selected,
              gen_fields: [JSON.stringify(arg.gen_fields)],
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
