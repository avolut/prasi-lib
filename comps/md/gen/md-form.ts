import { formatName } from "lib/comps/form/gen/fields";
import { generateForm } from "lib/comps/form/gen/gen-form";
import { createItem } from "lib/gen/utils";
import get from "lodash.get";

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
    deps: {
      mode: "raw",
      value: `({ md: typeof md !== "undefined" ? md : undefined })`,
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
  const raw_new_item: any = {
    type: "item",
    name: "item",
    component: {
      id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
      props,
    },
  };

  let cur_item = (
    item.edit.childs
      .find((e) => e.name.includes("child"))
      ?.edit?.childs?.find((e) => e.name === "tab")?.component?.props as any
  )?.child?.content?.childs?.[0];

  if (cur_item) {
    const new_item = createItem(raw_new_item) as IItem;
    for (const [k, v] of Object.entries(new_item.component?.props || {})) {
      if (cur_item.component) {
        const prop = v as any;
        if (prop.meta.type !== "content-element") {
          cur_item.component.props[k] = v;
        }
      }
    }
  } else {
    cur_item = raw_new_item;
  }

  generateForm(async (props: any) => {}, props, cur_item, false, true);

  tab_detail?.edit.setProp("breadcrumb", {
    mode: "raw",
    value: `\
() => {
  const breads: BreadItem[] = [
    {
      label: md.title || "List ${formatName(arg.table)}",
      onClick: () => {
        md.selected = null;
        md.tab.active = "master";
        md.params.apply();
        md.render();
      },
    },
  ];

  if (isEditor) {
    breads.push({ label: "Add New" });
  } else {
    if (
      md.selected &&
      typeof md.selected === "object"
    ) {
      if (Object.keys(md.selected).length === 0){
        breads.push({ label: "Add New" });
      } else {
        breads.push({ label: guessLabel(md.selected) || "Detail" });
      }
    }
  }

  return breads;
};

type BreadItem = {
  label: any;
  url?: string;
  onClick?: () => void;
}
`,
  });

  tab_detail?.edit.setChilds([
    {
      type: "item",
      name: "item",
      component: {
        id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
        props,
      },
    },
  ]);
};
