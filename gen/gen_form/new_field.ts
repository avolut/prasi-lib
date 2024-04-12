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
  const item = createItem({
    component: {
      id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
      props: {
        name: arg.name,
        label: formatName(arg.name),
        child: {
          childs: [
            createItem({
              component: {
                id: "ca7ac237-8f22-4492-bb9d-4b715b1f5c25",
                props: {},
              },
            }),
          ],
        },
      },
    },
  });
  return item;
};
