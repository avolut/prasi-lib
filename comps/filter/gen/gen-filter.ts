export const generateFilter = (data: any, item: PrasiItem, commit: boolean) => {
  console.log("log", { data, item, commit });
};

const frameFilter = { 
  dim: { h: "full", w: "full", hUnit: "px", wUnit: "px" },
  name: "Wrapped",
  type: "item",
  childs: [
    {
      bg: { pos: "center", size: "cover", color: "" },
      dim: { h: "full", w: "full", hUnit: "px", wUnit: "px" },
      name: "Wrapped",
      type: "item",
      childs: [
        {
          id: "r9u5j1gxxbuv73x8magw7smp",
          adv: {
            js: '<ScrollArea className={cx(props.className, "")} orientation={orientation}>{child}</ScrollArea>',
            css: "",
            jsBuilt:
              'const _jsxFileName = "[item: scroll-area - ehqmu8gsesbvqyxmiw8l580t]";render (React.createElement(ScrollArea, { className: cx(props.className, ""), orientation: orientation, __self: this, __source: {fileName: _jsxFileName, lineNumber: 1}}, child))',
          },
          dim: { h: "full", w: "full" },
          name: "scroll-area",
          type: "item",
          childs: [
            {
              name: "jsx:child",
              id: "c7nakvqt2ih6zbbrnq59omup",
            },
          ],
          script: {
            props: {
              orientation: { value: '"vertical"', valueBuilt: '"vertical"' },
            },
          },
          component: {
            id: "bb74d83b-5fd5-45a5-902d-f2f2ec8a48a7",
            props: {
              child: {
                idx: 1,
                meta: { type: "content-element" },
                name: "new_prop_1",
                type: "string",
                value: '"hello"',
                content: {
                  bg: { pos: "center", size: "cover", color: "" },
                  id: "vpvydv6rjhrtw6j9xkgl2t8f",
                  adv: { js: "", css: "", jsBuilt: "render ()" },
                  dim: { h: "full", w: "full", hUnit: "px", wUnit: "px" },
                  name: "child",
                  type: "item",
                  childs: [
                    {
                      bg: { pos: "center", size: "cover", color: "" },
                      id: "j1jtff4t8hvk4c2zn2spseww",
                      adv: {
                        js: '<div {...props} className={cx(props.className, "")} id="cek">\n  {children}\n</div>',
                        jsBuilt:
                          'const _jsxFileName = "[item: absolute - bs6mzs6otarkqrqciv6hd0to]";render (React.createElement(\'div\', { ...props, className: cx(props.className, ""), id: "cek", __self: this, __source: {fileName: _jsxFileName, lineNumber: 1}}\n  , children\n))',
                      },
                      dim: { h: "full", w: "full", hUnit: "px", wUnit: "px" },
                      name: "absolute",
                      type: "item",
                      childs: [
                        {
                          id: "tlfpdpv1g6y7f7klumtbecet",
                          dim: {
                            h: "fit",
                            w: "full",
                            hUnit: "px",
                            wUnit: "px",
                          },
                          name: "container",
                          type: "item",
                          childs: [
                            {
                              id: "epmv1gh58uso1iyi747oqlpf",
                              adv: {
                                js: '<div {...props} className={cx(props.className, "form-fields")}>\n  {children}\n</div>',
                                jsBuilt:
                                  'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "form-fields") }, children));\n',
                              },
                              dim: {
                                h: "full",
                                w: "full",
                                hUnit: "px",
                                wUnit: "px",
                              },
                              name: "fields-filter",
                              type: "item",
                              childs: [],
                              layout: {
                                dir: "row",
                                gap: 0,
                                wrap: "flex-wrap",
                                align: "top-left",
                              },
                              script: {},
                            },
                          ],
                          hidden: false,
                        },
                      ],
                      hidden: false,
                      script: {},
                      padding: { b: 0, l: 0, r: 5, t: 0 },
                    },
                  ],
                  script: {},
                },
                valueBuilt: '"hello"',
                jsxCalledBy: [
                  "yych4cm4do7t4jt0d42dasrk",
                  "ehqmu8gsesbvqyxmiw8l580t",
                ],
              },
              orientation: {
                idx: 1,
                meta: {
                  type: "option",
                  options: '["horizontal", "vertical"]',
                  optionsBuilt: '["horizontal", "vertical"]',
                },
                name: "new_prop_1",
                type: "string",
                value: '"vertical"',
                valueBuilt: '"vertical"',
              },
            },
            ref_ids: {},
            useStyle: true,
          },
          hidden: false,
        },
      ],
      hidden: false,
    },
    {
      id: "s9kb580m1bjmpe4xj9dtkgnz",
      dim: { h: "fit", w: "full", hUnit: "px", wUnit: "px" },
      name: "Wrapped",
      type: "item",
      childs: [
        {
          id: "hf0pxf4slu2xqhcuoropnkc6",
          dim: { h: "fit", w: "full", hUnit: "px", wUnit: "px" },
          name: "Reset",
          type: "item",
          childs: [
            {
              id: "jvnbd14f1sgcnmdhy4dcfuo4",
              adv: {
                js: '<Button\n  {...props}\n  onClick={(e) => {\n    if (!isEditor) on_click(e);\n  }}\n  variant={variant !== "primary" ? variant : undefined}\n  size={size !== "default" ? size : undefined}\n>\n  {label}\n</Button>',
                css: "& {\n  display: flex;\n\n  &:hover {\n    cursor: pointer;\n\n\n\n\n\n    // &.mobile {}\n    // &.desktop {}\n    // &:hover {}\n  }\n}",
                jsBuilt:
                  'render(/* @__PURE__ */ React.createElement(\n  Button,\n  {\n    ...props,\n    onClick: (e) => {\n      if (!isEditor)\n        on_click(e);\n    },\n    variant: variant !== "primary" ? variant : void 0,\n    size: size !== "default" ? size : void 0\n  },\n  label\n));\n',
              },
              dim: { h: "full", w: "full" },
              name: "button",
              type: "item",
              childs: [
                {
                  name: "jsx: label",
                  id: "k59ppuxhzf4tnkb4b4enyxxe",
                },
              ],
              mobile: { linktag: {} },
              script: {
                props: {
                  size: { value: ' "default";\n', valueBuilt: ' "default";\n' },
                  variant: { value: '"ghost"', valueBuilt: '"ghost"' },
                  on_click: {
                    value:
                      'async (e) => {\r\n  fm.data = {};\r\n  filter.data = {};\r\n  filter.render();\r\n  fm.render();\r\n  await fm.submit();\r\n  sheet.close();\r\n  // const res = getFilter("root");\r\n  // res.list.reload();\r\n}',
                    valueBuilt:
                      'async (e) => {\r\n  fm.data = {};\r\n  filter.data = {};\r\n  filter.render();\r\n  fm.render();\r\n  await fm.submit();\r\n  sheet.close();\r\n  // const res = getFilter("root");\r\n  // res.list.reload();\r\n}',
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
                      options:
                        '["default", "xs", "sm", "lg", "icon", "nosize"]',
                      optionsBuilt:
                        ' ["default", "xs", "sm", "lg", "icon", "nosize"];\n',
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
                      id: "bb91ryll6mtk827zpibo6k65",
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
                          id: "zhmnkaup9uxpou42lyn4splr",
                          adv: {
                            js: '<div {...props} className={cx(props.className, "")}>\n  Reset\n</div>',
                            css: "",
                            jsBuilt:
                              'const _jsxFileName = "[item: new_text - feo7cgson0fo2zjjujwqkr8l]";render (React.createElement(\'div\', { ...props, className: cx(props.className, ""), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1}}, "Reset"\n\n))',
                          },
                          dim: { h: "full", w: "full" },
                          html: "submit",
                          name: "new_text",
                          text: "",
                          type: "text",
                          layout: { dir: "col", gap: 0, align: "center" },
                          script: {},
                        },
                      ],
                      script: {},
                    },
                    valueBuilt: '"hello"',
                    jsxCalledBy: [
                      "frq12uxc65i9zn8myzan4huk",
                      "q278u9p4cejubvfwqc72ey73",
                    ],
                  },
                  variant: {
                    idx: 3,
                    meta: {
                      type: "option",
                      options:
                        '["primary", "secondary", "outline", "ghost", "link", "destructive","no-style"]',
                      option_mode: "button",
                      optionsBuilt:
                        ' ["primary", "secondary", "outline", "ghost", "link", "destructive", "no-style"];\n',
                    },
                    name: "prop_3",
                    type: "string",
                    value: '"ghost"',
                    valueBuilt: '"ghost"',
                  },
                  on_click: {
                    idx: 1,
                    meta: { type: "text" },
                    name: "prop_1",
                    type: "string",
                    value:
                      'async (e: React.MouseEvent<HTMLDivElement>) => {\r\n  fm.data = {};\r\n  filter.data = {};\r\n  filter.render();\r\n  fm.render();\r\n  await fm.submit();\r\n  sheet.close();\r\n  // const res = getFilter("root");\r\n  // res.list.reload();\r\n}',
                    valueBuilt:
                      'async (e) => {\r\n  fm.data = {};\r\n  filter.data = {};\r\n  filter.render();\r\n  fm.render();\r\n  await fm.submit();\r\n  sheet.close();\r\n  // const res = getFilter("root");\r\n  // res.list.reload();\r\n}',
                  },
                },
              },
              originalId: "q278u9p4cejubvfwqc72ey73",
            },
          ],
          padding: { b: 10, l: 10, r: 0, t: 10 },
        },
        {
          id: "zidglf2tal6pgxe6c1ey7i5x",
          dim: { h: "fit", w: "full", hUnit: "px", wUnit: "px" },
          name: "Apply",
          type: "item",
          childs: [
            {
              id: "hjaeik76bqh3ufszscmzw0bm",
              adv: {
                js: '<Button\n  {...props}\n  onClick={(e) => {\n    if (!isEditor) on_click(e);\n  }}\n  variant={variant !== "primary" ? variant : undefined}\n  size={size !== "default" ? size : undefined}\n>\n  {label}\n</Button>',
                css: "& {\n  display: flex;\n\n  &:hover {\n    cursor: pointer;\n\n\n\n\n\n    // &.mobile {}\n    // &.desktop {}\n    // &:hover {}\n  }\n}",
                jsBuilt:
                  'render(/* @__PURE__ */ React.createElement(\n  Button,\n  {\n    ...props,\n    onClick: (e) => {\n      if (!isEditor)\n        on_click(e);\n    },\n    variant: variant !== "primary" ? variant : void 0,\n    size: size !== "default" ? size : void 0\n  },\n  label\n));\n',
              },
              dim: { h: "full", w: "full" },
              name: "button",
              type: "item",
              childs: [
                {
                  name: "jsx: label",
                  id: "w8i2j4uq3a186ozueanxisx9",
                  originalId: "hglwmigw09h2b8a9vlz2cme5",
                },
              ],
              mobile: { linktag: {} },
              script: {
                props: {
                  size: { value: ' "default";\n', valueBuilt: ' "default";\n' },
                  variant: {
                    value: ' "primary";\n',
                    valueBuilt: ' "primary";\n',
                  },
                  on_click: {
                    value:
                      'async (e) => {\r\n  await fm.submit();\r\n  const res = getFilter("root");\r\n  res.list.reload();\r\n  sheet.close();\r\n}',
                    valueBuilt:
                      'async (e) => {\r\n  await fm.submit();\r\n  const res = getFilter("root");\r\n  res.list.reload();\r\n  sheet.close();\r\n}',
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
                      options:
                        '["default", "xs", "sm", "lg", "icon", "nosize"]',
                      optionsBuilt:
                        ' ["default", "xs", "sm", "lg", "icon", "nosize"];\n',
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
                      id: "dlq5kemqyq8d0os6uu34l4wd",
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
                          id: "nbho83c6uggcc4mxjn0e2tr9",
                          adv: {
                            js: '<div {...props} className={cx(props.className, "")}>\n  Apply\n</div>',
                            css: "",
                            jsBuilt:
                              'const _jsxFileName = "[item: new_text - to0gkiai6fbns9utxj6re1pw]";render (React.createElement(\'div\', { ...props, className: cx(props.className, ""), __self: this, __source: {fileName: _jsxFileName, lineNumber: 1}}, "Apply"\n\n))',
                          },
                          dim: { h: "full", w: "full" },
                          html: "submit",
                          name: "new_text",
                          text: "",
                          type: "text",
                          layout: { dir: "col", gap: 0, align: "center" },
                          script: {},
                        },
                      ],
                      script: {},
                    },
                    valueBuilt: '"hello"',
                    jsxCalledBy: [
                      "frq12uxc65i9zn8myzan4huk",
                      "q278u9p4cejubvfwqc72ey73",
                    ],
                  },
                  variant: {
                    idx: 3,
                    meta: {
                      type: "option",
                      options:
                        '["primary", "secondary", "outline", "ghost", "link", "destructive","no-style"]',
                      option_mode: "button",
                      optionsBuilt:
                        ' ["primary", "secondary", "outline", "ghost", "link", "destructive", "no-style"];\n',
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
                      'async (e: React.MouseEvent<HTMLDivElement>) => {\r\n  await fm.submit();\r\n  const res = getFilter("root");\r\n  res.list.reload();\r\n  sheet.close();\r\n}',
                    valueBuilt:
                      'async (e) => {\r\n  await fm.submit();\r\n  const res = getFilter("root");\r\n  res.list.reload();\r\n  sheet.close();\r\n}',
                  },
                },
              },
              originalId: "q278u9p4cejubvfwqc72ey73",
            },
          ],
          padding: { b: 10, l: 10, r: 0, t: 10 },
        },
      ],
      layout: { dir: "row", gap: 0, wrap: "flex-nowrap", align: "top-left" },
      padding: { b: 0, l: 5, r: 5, t: 0 },
    },
  ],
};
