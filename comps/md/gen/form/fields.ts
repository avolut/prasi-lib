import { createItem } from "lib/gen/utils";
import capitalize from "lodash.capitalize";
import { ArrowBigDown } from "lucide-react";
export type GFCol = {
  name: string;
  type: string;
  is_pk: boolean;
  optional: boolean;
  relation?: {
    from: { table: string; fields: string[] };
    to: { table: string; fields: string[] };
    fields: GFCol[];
  };
};
export const newField = (arg: GFCol, opt: { parent_table: string, value: Array<string> }) => {
  console.log({ arg, opt });
  let type = "input";
  if (["int", "string", "text"].includes(arg.type)) {
    if (["int"].includes(arg.type)) {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type,
            sub_type: "number",
            child: {
              childs: [],
            },
          },
        },
      });
    } else {
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type,
            sub_type: "text",
            child: {
              childs: [],
            },
          },
        },
      });
    }
  } else if (["timestamptz", "date"].includes(arg.type) && arg.relation) {
    return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "date",
            sub_type: "datetime",
            child: {
              childs: [],
            },
          },
        },
      });
  } else if (["has-many", "has-one"].includes(arg.type) && arg.relation) {
    if(["has-one"].includes(arg.type)){
      return createItem({
        component: {
          id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
          props: {
            name: arg.name,
            label: formatName(arg.name),
            type: "single-option",
            sub_type: "dropdown",
            rel__gen_table: arg.name,
            rel__gen_fields: [`[${opt.value.join(",")}]`],
            child: {
              childs: [],
            },
          },
        },
      });
        // return {
        //     name: "item",
        //     type: "item",
        //     component: {
        //       id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        //       props: {
        //         name: {
        //             mode: "string",
        //             value: arg.name
        //         },
        //         label: {
        //             mode: "string",
        //             value: formatName(arg.name)
        //         },
        //         type: {
        //             mode: "string",
        //             value: "single-option"
        //         },
        //         sub_type:  {
        //             mode: "string",
        //             value: "dropdown"
        //         },
        //         rel__gen_table:  {
        //             mode: "string",
        //             value: arg.name
        //         },
        //         rel__gen_fields:  {
        //             mode: "raw",
        //             value: `${JSON.stringify(opt.val)}`
        //         }
        //       },
        //     },
        //   };
    }else{
        return createItem({
            component: {
              id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
              props: {
                name: arg.name,
                label: formatName(arg.name),
                type: "date",
                sub_type: "datetime",
                child: {
                  childs: [],
                },
              },
            },
          });
    }
    
  } else {
    // type not found,
    return createItem({
      component: {
        id: "32550d01-42a3-4b15-a04a-2c2d5c3c8e67",
        props: {
          name: arg.name,
          label: formatName(arg.name),
          type,
          sub_type: "text",
          child: {
            childs: [],
          },
        },
      },
    });
  }
};
export const formatName = (name: string) => {
  return (name || "")
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
