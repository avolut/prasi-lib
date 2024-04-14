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
  return createItem({
    name: arg.name,
    adv: {
      js: `\
<div {...props} className={cx(props.className, "")}>
  {item["${arg.name}"]}
</div>`,
      jsBuilt: `render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }), item["${arg.name}"]));`,
    },
    dim: {
      h: "full",
      w: "fit",
    },
    padding: {
      l: 0,
      b: 0,
      t: 0,
      r: 5,
    },
    layout: {
      dir: "row",
      align: "left",
      gap: 0,
      wrap: "flex-nowrap",
    },
  });
};
