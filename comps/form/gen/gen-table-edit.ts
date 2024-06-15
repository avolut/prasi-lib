import { createId } from "@paralleldrive/cuid2";
import { generateSelect } from "lib/comps/md/gen/md-select";
import { createItem, parseGenField } from "lib/gen/utils";
import get from "lodash.get";
import { formatName, newField } from "./fields";

export const genTableEdit = async (
  item: PrasiItem,
  data: any,
  commit: boolean
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
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  const childs = [] as Array<any>;
  let first = true;
  await Promise.all(
    fields
      .map(async (e, idx) => {
        if (e.is_pk) return;
        let value = [] as Array<string>;
        if (["has-one", "has-many"].includes(e.type)) {
          value = get(e, "value.checked") as any;
        }
        const field = await newField(
          e,
          {
            parent_table: table,
            value,
            on_change: `() => { ext_fm.change(); }`,
          },
          false
        );
        let tree_depth = "";
        let tree_depth_built = "";
        if (first) {
          tree_depth = `tree_depth={col.depth}`;
          tree_depth_built = `tree_depth:col.depth`;
          first = false;
        }
        childs.push({
          component: {
            id: "297023a4-d552-464a-971d-f40dcd940b77",
            props: {
              name: e.name,
              title: formatName(e.name),
              child: createItem({
                childs: [field],
              }),
            },
          },
        });
      })
      .filter((e) => e)
  );
  childs.push({
    component: {
      id: "297023a4-d552-464a-971d-f40dcd940b77",
      props: {
        name: "option",
        title: "",
        child: {
          id: createId(),
          name: "option",
          type: "item",
          childs: [
            {
              id: createId(),
              adv: { css: "" },
              dim: { h: "fit", w: "fit" },
              name: "info",
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
                  script: {},
                  component: {
                    id: "a15d152d-0118-408f-89f1-f6b2dfbd2e05",
                    props: {
                      size: {
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
                              adv: {
                                js: '<div {...props} className={cx(props.className, "")}>\n  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="m8.93 6.588l-2.29.287l-.082.38l.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319c.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246c-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0"/></svg>\n</div>',
                                css: "",
                                jsBuilt:
                                  'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 16 16" }, /* @__PURE__ */ React.createElement("path", { fill: "currentColor", d: "m8.93 6.588l-2.29.287l-.082.38l.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319c.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246c-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0a1 1 0 0 1 2 0" }))));\n',
                              },
                              dim: { h: "full", w: "full" },
                              html: "submit",
                              name: "new_text",
                              text: "",
                              type: "text",
                              layout: {
                                dir: "col",
                                gap: 0,
                                align: "left",
                              },
                              script: {},
                            },
                          ],
                          hidden: false,
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
                        value: '"outline"',
                        valueBuilt: '"outline"',
                      },
                      on_click: {
                        idx: 1,
                        meta: { type: "text" },
                        name: "prop_1",
                        type: "string",
                        value:
                          "(e) => {\n  e.preventDefault();\n  e.stopPropagation();\n}",
                        valueBuilt:
                          " (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n};\n",
                      },
                    },
                    ref_ids: {},
                  },
                },
              ],
            },
            {
              id: createId(),
              adv: { css: "" },
              dim: { h: "fit", w: "fit" },
              name: "remove",
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
                  mobile: { linktag: {} },
                  script: {},
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
                              adv: {
                                js: '<div {...props} className={cx(props.className, "")}>\n  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" /><path fill="currentColor" stroke="currentColor" strokeLinecap="round" stroke-miterlimit="10" strokeWidth="32" d="M80 112h352" /><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224" /></svg>\n</div>',
                                css: "",
                                jsBuilt:
                                  'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 512 512" }, /* @__PURE__ */ React.createElement("path", { fill: "none", stroke: "currentColor", "strokeLinecap": "round", "strokeLinejoin": "round", "strokeWidth": "32", d: "m112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320" }), /* @__PURE__ */ React.createElement("path", { fill: "currentColor", stroke: "currentColor", "strokeLinecap": "round", "stroke-miterlimit": "10", "strokeWidth": "32", d: "M80 112h352" }), /* @__PURE__ */ React.createElement("path", { fill: "none", stroke: "currentColor", "strokeLinecap": "round", "strokeLinejoin": "round", "strokeWidth": "32", d: "M192 112V72h0a23.93 23.93 0 0 1 24-24h80a23.93 23.93 0 0 1 24 24h0v40m-64 64v224m-72-224l8 224m136-224l-8 224" }))));\n',
                              },
                              dim: { h: "full", w: "full" },
                              html: "submit",
                              name: "new_text",
                              text: "",
                              type: "text",
                              layout: { dir: "col", gap: 0, align: "left" },
                              script: {},
                            },
                          ],
                          hidden: false,
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
                        value: '"destructive"',
                        valueBuilt: '"destructive"',
                      },
                      on_click: {
                        idx: 1,
                        meta: { type: "text" },
                        name: "prop_1",
                        type: "string",
                        value:
                          '(e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  if (typeof ext_fm === "object") {\n    ext_fm.remove();\n  }\n}',
                        valueBuilt:
                          ' (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  if (typeof ext_fm === "object") {\n    ext_fm.remove();\n  }\n};\n',
                      },
                    },
                    ref_ids: {},
                  },
                },
              ],
            },
          ],
          layout: {
            dir: "row",
            gap: 10,
            wrap: "flex-nowrap",
            align: "left",
          },
          padding: { b: 0, l: 10, r: 10, t: 0 },
        },
      },
    },
  });
  const child_sub_name = createItem({
    name: "tbl-col",
    childs: childs,
  });
  if (commit) {
    item.edit.setProp("bottom", {
      mode: "jsx",
      value: {
        id: createId(),
        name: "btn-submit",
        type: "item",
        edit: null as any,
        padding: { b: 10, l: 10, r: 10, t: 0 },
        childs: [
          {
            id: createId(),
            name: "button",
            type: "item",
            component: {
              id: "a15d152d-0118-408f-89f1-f6b2dfbd2e05",
              props: {
                on_click: {
                  type: "raw",
                  value: `\
                  (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (typeof fm === "object") {
                      const value = fm.data[name] || [];
                      if (Array.isArray(value)) {
                        value.push({});
                        fm.render();
                      }else{
                        value = [];
                        fm.render();
                      }
                    }
                  }
                  `,
                },
              },
            },
            childs: [],
          },
        ],
      },
    });
    item.edit.setProp("child", {
      mode: "jsx",
      value: {
        id: createId(),
        name: "item",
        type: "item",
        edit: null as any,
        childs: [child_sub_name],
      },
    });
    await item.edit.commit();
  } else {
    const result = [child_sub_name] || [];
    const option = {
      id: createId(),
      name: "bottom",
      padding: {
        b: 10,
        l: 10,
        r: 10,
        t: 7,
      },
      border: {
        style: "solid",
        stroke: {
          t: 1,
        },
        color: "#e6e6e6",
      },
      type: "item",
      childs: [
        {
          id: createId(),
          name: "wrapper",
          type: "item",
          dim: {
            h: "fit",
            w: "fit",
          },
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
                      ' (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  if (typeof ext_fm === "object") {\n     ext_fm.add();\n  }\n};\n',
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
                              id: "vxmz8pt05cm5biygbunoxk4b",
                              adv: {
                                js: '<div {...props} className={cx(props.className, "")}>\n  <svg\n    xmlns="http://www.w3.org/2000/svg"\n    width="20"\n    height="20"\n    viewBox="0 0 24 24"\n  >\n    <path\n      fill="currentColor"\n      d="M11.883 3.007L12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3z"\n    />\n  </svg>\n</div>',
                                css: "",
                                jsBuilt:
                                  'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement(\n  "svg",\n  {\n    xmlns: "http://www.w3.org/2000/svg",\n    width: "20",\n    height: "20",\n    viewBox: "0 0 24 24"\n  },\n  /* @__PURE__ */ React.createElement(\n    "path",\n    {\n      fill: "currentColor",\n      d: "M11.883 3.007L12 3a1 1 0 0 1 .993.883L13 4v7h7a1 1 0 0 1 .993.883L21 12a1 1 0 0 1-.883.993L20 13h-7v7a1 1 0 0 1-.883.993L12 21a1 1 0 0 1-.993-.883L11 20v-7H4a1 1 0 0 1-.993-.883L3 12a1 1 0 0 1 .883-.993L4 11h7V4a1 1 0 0 1 .883-.993L12 3z"\n    }\n  )\n)));\n',
                              },
                              dim: { h: "full", w: "full" },
                              html: "aadd",
                              name: "new_text",
                              text: "",
                              type: "text",
                              layout: { dir: "col", gap: 0, align: "left" },
                              script: {},
                            },
                            {
                              id: createId(),
                              adv: {
                                js: '<div {...props} className={cx(props.className, "")}>\n  Add\n</div>',
                                css: "",
                                jsBuilt:
                                  'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, "Add"));\n',
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
                            gap: 5,
                            wrap: "flex-nowrap",
                            align: "left",
                          },
                        },
                      ],
                      hidden: false,
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
                      '(e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  if (typeof ext_fm === "object") {\n     ext_fm.add();\n     }\n}',
                    valueBuilt:
                      ' (e) => {\n  e.preventDefault();\n  e.stopPropagation();\n  if (typeof ext_fm === "object") {\n       ext_fm.add();\n  }\n};\n',
                  },
                },
                ref_ids: {},
              },
            },
          ],
        },
      ],
    };
    result.push(option);
    return result;
  }
};
