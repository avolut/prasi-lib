import get from "lodash.get";
import { GenMasterDetailArg, codeBuild } from "./utils";
import { createItem, formatName } from "../utils";
import { gen_form } from "../gen_form/gen_form";

export const genForm = async (arg: GenMasterDetailArg, data: any) => {
  for (const c of get(data, "child.content.childs") || []) {
    if (c.component?.id === "cb52075a-14ab-455a-9847-6f1d929a2a73") {
      const res = await codeBuild({
        breadcrumb: `\
async () => {
  const breads: BreadItem[] = [
    {
      label: "List ${formatName(arg.gen_table)}",
      onClick: () => {
        md.selected = null;
        md.internal.action_should_refresh = true;
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
        breads.push({ label: "Edit" });
      }
    }
  }

  return breads;
};

type BreadItem = {
  label: React.ReactNode;
  url?: string;
  onClick?: () => void;
}
      `,
        actions: `\
async () => {
  return [
    {
      action: "delete",
    },
    {
      label: "Save",
      action: "save",
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
        on_init: `\
async ({ submit, reload }: Init) => {
  const tab = md.childs[md.tab.active];
  if (tab) {
    const actions = await getProp(tab.internal, "actions", { md });
    if (Array.isArray(actions)) {
      const save_btn = actions 
          .filter((e) => e)
          .find((e) => e.action === "save");
      if (save_btn) {
        save_btn.onClick = async () => {
          await submit();
        };
        md.actions = actions;
        md.render();
      }
    }
  }
};

type Init = { submit: () => Promise<boolean>; reload: () => void }
`,
      });
      const comp = createItem({
        component: {
          id: "cb52075a-14ab-455a-9847-6f1d929a2a73",
          props: {
            breadcrumb: res.breadcrumb,
            actions: res.actions,
            name: "detail",
            label: "Detail",
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
            id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
            props: {
              name: arg.gen_table,
              label: formatName(arg.gen_table),
              gen_table: arg.gen_table,
              gen_fields: [JSON.stringify(arg.gen_fields)],
              on_init: res.on_init,
              on_load: "",
              on_submit: "",
              generate: "y",
              body: {
                childs: [],
              },
            },
          },
        })
      );

      const data = childs[0].component.props;
      const modify = async (props: any) => {};
      await gen_form(modify, data);
    }
  }
};
