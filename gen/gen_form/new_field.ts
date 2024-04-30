import { createId } from "@paralleldrive/cuid2";
import { gen_relation } from "../gen_relation/gen_relation";
import { GFCol, createItem, formatName } from "../utils";
export const newItem = (component: {
  id: string;
  props: Record<string, string>;
}) => {
  return {
    id: createId(),
    name: "new_item",
    type: "item",
    dim: { w: "full", h: "full" },
    childs: [],
    adv: {
      css: "",
    },
    component: component,
  };
};

export type NewFieldArg = {
  name: string;
  label: string;
  type: "relation" | "text";
  required: boolean;
  relation?: {
    table: string;
    fields: string[];
  };
};

export const newField = async (arg: GFCol, opt: { parent_table: string }) => {
  const childs = [];

  let type = "text";
  if (["int", "string", "text"].includes(arg.type)) {
    childs.push(
      createItem({
        component: {
          id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25",
          props: {
            type: arg.type === "int" ? "number" : "text",
          },
        },
      })
    );
  } else if (["has-many", "has-one"].includes(arg.type) && arg.relation) {
    type = "relation";
    const value = JSON.stringify(
      arg.relation.fields.map((e) => {
        if (e.relation) {
          const rel = { ...e };
          const fields = e.relation.fields;
          delete (e as any).relation.fields;
          return {
            value: JSON.stringify(e),
            checked: fields.map((e) => JSON.stringify(e)),
          };
        } else {
          return JSON.stringify(e);
        }
      })
    );
    const item = createItem({
      component: {
        id: "69263ca0-61a1-4899-ad5f-059ac12b94d1",
        props: {
          type: arg.type,
          on_load: [
            `async () => {
            return { items: [], pk: "" };
          }`,
          ],
          label: [`() => {}`],
          gen_table: arg.relation.to.table,
          gen_fields: [value, value],
          has_many_from:
            arg.type === "has-many" ? arg.relation.from.table : undefined,
          has_many_list: arg.type === "has-many" ? [`null`] : undefined,
          child: {},
        },
      },
    });
    await gen_relation(() => {}, item.component.props, {
      id_parent: "",
      type: arg.type as any,
      parent_table: opt.parent_table,
    });
    childs.push(item);
  } else {
    // type not found,
    console.warn("Type not found", type);
    type = "text";
    childs.push(
      createItem({
        component: {
          id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25",
          props: {
            type: "text",
          },
        },
      })
    );
  }

  const item = createItem({
    component: {
      id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
      props: {
        name: arg.name,
        label: formatName(arg.name),
        type,
        child: {
          childs,
        },
      },
    },
  });
  return item;
};
