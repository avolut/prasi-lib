import { createId } from "@paralleldrive/cuid2";

export const gen_detail = () => {
  const res = {
    id: createId(),
    name: "prop_3",
    type: "item",
    dim: {
      w: "full",
      h: "full",
    },
    childs: [
      {
        id: createId(),
        name: "detail",
        type: "item",
        dim: {
          w: "full",
          h: "full",
        },
        adv: {
          css: "",
          js: "",
          jsBuilt: "render();\n",
        },
        childs: [
          {
            id: createId(),
            name: "selected",
            type: "item",
            dim: {
              w: "full",
              h: "full",
            },
            adv: {
              css: "",
              js: `<>
  {(md.selected || isEditor) && (
    <div {...props} className={cx(props.className, "")}>
      {children}
    </div>
  )}
</>`,
              jsBuilt: `render(React.createElement(React.Fragment, null, (md.selected || isEditor) && (React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }), children))));`,
            },
            childs: [
              {
                id: createId(),
                adv: {
                  js: '<div {...props}>\n  <Local\n    name="form"\n    value={{\n      hook: null as any,\n    }}\n  >\n    {children}\n  </Local>\n</div>',
                  css: "",
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement("div", { ...props }, /* @__PURE__ */ React.createElement(\n  Local,\n  {\n    name: "form",\n    value: {\n      hook: null\n    }\n  },\n  children\n)));\n',
                },
                dim: {
                  h: "full",
                  w: "full",
                },
                name: "form",
                type: "item",
                childs: [
                  {
                    id: createId(),
                    adv: {
                      css: "",
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "jsx: body",
                    type: "item",
                    childs: [
                      {
                        id: createId(),
                        adv: {
                          css: "",
                        },
                        dim: {
                          h: "full",
                          w: "full",
                        },
                        name: "field",
                        type: "item",
                        childs: [],
                        script: {
                          props: {
                            name: {
                              value: '"hello"',
                            },
                            type: {
                              value: ' "text";\n',
                            },
                            label: {
                              value: '"hello"',
                            },
                          },
                        },
                        component: {
                          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
                          props: {
                            fill: {
                              idx: 11,
                              meta: {
                                type: "text",
                              },
                              name: "prop_11",
                              type: "string",
                              value: "`Haha`",
                              valueBuilt: "`Haha`",
                            },
                            name: {
                              idx: 1,
                              meta: {
                                type: "text",
                              },
                              name: "prop_1",
                              type: "string",
                              value: "`field_name`",
                              valueBuilt: "`field_name`",
                            },
                            type: {
                              idx: 3,
                              meta: {
                                type: "option",
                                options:
                                  '[\n  "text", "buttons", "date", "datetime"\n]',
                                optionsBuilt:
                                  ' [\n  "text",\n  "buttons",\n  "date",\n  "datetime"\n];\n',
                              },
                              name: "prop_3",
                              type: "string",
                              value: '"text"',
                              valueBuilt: '"text"',
                            },
                            label: {
                              idx: 1,
                              meta: {
                                type: "text",
                              },
                              name: "prop_1",
                              type: "string",
                              value: "`Name`",
                              valueBuilt: "`Name`",
                            },
                            title: {
                              idx: 7,
                              meta: {
                                type: "text",
                              },
                              name: "prop_7",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: ' "hello";\n',
                            },
                            custom: {
                              idx: 5,
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
                              value: '"y"',
                              valueBuilt: '"y"',
                            },
                            options: {
                              idx: 5,
                              meta: {
                                type: "text",
                              },
                              name: "prop_5",
                              type: "string",
                              value:
                                'async () => {\r\n  return [\r\n    {\r\n      value: "sample1",\r\n      label: "sample1",\r\n    },\r\n  ];\r\n}',
                              valueBuilt:
                                ' async () => {\n  return [\n    {\n      value: "sample1",\n      label: "sample1"\n    }\n  ];\n};\n',
                            },
                            required: {
                              idx: 7,
                              meta: {
                                type: "option",
                                options:
                                  '[\n  {\n    label: "yes",\n    value: "y",\n  },\n  {\n    label: "no",\n    value: "n",\n  },\n]   ',
                                optionsBuilt:
                                  ' [\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  }\n];\n',
                              },
                              name: "prop_7",
                              type: "string",
                              value: '"n"',
                              valueBuilt: ' "n";\n',
                            },
                            label_alt: {
                              idx: 2,
                              meta: {
                                type: "text",
                              },
                              name: "prop_10",
                              type: "string",
                              value: '""',
                              valueBuilt: ' "";\n',
                            },
                            on_change: {
                              idx: 11,
                              meta: {
                                type: "text",
                              },
                              name: "prop_11",
                              type: "string",
                              value: "({ value }) => {}",
                              valueBuilt: " ({ value }) => {\n};\n",
                            },
                            placeholder: {
                              idx: 3,
                              meta: {
                                type: "text",
                              },
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              visible:
                                '["text", "number", "password"].includes(type)',
                              valueBuilt: ' "";\n',
                            },
                            slider_options: {
                              idx: 9,
                              meta: {
                                type: "text",
                              },
                              name: "prop_9",
                              type: "string",
                              value:
                                'async () => {\n  return {\n    step: 1,\n    min: { value: 0, label: "Start" },\n    max: { value: 100, label: "End" },\n  };\n}',
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
                              value: '("")',
                              visible:
                                '["number", "text", "password"].includes(type)',
                              valueBuilt: ' "";\n',
                            },
                            rel_fields: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: "[]",
                              valueBuilt: " [];\n",
                              meta: {
                                type: "option",
                                option_mode: "checkbox",
                                options:
                                  "async () => {\n  const result: { label: string; value: string; options?: any[] }[] = [];\n  const fields = await db._schema.columns(rel_table);\n  for (const [k, v] of Object.entries(fields)) {\n    result.push({ value: k, label: k });\n  }\n\n  const rels = await db._schema.rels(rel_table);\n  for (const [k, v] of Object.entries(rels)) {\n    let options = [];\n    const fields = await db._schema.columns(v.to.table);\n    for (const [k, v] of Object.entries(fields)) {\n      options.push({ value: k, label: k });\n    }\n\n    result.push({ value: k, label: k, options });\n  }\n\n  return result;\n}",
                                optionsBuilt:
                                  " async () => {\n  const result = [];\n  const fields = await db._schema.columns(rel_table);\n  for (const [k, v] of Object.entries(fields)) {\n    result.push({ value: k, label: k });\n  }\n  const rels = await db._schema.rels(rel_table);\n  for (const [k, v] of Object.entries(rels)) {\n    let options = [];\n    const fields2 = await db._schema.columns(v.to.table);\n    for (const [k2, v2] of Object.entries(fields2)) {\n      options.push({ value: k2, label: k2 });\n    }\n    result.push({ value: k, label: k, options });\n  }\n  return result;\n};\n",
                              },
                              label: "fields",
                            },
                            rel_query: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: "async () => {\n  return {};\n}",
                              valueBuilt: " async () => {\n  return {};\n};\n",
                              meta: {
                                type: "text",
                              },
                              label: "query",
                            },
                          },
                          ref_ids: {},
                          instances: {
                            npj543t5rpwx932a153hsfyl: {
                              zmit41kbgkbqcsmm8aspp8zy:
                                "mo4m0rnyey4y6v7tlajod95l",
                            },
                          },
                        },
                        originalid: createId(),
                      },
                    ],
                  },
                  {
                    id: createId(),
                    adv: {
                      js: "<Form\n  on_init={on_init}\n  on_load={on_load}\n  form={form}\n  PassProp={PassProp}\n  body={body}\n  props={props}\n  layout={layout}\n  on_submit={on_submit}\n/>",
                      css: "",
                      jsBuilt:
                        "render(/* @__PURE__ */ React.createElement(\n  Form,\n  {\n    on_init,\n    on_load,\n    form,\n    PassProp,\n    body,\n    props,\n    layout,\n    on_submit\n  }\n));\n",
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "el",
                    type: "item",
                    childs: [],
                    mobile: {
                      dim: {
                        h: "fit",
                        w: "full",
                      },
                    },
                    script: {},
                  },
                ],
                script: {
                  local: {
                    end: 85,
                    name: "form",
                    start: 53,
                    value: "{hook: null as any}",
                  },
                },
                component: {
                  id: "c4e65c26-4f36-48aa-a5b3-0771feac082e",
                  props: {
                    generate: {
                      idx: 5,
                      name: "prop_6",
                      type: "string",
                      value: '"n"',
                      valueBuilt: '"n"',
                      meta: {
                        options:
                          '[\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  },\n] ',
                        optionsBuilt:
                          ' [\n  {\n    label: "yes",\n    value: "y"\n  },\n  {\n    label: "no",\n    value: "n"\n  }\n];\n',
                        type: "option",
                      },
                    },
                    gen_table: {
                      visible: "generate === 'y'",
                      idx: 6,
                      name: "prop_8",
                      type: "string",
                      value: '"m_aset"',
                      valueBuilt: '"m_aset"',
                      meta: {
                        options:
                          'async () => {\n  return (await db._schema.tables()).map((e) => ({\n    value: e,\n    label: e,\n    reload: ["gen_fields"],\n  }));\n}',
                        optionsBuilt:
                          ' async () => {\n  return (await db._schema.tables()).map((e) => ({\n    value: e,\n    label: e,\n    reload: ["gen_fields"]\n  }));\n};\n',
                        type: "option",
                        option_mode: "dropdown",
                      },
                      label: "table",
                    },
                    gen_fields: {
                      idx: 7,
                      name: "prop_10",
                      type: "string",
                      value:
                        '["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"nama_aset\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"nama_aset_keuangan\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"nama_aset_komersial\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"asset_number\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"luas_setifikat\\",\\"is_pk\\":false,\\"type\\":\\"decimal\\",\\"optional\\":true}","{\\"name\\":\\"tanggal_sertifikat\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}",{"value":"{\\"name\\":\\"m_cabang\\",\\"is_pk\\":false,\\"type\\":\\"has-one\\",\\"optional\\":true}","checked":["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"nama_cabang\\",\\"is_pk\\":false,\\"type\\":\\"string\\",\\"optional\\":true}"]},{"value":"{\\"name\\":\\"m_regional\\",\\"is_pk\\":false,\\"type\\":\\"has-one\\",\\"optional\\":true}","checked":["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"regional\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":false}"]}]',
                      valueBuilt:
                        '["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"nama_aset\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"nama_aset_keuangan\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"nama_aset_komersial\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"asset_number\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}","{\\"name\\":\\"luas_setifikat\\",\\"is_pk\\":false,\\"type\\":\\"decimal\\",\\"optional\\":true}","{\\"name\\":\\"tanggal_sertifikat\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":true}",{"value":"{\\"name\\":\\"m_cabang\\",\\"is_pk\\":false,\\"type\\":\\"has-one\\",\\"optional\\":true}","checked":["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"nama_cabang\\",\\"is_pk\\":false,\\"type\\":\\"string\\",\\"optional\\":true}"]},{"value":"{\\"name\\":\\"m_regional\\",\\"is_pk\\":false,\\"type\\":\\"has-one\\",\\"optional\\":true}","checked":["{\\"name\\":\\"id\\",\\"is_pk\\":true,\\"type\\":\\"int\\",\\"optional\\":false}","{\\"name\\":\\"regional\\",\\"is_pk\\":false,\\"type\\":\\"varchar\\",\\"optional\\":false}"]}]',
                      meta: {
                        options:
                          "async () => {\n  const result: { label: string; value: string; options?: any[] }[] = [];\n  const fields = await db._schema.columns(gen_table);\n  for (const [k, v] of Object.entries(fields)) {\n    result.push({\n      value: JSON.stringify({\n        name: k,\n        is_pk: v.is_pk,\n        type: v.db_type || v.type,\n        optional: v.optional,\n      }),\n      label: k,\n    });\n  }\n  const rels = await db._schema.rels(gen_table);\n  for (const [k, v] of Object.entries(rels)) {\n    let options = [];\n    const fields = await db._schema.columns(v.to.table);\n    for (const [k, v] of Object.entries(fields)) {\n      options.push({\n        value: JSON.stringify({\n          name: k,\n          is_pk: v.is_pk,\n          type: v.db_type || v.type,\n          optional: v.optional,\n        }),\n        label: k,\n      });\n    }\n    result.push({\n      value: JSON.stringify({\n        name: k,\n        is_pk: false,\n        type: v.type,\n        optional: true,\n      }),\n      label: k,\n      options,\n    });\n  }\n\n  return result;\n}",
                        optionsBuilt:
                          " async () => {\n  const result = [];\n  const fields = await db._schema.columns(gen_table);\n  for (const [k, v] of Object.entries(fields)) {\n    result.push({\n      value: JSON.stringify({\n        name: k,\n        is_pk: v.is_pk,\n        type: v.db_type || v.type,\n        optional: v.optional\n      }),\n      label: k\n    });\n  }\n  const rels = await db._schema.rels(gen_table);\n  for (const [k, v] of Object.entries(rels)) {\n    let options = [];\n    const fields2 = await db._schema.columns(v.to.table);\n    for (const [k2, v2] of Object.entries(fields2)) {\n      options.push({\n        value: JSON.stringify({\n          name: k2,\n          is_pk: v2.is_pk,\n          type: v2.db_type || v2.type,\n          optional: v2.optional\n        }),\n        label: k2\n      });\n    }\n    result.push({\n      value: JSON.stringify({\n        name: k,\n        is_pk: false,\n        type: v.type,\n        optional: true\n      }),\n      label: k,\n      options\n    });\n  }\n  return result;\n};\n",
                        type: "option",
                        option_mode: "checkbox",
                      },
                      label: "fields",
                      visible: "generate === 'y'",
                    },
                    gen_btn: {
                      idx: 9,
                      name: "prop_10",
                      type: "string",
                      value:
                        '[\n  {\n    label: "Generate",\n    onClick: gen_form,\n  },\n]',
                      valueBuilt:
                        ' [\n  {\n    label: "Generate",\n    onClick: gen_form\n  }\n];\n',
                      meta: {
                        type: "button",
                      },
                      label: "_",
                      visible: "generate === 'y'",
                    },
                    body: {
                      idx: 4,
                      meta: {
                        type: "content-element",
                      },
                      name: "prop_3",
                      type: "string",
                      value: '"hello"',
                      content: {
                        id: createId(),
                        adv: {
                          css: "",
                        },
                        dim: {
                          h: "full",
                          w: "full",
                        },
                        name: "body",
                        type: "item",
                        childs: [],
                        padding: {
                          l: 10,
                          b: 10,
                          t: 10,
                          r: 10,
                        },
                      },
                      typings: 'const typings = {\n  data: "any",\n}',
                      valueBuilt: ' "hello";\n',
                      jsxCalledBy: [
                        "bca0tc62ycv8tarukqpo1vf8",
                        "deqnuhatpkpyf5uqjsxcdpe0",
                      ],
                    },
                    layout: {
                      idx: 3,
                      meta: {
                        type: "option",
                        options: '["auto", "1-col", "2-col"]',
                        optionsBuilt: ' ["auto", "1-col", "2-col"];\n',
                      },
                      name: "prop_5",
                      type: "string",
                      value: '"auto"',
                      valueBuilt: ' "auto";\n',
                    },
                    on_init: {
                      idx: 0,
                      meta: {
                        type: "text",
                      },
                      name: "prop_5",
                      type: "string",
                      value: `\
({ submit, reload }: Init) => {
  // on init
  md.cache("detail").submit = submit;
  md.cache("detail").reload = reload;
};

type Init = { submit: () => void; reload: () => Promise<void> };`,
                    },
                    on_load: {
                      idx: 1,
                      meta: {
                        type: "text",
                      },
                      name: "prop_1",
                      type: "string",
                      value: "",
                    },
                    on_submit: {
                      idx: 2,
                      meta: {
                        type: "text",
                      },
                      name: "prop_1",
                      type: "string",
                      value: "",
                    },
                    gen_mode: {
                      idx: 8,
                      name: "prop_10",
                      type: "string",
                      value:
                        '["on_init",{"value":"fields","checked":["clear","add","update"]},"on_submit","on_load"]',
                      valueBuilt:
                        '["on_init",{"value":"fields","checked":["clear","add","update"]},"on_submit","on_load"]',
                      meta: {
                        options:
                          '[\n  {\n    label: "on_init",\n    value: "on_init",\n  },\n  {\n    label: "on_load",\n    value: "on_load",\n  },\n  {\n    label: "on_submit",\n    value: "on_submit",\n  },\n\n  {\n    label: "fields",\n    value: "fields",\n    options: [\n      {\n        label: "clear",\n        value: "clear",\n      },\n      {\n        label: "add",\n        value: "add",\n      },\n      {\n        label: "update",\n        value: "update",\n      },\n    ],\n  },\n]',
                        optionsBuilt:
                          ' [\n  {\n    label: "on_init",\n    value: "on_init"\n  },\n  {\n    label: "on_load",\n    value: "on_load"\n  },\n  {\n    label: "on_submit",\n    value: "on_submit"\n  },\n  {\n    label: "fields",\n    value: "fields",\n    options: [\n      {\n        label: "clear",\n        value: "clear"\n      },\n      {\n        label: "add",\n        value: "add"\n      },\n      {\n        label: "update",\n        value: "update"\n      }\n    ]\n  }\n];\n',
                        type: "option",
                        option_mode: "checkbox",
                      },
                      label: "mode",
                      visible: "generate === 'y'",
                    },
                    cache: {
                      idx: 11,
                      name: "prop_11",
                      type: "string",
                      value: '() => {\n  return md.cache("form");\n}',
                      valueBuilt: ' () => {\n  return md.cache("form");\n};\n',
                      meta: {
                        type: "text",
                      },
                    },
                  },
                  ref_ids: {},
                  useStyle: false,
                  instances: {},
                },
                originalid: createId(),
              },
            ],
          },
        ],
      },
    ],
    adv: {
      css: "",
      js: "",
      jsBuilt: "render();\n",
    },
  };

  return {
    content: res.childs[0],
    props: res.childs[0].childs[0].childs[0].component.props,
  };
};
