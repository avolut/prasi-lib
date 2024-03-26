import { createId } from "@paralleldrive/cuid2";

export const gen_header = () => {
  return {
    id: createId(),
    name: "prop_1",
    type: "item",
    dim: {
      w: "full",
      h: 40,
      hUnit: "px",
    },
    childs: [
      {
        id: createId(),
        name: "breadcrumb",
        type: "item",
        dim: {
          w: "full",
          h: 40,
          hUnit: "px",
        },
        childs: [
          {
            id: createId(),
            name: "back",
            type: "item",
            dim: {
              w: "fit",
              h: "full",
            },
            childs: [
              {
                id: createId(),
                name: "icon",
                type: "item",
                dim: {
                  w: "full",
                  h: "full",
                },
                childs: [],
                adv: {
                  html: '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"\n  stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-left">\n  <path d="m15 18-6-6 6-6" />\n</svg>',
                  css: "",
                },
                layout: {
                  dir: "col",
                  align: "center",
                  gap: 0,
                  wrap: "flex-nowrap",
                },
              },
              {
                id: createId(),
                name: "back_text",
                type: "text",
                dim: {
                  w: "fit",
                  h: "full",
                },
                layout: {
                  align: "center",
                  dir: "col",
                  gap: 0,
                },
                text: "",
                html: "<div>Back</div>",
                adv: {
                  css: "",
                },
              },
            ],
            adv: {
              js: '<>\n  {md.ui.back && (\n    <div\n      {...props}\n      className={cx(props.className, "")}\n      onClick={() => {\n        md.ui.actions = [...md.ui.default_actions];\n        md.ui.breadcrumb = [];\n        md.ui.back = false;\n        md.selected = null;\n        md.render();\n      }}\n    >\n      {children}\n    </div>\n  )}\n</>',
              jsBuilt:
                'render(/* @__PURE__ */ React.createElement(React.Fragment, null, md.ui.back && /* @__PURE__ */ React.createElement(\n  "div",\n  {\n    ...props,\n    className: cx(props.className, ""),\n    onClick: () => {\n      md.ui.actions = [...md.ui.default_actions];\n      md.ui.breadcrumb = [];\n      md.ui.back = false;\n      md.selected = null;\n      md.render();\n    }\n  },\n  children\n)));\n',
              css: "& {\n  display: flex;\n  cursor: pointer;\n\n  // &.mobile {}\n  // &.desktop {}\n  &:hover {\n    background: rgb(237, 246, 255);\n  }\n}",
            },
            script: {},
            layout: {
              dir: "row",
              align: "top-left",
              gap: 0,
              wrap: "flex-nowrap",
            },
            border: {
              style: "solid",
              stroke: {
                r: 1,
              },
              color: "#ececeb",
            },
            padding: {
              l: 10,
              b: 0,
              t: 0,
              r: 10,
            },
          },
          {
            id: createId(),
            name: "title",
            type: "item",
            childs: [],
            adv: {
              js: '<div {...props} className={cx(props.className, "")}>\n  <MDTitle md={md} />\n</div>',
              jsBuilt:
                'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement(MDTitle, { md })));\n',
            },
            script: {},
            padding: {
              l: 10,
              b: 0,
              t: 0,
              r: 10,
            },
            dim: {
              w: "full",
              h: "full",
              wUnit: "px",
              hUnit: "px",
            },
            layout: {
              dir: "col",
              align: "left",
              gap: 0,
              wrap: "flex-nowrap",
            },
          },
          {
            id: createId(),
            name: "right",
            type: "item",
            childs: [
              {
                id: createId(),
                name: "mode",
                type: "item",
                dim: {
                  w: "fit",
                  h: "full",
                },
                childs: [],
                adv: {
                  js: '<>\n  {!md.ui.back && (\n    <div {...props} className={cx(props.className, "")}>\n      {children}\n    </div>\n  )}\n</>',
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement(React.Fragment, null, !md.ui.back && /* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, children)));\n',
                  css: "",
                },
                script: {},
                padding: {
                  l: 0,
                  b: 0,
                  t: 0,
                  r: 10,
                },
              },
              {
                id: createId(),
                name: "actions",
                type: "item",
                dim: {
                  w: "fit",
                  h: "full",
                },
                childs: [],
                adv: {
                  js: '<div {...props} className={cx(props.className, "")}>\n  <MDAction md={md} />\n</div>',
                  jsBuilt:
                    'render(/* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement(MDAction, { md })));\n',
                  css: "",
                },
                script: {},
                padding: {
                  l: 0,
                  b: 0,
                  t: 0,
                  r: 10,
                },
              },
            ],
            layout: {
              dir: "row",
              align: "top-left",
              gap: 0,
              wrap: "flex-nowrap",
            },
          },
        ],
        adv: {
          js: '<>\n  {md.mode === "breadcrumb" && (\n    <div {...props} className={cx(props.className, "")}>\n      {children}\n    </div>\n  )}\n</>',
          jsBuilt:
            'render(/* @__PURE__ */ React.createElement(React.Fragment, null, md.mode === "breadcrumb" && /* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, children)));\n',
          css: "",
        },
        script: {},
        padding: {
          l: 0,
          b: 0,
          t: 0,
          r: 0,
        },
        layout: {
          dir: "row",
          align: "left",
          gap: 0,
          wrap: "flex-nowrap",
        },
        border: {
          style: "solid",
          stroke: {
            b: 1,
          },
          color: "#ccc",
        },
      },
    ],
    adv: {
      css: "",
    },
    hidden: false,
  };
};
