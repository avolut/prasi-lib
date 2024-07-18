import { createId } from "@paralleldrive/cuid2";
import { createItem, parseGenField } from "lib/gen/utils";
import { set } from "lib/utils/set";
import get from "lodash.get";
import { generateSelect } from "../../md/gen/md-select";
import { newField } from "./fields";
import { get_rel_many } from "./get_rel_many";
import { on_load } from "./on_load";

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
    if (data["on_load"]) {
      result.on_load = {
        mode: "raw",
        value: on_load({
          pk,
          table,
          select,
          pks,
          opt: is_md
            ? {
                after_load: `
      if (typeof md === "object") {
        opt.fm.status = "ready";
        if (item) {
          for (const [k,v] of Object.entries(item)) {
            md.selected[k] = v;
          }
        }
        md.header.render();
        md.render();
      }
`,
                is_md: true,
              }
            : { is_md },
        }),
      };
    }
    if (data["on_submit"]) {
      result.on_submit = {
        mode: "raw",
        value: `\
async ({ form, error, fm }: IForm) => {
  let result = false;
  try {${
    is_md &&
    `\
    if (typeof md !== "undefined") {
      fm.status = "saving";
      md.render();
    }`
  }
    const data = { ...form };
    const record = {} as Record<string, any>;

    const relation_ref = ${JSON.stringify(rel_many)};
    const has_many = [] as Array<{
      table: string;
      data: Array<any>;
      fk: string;
    }>;


    // validasi
    fm.error.clear();
    for (const [k, field] of Object.entries(fm.fields)) {
      validateField(field, fm);
    }
${
  is_md &&
  `\
    if (fm.error.list.length > 0) {
      if (typeof md !== "undefined") {
        fm.status = "ready";
        md.render();
      }
      return false;
    }`
}

    call_prasi_events("form", "before_save", [fm, data]);

    // pisahkan antara has_many dengan field biasa
    for (const [k, v] of Object.entries(data) as any) {
      if (Array.isArray(v)) {
        const rel =
          Array.isArray(relation_ref) && relation_ref.length
            ? relation_ref.find((e) => e.table === k)
            : null;
        if (rel) {
          has_many.push({
            table: k,
            data: v,
            fk: rel.fk,
          });
        }
      } else {
        record[k] = v;
      }
    }

    // prisma create / update ga boleh ada record.${pk}
    if (record) delete record.${pk};

    if (form.${pk}) {
      await db.${table}.update({
        where: {
          ${pk}: form.${pk},
        },
        data: {
          ...record,
        },
      });
    } else {
      const res = await db.${table}.create({
        //@ts-ignore
        data: {
          ...record,
        },
      });
      if (res) form.id = res.id;
    }

    if (has_many.length) {
      const exec_query_bulk = async (
        current: { table: string; data: Array<any>; fk: string },
        list: Array<{ table: string; data: Array<any>; fk: string }>,
        index: number,
      ) => {
        if (list.length) {
          const data = current.data.map((e) => {
            const record =  {
              ...e,
              ${table}: {
                connect: {
                  ${pk}: form.${pk},
                },
              },
            };

            call_prasi_events("form", "before_save", [fm, record]);

            return record;
          });
          await db._batch.upsert({
            table: current.table,
            where: {
              [current.fk]: form.${pk},
            },
            data: data,
            mode: "relation",
          } as any);

          if (list.length > 1) {
            try {
              index++;
              if (index <= list.length - 1) {
                await exec_query_bulk(list[index], list, index);
              }
            } catch (ex) {}
          }
        }
      };
      await exec_query_bulk(has_many[0], has_many, 0);
    }
    result = true;
  
    call_prasi_events("form", "after_save", [fm, data]);

    ${
      is_md &&
      `\
      if (typeof md !== "undefined") {
        fm.status = "ready";
        // kembali ke tabel
        setTimeout(() => {
          md.selected = null;
          md.tab.active = "master";
          md.internal.action_should_refresh = true;
          md.params.apply();
          md.render();
        }, 500);
      }`
    }
  } catch (e) {
    console.error(e);
    result = false;
  }

  return result;
};

type IForm = { form: any; error: Record<string, string>; fm: FMLocal }
`,
      };
    }
    if (typeof is_md === "boolean" && is_md) {
      result.on_init = {
        mode: "raw",
        value: `\
        ({ submit, reload, fm }: Init) => {
          // on init
          if (!isEditor) {
            if (typeof md === "object") {
              md.childs["form"] = {
                fm: fm
              };
            }
          }
        };
        
        type Init = { submit: () => Promise<boolean>; reload: () => void; fm: FMLocal }
        `,
      };
    }
    const child_fields = [];
    for (const item of fields.filter((e) => !e.is_pk)) {
      let value = [] as Array<string>;
      if (["has-one", "has-many"].includes(item.type)) {
        value = get(item, "value.checked") as any;
      }
      const field = await newField(item, { parent_table: table, value }, true);
      child_fields.push(field);
    }
    let submit = null;
    if (typeof is_md === "boolean" && !is_md)
      submit = {
        id: createId(),
        dim: { h: "fit", w: "full", hUnit: "px", wUnit: "px" },
        name: "submit",
        type: "item",
        childs: [
          {
            id: createId(),
            dim: { h: "fit", w: "fit", hUnit: "px", wUnit: "px" },
            name: "bottom",
            type: "item",
            childs: [
              {
                id: createId(),
                adv: {
                  js: '<Button\n  {...props}\n  onClick={(e) => {\n    console.log(isEditor);\n    if (!isEditor) on_click(e);\n  }}\n  variant={variant !== "primary" ? variant : undefined}\n  size={size !== "default" ? size : undefined}\n>\n  {label}\n</Button>',
                  css: "& {\n  display: flex;\n  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;\n\n  &:hover {\n    cursor: pointer;\n\n\n\n\n\n    // &.mobile {}\n    // &.desktop {}\n    // &:hover {}\n  }\n}",
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement(\n  Button,\n  {\n    ...props,\n    onClick: (e) => {\n      console.log(isEditor);\n      if (!isEditor)\n        on_click(e);\n    },\n    variant: variant !== "primary" ? variant : void 0,\n    size: size !== "default" ? size : void 0\n  },\n  label\n));\n',
                },
                dim: { h: "full", w: "full" },
                name: "button",
                type: "item",
                childs: [],
                mobile: { linktag: {} },
                script: {
                  props: {
                    size: { value: ' "default";\n' },
                    variant: { value: ' "primary";\n' },
                    on_click: {
                      value:
                        " (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  fm.submit();\n};\n",
                    },
                  },
                },
                component: {
                  id: "a15d152d-0118-408f-89f1-f6b2dfbd2e05",
                  props: {
                    size: {
                      idx: 5,
                      meta: {
                        type: "option",
                        options: '["default", "sm", "lg", "icon","nosize"]',
                        optionsBuilt:
                          ' ["default", "sm", "lg", "icon", "nosize"];\n',
                      },
                      name: "prop_5",
                      type: "string",
                      value: '"default"',
                      valueBuilt: ' "default";\n',
                    },
                    label: {
                      idx: 1,
                      meta: { type: "content-element" },
                      name: "prop_1",
                      type: "string",
                      value: '"hello"',
                      content: {
                        id: createId(),
                        adv: {
                          js: '<div {...props} className={cx(props.className, "")}>\n  {children}\n</div>',
                          css: "",
                          jsBuilt:
                            'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, children));\n',
                        },
                        dim: { h: "full", w: "full" },
                        name: "label",
                        type: "item",
                        childs: [
                          {
                            id: createId(),
                            name: "Wrapped",
                            type: "item",
                            childs: [
                              {
                                id: createId(),
                                adv: {
                                  js: '<div {...props} className={cx(props.className, "")}>\n  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2c0-1.886 0-2.828-.586-3.414C14.828 15 13.886 15 12 15h-1c-1.886 0-2.828 0-3.414.586C7 16.172 7 17.114 7 19v2" /><path strokeLinecap="round" d="M7 8h5" /><path d="M3 9c0-2.828 0-4.243.879-5.121C4.757 3 6.172 3 9 3h7.172c.408 0 .613 0 .796.076c.184.076.329.22.618.51l2.828 2.828c.29.29.434.434.51.618c.076.183.076.388.076.796V15c0 2.828 0 4.243-.879 5.121C19.243 21 17.828 21 15 21H9c-2.828 0-4.243 0-5.121-.879C3 19.243 3 17.828 3 15z" /></g></svg>\n</div>',
                                  css: "",
                                  jsBuilt:
                                    'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24" }, /* @__PURE__ */ React.createElement("g", { fill: "none", stroke: "currentColor", "strokeWidth": "2" }, /* @__PURE__ */ React.createElement("path", { d: "M16 21v-2c0-1.886 0-2.828-.586-3.414C14.828 15 13.886 15 12 15h-1c-1.886 0-2.828 0-3.414.586C7 16.172 7 17.114 7 19v2" }), /* @__PURE__ */ React.createElement("path", { "strokeLinecap": "round", d: "M7 8h5" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9c0-2.828 0-4.243.879-5.121C4.757 3 6.172 3 9 3h7.172c.408 0 .613 0 .796.076c.184.076.329.22.618.51l2.828 2.828c.29.29.434.434.51.618c.076.183.076.388.076.796V15c0 2.828 0 4.243-.879 5.121C19.243 21 17.828 21 15 21H9c-2.828 0-4.243 0-5.121-.879C3 19.243 3 17.828 3 15z" })))));\n',
                                },
                                dim: { h: "full", w: "full" },
                                html: "aadd",
                                name: "new_text",
                                text: "",
                                type: "text",
                                layout: { dir: "col", gap: 0, align: "center" },
                                script: {},
                              },
                              {
                                id: createId(),
                                adv: {
                                  js: '<div {...props} className={cx(props.className, "")}>\n  Save\n</div>',
                                  css: "",
                                  jsBuilt:
                                    'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, "Save"));\n',
                                },
                                dim: { h: "full", w: "full" },
                                name: "new_item",
                                type: "item",
                                childs: [],
                                script: {},
                              },
                            ],
                            layout: {
                              dir: "row",
                              gap: 10,
                              wrap: "flex-nowrap",
                              align: "top-left",
                            },
                          },
                        ],
                        hidden: false,
                        layout: {
                          dir: "col",
                          gap: 0,
                          wrap: "flex-nowrap",
                          align: "center",
                        },
                        script: {},
                      },
                      valueBuilt: '"hello"',
                    },
                    variant: {
                      idx: 3,
                      meta: {
                        type: "option",
                        options:
                          '["primary", "secondary", "outline", "ghost", "link", "destructive"]',
                        option_mode: "button",
                        optionsBuilt:
                          ' ["primary", "secondary", "outline", "ghost", "link", "destructive"];\n',
                      },
                      name: "prop_3",
                      type: "string",
                      value: '"primary"',
                      valueBuilt: ' "primary";\n',
                    },
                    on_click: {
                      idx: 1,
                      meta: { type: "text" },
                      name: "prop_1",
                      type: "string",
                      value:
                        "(e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  fm.submit();\n}",
                      valueBuilt:
                        " (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  fm.submit();\n};\n",
                    },
                  },
                },
              },
            ],
            layout: {
              dir: "col",
              gap: 0,
              wrap: "flex-nowrap",
              align: "center",
            },
          },
        ],
        padding: { b: 10, l: 10, r: 10, t: 10 },
      };
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
    if (commit) {
      Object.keys(result).map((e) => {
        item.edit.setProp(e, result[e]);
      });
      item.edit.setProp("body", {
        mode: "jsx",
        value: createItem({
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
                wrap: "flex-nowrap",
              },
              childs: child_fields,
            }),
            submit,
          ].filter((e) => e),
        }),
      });
      await item.edit.commit();
    } else {
      set(data, "body.value", { ...data.body?.value, ...body_prop });
      set(data, "body.value.childs", child_fields);
      Object.keys(result).map((e) => {
        set(data, e, result[e]);
      });
      return;
    }
  }
};
