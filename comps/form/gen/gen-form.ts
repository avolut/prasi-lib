import { createId } from "@paralleldrive/cuid2";
import { createItem, parseGenField } from "lib/gen/utils";
import { set } from "lib/utils/set";
import get from "lodash.get";
import { generateSelect } from "../../md/gen/md-select";
import { newField } from "./fields";
import { get_rel_many } from "./get_rel_many";
import { on_load } from "./on_load";
import { genFormOnLoad } from "./gen-form/on-load";
import { genFormOnSubmit } from "./gen-form/on-submit";
import { genFormOnInit } from "./gen-form/on-init";
import { genFormSubmit } from "./gen-form/submit";
import { walkGenForm } from "./walker";

export const generateForm = async (
  _: any,
  data: any,
  item: PrasiItem,
  commit: boolean,
  _is_md?: boolean
) => {
  let table = "" as string;
  try {
    table = eval(data.gen__table.value);
  } catch (e) {
    table = data.gen__table.value;
  }
  const raw_fields = JSON.parse(data.gen__fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  let pk = "";
  let pks: Record<string, string> = {};
  const fields = parseGenField(raw_fields);
  const res = generateSelect(fields);
  const rel_many = get_rel_many(fields);
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  let is_md = !!_is_md;
  if (typeof _is_md === "undefined") {
    if (
      item.edit.parent?.item.edit.parent?.item.component?.id ===
      "cb52075a-14ab-455a-9847-6f1d929a2a73"
    ) {
      is_md = true;
    }
  }

  if (pk) {
    const gen_form_args = { result, pk, pks, table, select, is_md, rel_many };
    if (data["on_load"]) {
      genFormOnLoad(gen_form_args);
    }
    if (data["on_submit"]) {
      genFormOnSubmit(gen_form_args);
    }
    if (typeof is_md === "boolean" && is_md) {
      genFormOnInit(gen_form_args);
    }
    const child_fields = [];
    for (const item of fields.filter((e) => !e.is_pk)) {
      let value = [] as Array<string>;
      if (["has-one", "has-many"].includes(item.type)) {
        value = get(item, "value.checked") as any;
      }
      const field = await newField(
        item,
        { parent_table: table, value, is_from_table_edit: false },
        true
      );
      child_fields.push(field);
    }
    let submit = null;
    if (typeof is_md === "boolean" && !is_md)
      submit = genFormSubmit(gen_form_args);

    const body_prop = {
      adv: {
        js: "<div\n  {...props}\n  className={cx(\n    props.className,\n    css`\n    align-content: start;`,\n  )}\n>\n  {children}\n</div>",
        jsBuilt:
          'render(/* @__PURE__ */ React.createElement(\n  "div",\n  {\n    ...props,\n    className: cx(\n      props.className,\n      css`\n    align-content: start;`\n    )\n  },\n  children\n));\n',
      },
      dim: {
        h: "full",
        w: "full",
      },
      layout: {
        dir: "row",
        gap: 0,
        wrap: "flex-wrap",
        align: "top-left",
      },
    };
    const existing_childs = (
      (item.component?.props.body as any)?.content as IItem
    )?.childs;

    let child_body = createItem({
      name: "item",
      ...body_prop,
      childs: [
        createItem({
          adv: {
            js: '<div {...props} className={cx(props.className, "form-fields")}>\n  {children}\n</div>',
            jsBuilt:
              'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "form-fields") }, children));\n',
          },
          dim: {
            w: "full",
            h: "full",
            wUnit: "px",
            hUnit: "px",
          },
          name: "fields",
          layout: {
            dir: "row",
            align: "top-left",
            gap: 0,
            wrap: "flex-wrap",
          },
          childs: child_fields,
        }),
        submit,
      ].filter((e) => e),
    });

    if (Array.isArray(existing_childs) && existing_childs.length > 0) {
      walkGenForm(child_body, existing_childs as any);
    }

    if (commit) {
      Object.keys(result).map((e) => {
        item.edit.setProp(e, result[e]);
      });
      item.edit.setProp("body", {
        mode: "jsx",
        value: child_body,
      });
      await item.edit.commit();
    } else {
      set(data, "body.value", { ...data.body?.value, ...body_prop });
      set(data, "body.value.childs", child_body.childs);
      Object.keys(result).map((e) => {
        set(data, e, result[e]);
      });
      return;
    }
  }
};
