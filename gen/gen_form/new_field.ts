import { createId } from "@paralleldrive/cuid2";
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

export const newField = (arg: GFCol) => {
  const childs = [];

  let type = "text";
  if (["int", "string"].includes(arg.type)) {
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
  } else if (["has-many", "has-one"].includes(arg.type)) {
    type = "relation";
    childs.push(
      createItem({
        component: {
          id: "69263ca0-61a1-4899-ad5f-059ac12b94d1",
          props: {
            type: arg.type,
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
