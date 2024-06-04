import { createItem } from "lib/gen/utils";
import get from "lodash.get";
import { generateTableList } from "./gen-table-list";
import { generateForm } from "lib/comps/form/gen/gen-form";

export const generateMDForm = async (
  arg: { item: PrasiItem; table: string; fields: any },
  data: any,
  commit: boolean
) => {
  const item = arg.item;
  const tab_detail = item.edit.childs[0].edit.childs.find(
    (e) => get(e, "component.id") === "cb52075a-14ab-455a-9847-6f1d929a2a73"
  );
  const props: Record<string, PropVal> = {
    gen__table: {
      mode: "string",
      value: arg.table,
    },
    name: {
      mode: "string",
      value: arg.table,
    },
    gen__fields: {
      mode: "raw",
      value: `${JSON.stringify(arg.fields)}`,
    },
    on_load: {
      mode: "string",
      value: "",
    },
    on_submit: {
      mode: "string",
      value: "",
    },
    body: {
      mode: "jsx",
      value: createItem({
        name: "item",
        childs: [],
      }),
    },
  };
  const tablelist: any = {
    type: "item",
    name: "item",
    component: {
      id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
      props,
    },
  };
  console.log({
    props,
    tablelist,
    false: false
  })
  generateForm(
    async (props: any) => {},
    props,
    tablelist,
    false
  );
  console.clear();
  console.log({
    type: "item",
    name: "item",
    component: {
      id: "567d5362-2cc8-4ca5-a531-f771a5c866c2",
      props,
    },
  })
  tab_detail?.edit.setChilds([ {
    type: "item",
    name: "item",
    component: {
      id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
      props,
    },
  }]);
};
