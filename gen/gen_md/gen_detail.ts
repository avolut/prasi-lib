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
                          zmit41kbgkbqcsmm8aspp8zy: "mo4m0rnyey4y6v7tlajod95l",
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
                    childs: [
                      {
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
                              value: "`nama_aset`",
                              is_name: true,
                              valueBuilt: "`nama_aset`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Nama Aset`",
                              is_name: false,
                              valueBuilt: "`Nama Aset`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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
                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`nama_aset_keuangan`",
                              is_name: true,
                              valueBuilt: "`nama_aset_keuangan`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Nama Aset Keuangan`",
                              is_name: false,
                              valueBuilt: "`Nama Aset Keuangan`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`nama_aset_komersial`",
                              is_name: true,
                              valueBuilt: "`nama_aset_komersial`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Nama Aset Komersial`",
                              is_name: false,
                              valueBuilt: "`Nama Aset Komersial`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`asset_number`",
                              is_name: true,
                              valueBuilt: "`asset_number`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Asset Number`",
                              is_name: false,
                              valueBuilt: "`Asset Number`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`luas_setifikat`",
                              is_name: true,
                              valueBuilt: "`luas_setifikat`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Luas Setifikat`",
                              is_name: false,
                              valueBuilt: "`Luas Setifikat`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`tanggal_sertifikat`",
                              is_name: true,
                              valueBuilt: "`tanggal_sertifikat`",
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
                              value: '"text"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"text"',
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
                                id: createId(),
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
                              value: "`Tanggal Sertifikat`",
                              is_name: false,
                              valueBuilt: "`Tanggal Sertifikat`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '""',
                              valueBuilt: '""',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: "[]",
                              valueBuilt: "[]",
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`m_cabang`",
                              is_name: true,
                              valueBuilt: "`m_cabang`",
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
                              value: '"relation"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"relation"',
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
                                id: createId(),
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
                              value: "`Cabang`",
                              is_name: false,
                              valueBuilt: "`Cabang`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
                              valueBuilt: ' "";\n',
                            },
                            rel_query: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value:
                                "async () => {\n  return {\n    // orderBy: {\n    //   name: 'asc'\n    // }\n  };\n}",
                              valueBuilt:
                                " async () => {\n  return {\n    // orderBy: {\n    //   name: 'asc'\n    // }\n  };\n};\n",
                              meta: {
                                type: "text",
                              },
                            },

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"m_cabang"',
                              valueBuilt: '"m_cabang"',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: '["::id","nama_cabang"]',
                              valueBuilt: '["::id","nama_cabang"]',
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                      {
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
                              value: "`m_regional`",
                              is_name: true,
                              valueBuilt: "`m_regional`",
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
                              value: '"relation"',
                              content: {
                                id: createId(),
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
                              valueBuilt: '"relation"',
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
                                id: createId(),
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
                              value: "`Regional`",
                              is_name: false,
                              valueBuilt: "`Regional`",
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
                              visible:
                                '["number", "text", "password"].includes(type)',
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
                              visible:
                                "['button-options', 'dropdown', 'radio'].includes(type)",
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
                              value: "`n`",
                              is_name: false,
                              valueBuilt: "`n`",
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
                              visible:
                                '["text", "number", "password"].includes(type)',
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

                            rel_table: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"m_regional"',
                              valueBuilt: '"m_regional"',
                              meta: {
                                type: "text",
                              },
                              content: {
                                id: createId(),
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
                              value: '["::id","regional"]',
                              valueBuilt: '["::id","regional"]',
                              meta: {
                                type: "option",
                              },
                            },
                            default_value: {
                              idx: 11,
                              name: "prop_11",
                              type: "string",
                              value: '"hello"',
                              valueBuilt: '"hello"',
                              meta: {
                                type: "text",
                              },
                            },
                          },
                          ref_ids: {},
                          instances: {},
                        },
                      },
                    ],
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
                  value:
                    '({ submit }: Init) => {\n  // on init\n  md.cache("form")._submit = submit;\n};\n\ntype Init = { submit: () => void }',
                  valueBuilt:
                    ' ({ submit }) => {\n  md.cache("form")._submit = submit;\n};\n',
                },
                on_load: {
                  idx: 1,
                  meta: {
                    type: "text",
                  },
                  name: "prop_1",
                  type: "string",
                  value:
                    'async (opt) => {\n  if (isEditor) return {};\n\n  let id = parseInt(md.selected.id);\n\n  const after_load = (item: any) => {\n    const set_actions = () =>\n      (md.ui.actions = [\n        {\n          label: "Delete",\n          type: "destructive",\n          onClick: async () => {\n            if (confirm("Are you sure ?")) {\n              md.ui.actions = [{ label: "Deleting...", type: "ghost" }];\n              md.render();\n\n              await db.m_aset.delete({ where: { id: item.id } });\n\n              setTimeout(() => {\n                md.ui.actions = [...md.ui.default_actions];\n                md.ui.breadcrumb = [];\n                md.ui.back = false;\n                md.selected = null;\n                md.render();\n              });\n            }\n          },\n          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`,\n        },\n        {\n          label: "Save",\n          onClick: async () => {\n            md.ui.actions = [{ label: "Saving...", type: "ghost" }];\n            md.render();\n            await md.cache("form")._submit();\n            setTimeout(() => {\n              set_actions();\n              md.render();\n            }, 500);\n          },\n          icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`,\n        },\n      ]);\n    set_actions();\n    md.ui.breadcrumb = [["Master Aset", ""], item?.nama_aset_komersial];\n    md.render();\n  };\n\n  if (id) {\n    md.ui.breadcrumb = [["Master Aset", ""], "..."];\n    md.render();\n\n    const item = await db.m_aset.findFirst({\n      where: {\n        id: id,\n      },\n      select: {\n        id: true,\n        nama_aset: true,\n        nama_aset_keuangan: true,\n        nama_aset_komersial: true,\n        asset_number: true,\n        luas_setifikat: true,\n        tanggal_sertifikat: true,\n        m_cabang: {\n          select: {\n            id: true,\n          },\n        },\n        m_regional: {\n          select: {\n            id: true,\n          },\n        },\n      },\n    });\n\n    for (const [k, v] of Object.entries(item)) {\n      if (k === "m_cabang") {\n        if (v?.["id"]) item[k] = { connect: { id: v?.["id"] } } as any;\n        else delete item[k];\n      }\n      if (k === "m_regional") {\n        if (v?.["id"]) item[k] = { connect: { id: v?.["id"] } } as any;\n        else delete item[k];\n      }\n    }\n\n    after_load(item);\n\n    return item;\n  } else {\n    after_load({});\n  }\n}',
                  valueBuilt:
                    ' async (opt) => {\n  if (isEditor)\n    return {};\n  let id = parseInt(md.selected.id);\n  const after_load = (item) => {\n    const set_actions = () => md.ui.actions = [\n      {\n        label: "Delete",\n        type: "destructive",\n        onClick: async () => {\n          if (confirm("Are you sure ?")) {\n            md.ui.actions = [{ label: "Deleting...", type: "ghost" }];\n            md.render();\n            await db.m_aset.delete({ where: { id: item.id } });\n            setTimeout(() => {\n              md.ui.actions = [...md.ui.default_actions];\n              md.ui.breadcrumb = [];\n              md.ui.back = false;\n              md.selected = null;\n              md.render();\n            });\n          }\n        },\n        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>`\n      },\n      {\n        label: "Save",\n        onClick: async () => {\n          md.ui.actions = [{ label: "Saving...", type: "ghost" }];\n          md.render();\n          await md.cache("form")._submit();\n          setTimeout(() => {\n            set_actions();\n            md.render();\n          }, 500);\n        },\n        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>`\n      }\n    ];\n    set_actions();\n    md.ui.breadcrumb = [["Master Aset", ""], item?.nama_aset_komersial];\n    md.render();\n  };\n  if (id) {\n    md.ui.breadcrumb = [["Master Aset", ""], "..."];\n    md.render();\n    const item = await db.m_aset.findFirst({\n      where: {\n        id\n      },\n      select: {\n        id: true,\n        nama_aset: true,\n        nama_aset_keuangan: true,\n        nama_aset_komersial: true,\n        asset_number: true,\n        luas_setifikat: true,\n        tanggal_sertifikat: true,\n        m_cabang: {\n          select: {\n            id: true\n          }\n        },\n        m_regional: {\n          select: {\n            id: true\n          }\n        }\n      }\n    });\n    for (const [k, v] of Object.entries(item)) {\n      if (k === "m_cabang") {\n        if (v?.["id"])\n          item[k] = { connect: { id: v?.["id"] } };\n        else\n          delete item[k];\n      }\n      if (k === "m_regional") {\n        if (v?.["id"])\n          item[k] = { connect: { id: v?.["id"] } };\n        else\n          delete item[k];\n      }\n    }\n    after_load(item);\n    return item;\n  } else {\n    after_load({});\n  }\n};\n',
                },
                on_submit: {
                  idx: 2,
                  meta: {
                    type: "text",
                  },
                  name: "prop_1",
                  type: "string",
                  value:
                    'async ({ form, error }: IForm) => {\n  if (typeof error === "object" && Object.keys(error).length > 0) return {};\n\n  const data = { ...form };\n  delete data.id;\n\n  if (form.id) {\n    await db.m_aset.update({\n      where: {\n        id: form.id,\n      },\n      data,\n    });\n  } else {\n    const res = await db.m_aset.create({\n      data,\n      select: { id: true },\n    });\n    if (res) form.id = res.id;\n  }\n\n  return true;\n};\n\ntype IForm = { form: any; error: Record<string, string> }',
                  valueBuilt:
                    ' async ({ form, error }) => {\n  if (typeof error === "object" && Object.keys(error).length > 0)\n    return {};\n  const data = { ...form };\n  delete data.id;\n  if (form.id) {\n    await db.m_aset.update({\n      where: {\n        id: form.id\n      },\n      data\n    });\n  } else {\n    const res = await db.m_aset.create({\n      data,\n      select: { id: true }\n    });\n    if (res)\n      form.id = res.id;\n  }\n  return true;\n};\n',
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
        adv: {
          css: "",
          js: "",
          jsBuilt: "render();\n",
        },
      },
    ],
    adv: {
      css: "",
      js: "",
      jsBuilt: "render();\n",
    },
  };

  return { content: res, props: res.childs[0].childs[0].component.props };
};
