import { createItem } from "lib/gen/utils";
import get from "lodash.get";
import { generateTableList } from "./gen-table-list";
import { formatName } from "lib/comps/form/gen/fields";

export const generateList = async (
  arg: { item: PrasiItem; table: string; fields: any },
  data: any,
  commit: boolean
) => {
  const item = arg.item;
  const tab_master = item.edit.childs[0].edit.childs.find(
    (e) => get(e, "component.id") === "c68415ca-dac5-44fe-aeb6-936caf8cc491"
  );
  const props: Record<string, PropVal> = {
    gen_table: {
      mode: "string",
      value: `"${arg.table}"`,
    },
    name: {
      mode: "string",
      value: arg.table,
    },
    generate: {
      mode: "string",
      value: "y",
    },
    opt__on_load: {
      mode: "string",
      value: "",
    },
    opt__row_click: {
      mode: "raw",
      value: `\
({ row, rows, idx, event }: OnRowClick) => {
md.selected = row;
md.internal.action_should_refresh = true;
md.tab.active = "detail";
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
    },
    opt__selected: {
      mode: "raw",
      value: `\
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
    },
    gen_fields: {
      mode: "raw",
      value: `${JSON.stringify(arg.fields)}`,
    },
    child: {
      mode: "jsx",
      value: createItem({
        name: "halo",
        childs: [],
      }),
    },
  };
  const tablelist: any = {
    type: "item",
    name: "item",
    component: {
      id: "567d5362-2cc8-4ca5-a531-f771a5c866c2",
      props,
    },
  };
  generateTableList(
    async (props: any) => {},
    props,
    tablelist,
    { mode: "table" },
    false
  );
  tab_master?.edit.setProp("breadcrumb", {
    mode: "raw",
    value: `\
    () => {
      return [
        { label: "List ${formatName(arg.table)}" },
      ] as BreadItem[];
    };
    type BreadItem = {
      label: React.ReactNode;
      url?: string;
      onClick?: () => void;
    }
    `
  })
  tab_master?.edit.setChilds([ {
    type: "item",
    name: "item",
    component: {
      id: "567d5362-2cc8-4ca5-a531-f771a5c866c2",
      props,
    },
  }]);
};
