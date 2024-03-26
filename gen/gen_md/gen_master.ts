import { createId } from "@paralleldrive/cuid2";

export const gen_master = () => {
  const res = {
    id: createId(),
    name: "prop_1",
    type: "item",
    dim: {
      w: "full",
      h: "full",
    },
    childs: [
      {
        id: createId(),
        adv: {
          js: "<Table on_load={on_load} columns={columns} child={child} PassProp={PassProp} />",
          css: "",
          jsBuilt:
            "render(/* @__PURE__ */ React.createElement(Table, { on_load, columns, child, PassProp }));\n",
        },
        dim: {
          h: "full",
          w: "full",
        },
        name: "table",
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
            name: "jsx: child",
            type: "item",
            childs: [
              {
                id: createId(),
                adv: {
                  js: '<>{cell.key !== "action" && cell.value}</>',
                  css: "",
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement(React.Fragment, null, cell.key !== "action" && cell.value));\n',
                },
                dim: {
                  h: "full",
                  w: "full",
                },
                name: "text",
                type: "item",
                childs: [],
                script: {},
              },
              {
                id: createId(),
                adv: {
                  js: '<>\n  {cell.key === "action" && (\n    <div className="flex items-center h-full">\n      <div\n        className={cx(\n          "bg-white border flex items-center px-3 cursor-pointer capitalize",\n          css`\n            height:25px; \n            &:hover {\n              background:blue;\n              color:white;\n            }\n          `,\n        )}\n      >\n        {cell.value}\n      </div>\n    </div>\n  )}\n</>',
                  css: "",
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement(React.Fragment, null, cell.key === "action" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center h-full" }, /* @__PURE__ */ React.createElement(\n  "div",\n  {\n    className: cx(\n      "bg-white border flex items-center px-3 cursor-pointer capitalize",\n      css`\n            height:25px; \n            &:hover {\n              background:blue;\n              color:white;\n            }\n          `\n    )\n  },\n  cell.value\n))));\n',
                },
                dim: {
                  h: "full",
                  w: "full",
                },
                name: "action",
                type: "item",
                childs: [],
                script: {},
              },
            ],
          },
        ],
        script: {},
        component: {
          id: "df4e3552-3221-496c-b07b-0c1295f811be",
          props: {
            child: {
              idx: 3,
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
                  js: "<>{children}</>",
                  jsBuilt:
                    "render(/* @__PURE__ */ React.createElement(React.Fragment, null, children));\n",
                },
                dim: {
                  h: "full",
                  w: "full",
                },
                name: "prop_3",
                type: "item",
                childs: [
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "id" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "id" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "id",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "nama_aset_komersial" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "nama_aset_komersial" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "nama_aset_komersial",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "m_cabang" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value?.["nama_cabang"]}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "m_cabang" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value?.["nama_cabang"]\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "m_cabang",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "m_regional" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value?.["regional"]}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "m_regional" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value?.["regional"]\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "m_regional",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "luas_setifikat" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "luas_setifikat" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "luas_setifikat",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                  {
                    id: createId(),
                    adv: {
                      js: '<>\n  {cell.key === "tanggal_sertifikat" && (\n    <div {...props} className={cx(props.className, "")}>\n      {cell.value}\n    </div>\n  )}\n</>',
                      css: "",
                      jsBuilt:
                        'render(\n  React.createElement(\n    React.Fragment,\n    null,\n    cell.key === "tanggal_sertifikat" &&\n      React.createElement(\n        "div",\n        Object.assign({}, props, { className: cx(props.className, "") }),\n        cell.value\n      )\n  )\n)',
                    },
                    dim: {
                      h: "full",
                      w: "full",
                    },
                    name: "tanggal_sertifikat",
                    type: "item",
                    childs: [],
                    script: {},
                  },
                ],
                hidden: false,
              },
              typings:
                "const typings = {\n  cell: `{ key: string, value: any }`,\n  row: `any`,\n  idx: `number`,\n  rows: `any[]`,\n}",
              valueBuilt: ' "hello";\n',
            },
            columns: {
              idx: 0,
              meta: {
                type: "text",
              },
              name: "prop_1",
              type: "string",
              value:
                'async (): Promise<\n    { key: string; name: string; width?: number; frozen?: boolean }[]\n  > => {\n    return [\n      { key: "id", name: "#", width: 60, frozen: true },\n      {"key":"nama_aset_komersial","name":"Nama Aset Komersial"},\n      {"key":"m_cabang","name":"Cabang"},\n      {"key":"m_regional","name":"Regional"},\n      {"key":"luas_setifikat","name":"Luas Setifikat"},\n      {"key":"tanggal_sertifikat","name":"Tanggal Sertifikat"}\n    ];\n  }',
              valueBuilt:
                ' async () => {\n  return [\n    { key: "id", name: "#", width: 60, frozen: true },\n    { "key": "nama_aset_komersial", "name": "Nama Aset Komersial" },\n    { "key": "m_cabang", "name": "Cabang" },\n    { "key": "m_regional", "name": "Regional" },\n    { "key": "luas_setifikat", "name": "Luas Setifikat" },\n    { "key": "tanggal_sertifikat", "name": "Tanggal Sertifikat" }\n  ];\n};\n',
            },
            on_load: {
              idx: 1,
              meta: {
                type: "text",
              },
              name: "prop_1",
              type: "string",
              value:
                "async () => {\n  if (isEditor)\n    return [\n      {\n        id: createId(),\n    },\n  });\n\n  return items;\n}",
              valueBuilt:
                ' async () => {\n  if (isEditor)\n    return [\n      {\n        id: createId(),\n        tanggal_sertifikat: "sample"\n      }\n    ];\n  const items = await db.m_aset.findMany({\n    select: {\n      id: true,\n      nama_aset_komersial: true,\n      m_cabang: {\n        select: {\n          id: true,\n          nama_cabang: true\n        }\n      },\n      m_regional: {\n        select: {\n          regional: true,\n          id: true\n        }\n      },\n      luas_setifikat: true,\n      tanggal_sertifikat: true\n    },\n    orderBy: {\n      id: "desc"\n    }\n  });\n  return items;\n};\n',
            },
            generate: {
              idx: 5,
              name: "prop_5",
              type: "string",
              value: '"n"',
              valueBuilt: '"n"',
              meta: {
                type: "option",
              },
            },
            gen_table: {
              idx: 7,
              name: "prop_7",
              type: "string",
              value: '""',
              valueBuilt: '""',
              meta: {
                type: "option",
              },
            },
            gen_fields: {
              idx: 9,
              name: "prop_9",
              type: "string",
              value: "[]",
              valueBuilt: "[]",
              meta: {
                type: "option",
              },
            },
            row_click: {
              idx: 11,
              name: "prop_11",
              type: "string",
              value:
                "({ row, rows, idx, event }: OnRowClick) => {\n  md.selected = row;\n  md.render();\n};\n\ntype OnRowClick = {\n  row: any;\n  rows: any[];\n  idx: any;\n  event: React.MouseEvent<HTMLDivElement, MouseEvent>;\n}",
              valueBuilt:
                " ({ row, rows, idx, event }) => {\n  md.selected = row;\n  md.render();\n};\n",
              meta: {
                type: "text",
              },
            },
            gen_button: {
              idx: 11,
              name: "prop_11",
              type: "string",
              value: '"hello"',
              valueBuilt: '"hello"',
              meta: {
                type: "button",
              },
            },
          },
          ref_ids: {},
          instances: {},
        },
        originalId: "gxwni8zmj8zhiogfa52eoq6a",
      },
    ],
    adv: {
      css: "& {\n  display: flex;\n\n  .rdg-row {\n    cursor: pointer;\n  }\n\n  // &.mobile {}\n  // &.desktop {}\n  // &:hover {}\n}",
    },
  };

  return { content: res, props: res.childs[0].component.props };
};
