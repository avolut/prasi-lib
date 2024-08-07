import { createId } from "@paralleldrive/cuid2";
import { GenFormArgs } from "./types";

export const genFormSubmit = ({}: GenFormArgs) => {
  return {
    id: createId(),
    dim: { h: "fit", w: "full", hUnit: "px", wUnit: "px" },
    name: "submit",
    type: "item",
    adv: {
      css: "",
      js: '<>\n  {\n    /** if */\n    fm.status === "ready" ? (\n      /** then  */\n      <div {...props} className={cx(props.className, "")}>\n        {children}\n      </div>\n    ) : (\n      /** else  */\n      <div {...props} className={cx(props.className, "")}>\n        <FieldLoading />\n      </div>\n    )\n  }\n</>',
      jsBuilt:
        'render(/* @__PURE__ */ React.createElement(\n  React.Fragment,\n  null,\n  /** if */\n  fm.status === "ready" ? (\n    /** then  */\n    /* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, children)\n  ) : (\n    /** else  */\n    /* @__PURE__ */ React.createElement("div", { ...props, className: cx(props.className, "") }, /* @__PURE__ */ React.createElement(FieldLoading, null))\n  )\n));\n',
    },
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
};
