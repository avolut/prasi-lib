import { createId } from "@paralleldrive/cuid2";
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

export const newField = (arg: NewFieldArg) => {
  return {
    id: createId(),
    adv: {
      js: '<div\n  {...props}\n  className={cx(\n    "field",\n    css`\n width:100%;\n border-bottom:1px solid white;\n padding: 10px;`,\n  )}\n>\n  <Field\n    label={label}\n    name={name}\n    type={type}\n    selection={selection}\n    label_alt={label_alt}\n    options={options}\n    on_change={on_change}\n    form={form}\n    custom={custom}\n    PassProp={PassProp}\n    required={required}\n    child={child}\n    slider={slider}\n    placeholder={placeholder}\n    suffix={suffix}\n  ></Field>\n</div>',
      css: "",
      jsBuilt:
        'render(/* @__PURE__ */ React.createElement(\n  "div",\n  {\n    ...props,\n    className: cx(\n      "field",\n      css`\n width:100%;\n border-bottom:1px solid white;\n padding: 10px;`\n    )\n  },\n  /* @__PURE__ */ React.createElement(\n    Field,\n    {\n      label,\n      name,\n      type,\n      selection,\n      label_alt,\n      options,\n      on_change,\n      form,\n      custom,\n      PassProp,\n      required,\n      child,\n      slider,\n      placeholder,\n      suffix\n    }\n  )\n));\n',
    },
    dim: {
      h: "full",
      w: "full",
    },
    name: "field",
    type: "item",
    childs: [],
    mobile: {
      dim: {
        h: "full",
        w: "full",
        hUnit: "px",
      },
      border: {
        color: "#ba2f2f",
        style: "solid",
        stroke: {
          b: 1,
        },
      },
      padding: {
        b: 5,
        l: 15,
        r: 15,
        t: 5,
      },
    },
    script: {},
    component: {
      id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
      props: {
        name: {
          idx: 0,
          meta: {
            type: "text",
          },
          name: "prop_1",
          type: "string",
          value: "`" + arg.name + "`",
          is_name: true,
          valueBuilt: "`" + arg.name + "`",
        },
        type: {
          idx: 4,
          meta: {
            type: "option",
            options:
              '[\n  "text",\n  "number",\n  "textarea",\n  "slider",\n  "dropdown",\n  "password",\n  "radio",\n  "date",\n  "datetime",\n  "money",\n  "sub-link",\n]',
            option_mode: "dropdown",
            optionsBuilt:
              ' [\n  "text",\n  "number",\n  "textarea",\n  "slider",\n  "dropdown",\n  "password",\n  "radio",\n  "date",\n  "datetime",\n  "money",\n  "sub-link"\n];\n',
          },
          name: "prop_3",
          type: "string",
          value: '"' + arg.type + '"',
          content: {
            id: "vmic2917cg7j005xd1p54h71",
            adv: {
              css: "",
            },
            dim: {
              h: "full",
              w: "full",
            },
            name: "type",
            type: "item",
            childs: [],
          },
          is_name: false,
          valueBuilt: '"' + arg.type + '"',
        },
        child: {
          idx: 11,
          meta: {
            type: "content-element",
          },
          name: "prop_11",
          type: "string",
          value: '"hello"',
          content: {
            id: "jzr2ns0pgqhkuo5yfvqenpkc",
            adv: {
              css: "",
            },
            dim: {
              h: "full",
              w: "full",
            },
            name: "child",
            type: "item",
            childs: [],
          },
          is_name: false,
          typings:
            'const typings = {\n  data: "any",\n  is_active: "boolean",\n  item_click: "() => void",\n  current_name: "string",\n  option_item: "{value: string, label: string}",\n  modify: `(field_name: string, opt: {\n    value?: any,\n  }) => void`,\n}',
          visible: 'type === "radio"',
          valueBuilt: '"hello"',
        },
        label: {
          idx: 1,
          meta: {
            type: "text",
          },
          name: "prop_1",
          type: "string",
          value: "`" + arg.label + "`",
          is_name: false,
          valueBuilt: "`" + arg.label + "`",
        },
        custom: {
          idx: 8,
          meta: {
            type: "option",
            options:
              '[\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  },\n]\n',
            option_mode: "button",
            optionsBuilt:
              ' [\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  }\n];\n',
          },
          name: "prop_11",
          type: "string",
          value: '"n"',
          is_name: false,
          valueBuilt: ' "n";\n',
        },
        slider: {
          idx: 9,
          meta: {
            type: "text",
          },
          name: "prop_9",
          type: "string",
          value:
            'async () => {\n  return {\n    step: 1,\n    min: { value: 0, label: "Start" },\n    max: { value: 100, label: "End" },\n  };\n}',
          is_name: false,
          visible: "type === 'slider'",
          valueBuilt:
            ' async () => {\n  return {\n    step: 1,\n    min: { value: 0, label: "Start" },\n    max: { value: 100, label: "End" }\n  };\n};\n',
        },
        suffix: {
          idx: 12,
          meta: {
            type: "text",
          },
          name: "prop_11",
          type: "string",
          value: '""',
          visible: '["number", "text", "password"].includes(type)',
          valueBuilt: ' "";\n',
        },
        options: {
          idx: 6,
          meta: {
            type: "text",
          },
          name: "prop_5",
          type: "string",
          value:
            'async () => {\r\n  return [\r\n    {\r\n      value: "sample1",\r\n      label: "sample1",\r\n    },\r\n    {\r\n      value: "sample2",\r\n      label: "sample2",\r\n    },\r\n  ];\r\n}',
          is_name: false,
          visible: "['button-options', 'dropdown', 'radio'].includes(type)",
          valueBuilt:
            ' async () => {\n  return [\n    {\n      value: "sample1",\n      label: "sample1"\n    },\n    {\n      value: "sample2",\n      label: "sample2"\n    }\n  ];\n};\n',
        },
        required: {
          idx: 7,
          meta: {
            type: "option",
            options:
              '[\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  },\n]',
            optionsBuilt:
              ' [\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  }\n];\n',
          },
          name: "prop_7",
          type: "string",
          value: "`" + (arg.required ? "y" : "n") + "`",
          is_name: false,
          valueBuilt: "`" + (arg.required ? "y" : "n") + "`",
        },
        label_alt: {
          idx: 2,
          meta: {
            type: "text",
          },
          name: "prop_10",
          type: "string",
          value: '""',
          is_name: false,
          valueBuilt: ' "";\n',
        },
        on_change: {
          idx: 10,
          meta: {
            type: "text",
          },
          name: "prop_11",
          type: "string",
          value: "({ value }) => {}",
          is_name: false,
          valueBuilt: " ({ value }) => {\n};\n",
        },
        selection: {
          idx: 5,
          meta: {
            type: "option",
            options: '["single", "multi"]',
            optionsBuilt: ' ["single", "multi"];\n',
          },
          name: "prop_11",
          type: "string",
          value: '"single"',
          visible: 'type === "radio"',
          valueBuilt: ' "single";\n',
        },
        placeholder: {
          idx: 3,
          meta: {
            type: "text",
          },
          name: "prop_11",
          type: "string",
          value: '""',
          visible: '["text", "number", "password"].includes(type)',
          valueBuilt: ' "";\n',
        },
        rel_query: {
          idx: 11,
          name: "prop_11",
          type: "string",
          value:
            'async () => {\n  return {\n    orderBy: {\n      regional: "asc",\n    },\n  };\n}',
          valueBuilt:
            ' async () => {\n  return {\n    orderBy: {\n      regional: "asc"\n    }\n  };\n};\n',
          meta: {
            type: "text",
          },
        },
        prop_11: {
          idx: 11,
          name: "prop_11",
          type: "string",
          value: '"hello"',
          valueBuilt: '"hello"',
          meta: {
            type: "text",
          },
        },
        rel_table: {
          idx: 11,
          name: "prop_11",
          type: "string",
          value: '"' + (arg.relation?.table || "") + '"',
          valueBuilt: '"' + (arg.relation?.table || "") + '"',
          meta: {
            type: "text",
          },
          content: {
            id: "id7ai9balb0k60kduqrkmyzr",
            name: "rel_table",
            type: "item",
            dim: {
              w: "full",
              h: "full",
            },
            childs: [],
            adv: {
              css: "",
            },
          },
        },
        rel_fields: {
          idx: 11,
          name: "prop_11",
          type: "string",
          value: JSON.stringify(arg.relation?.fields || []),
          valueBuilt: JSON.stringify(arg.relation?.fields || []),
          meta: {
            type: "option",
          },
        },
      },
      ref_ids: {},
      instances: {},
    },
  };
};
