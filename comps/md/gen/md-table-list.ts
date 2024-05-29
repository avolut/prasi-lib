import capitalize from "lodash.capitalize";
import { GFCol, createItem, parseGenField } from "../../../gen/utils";
import { generateSelect } from "./md-select";
import { on_load } from "./tbl-list/on_load";
import { modeTableList } from "./mode-table-list";
import get from "lodash.get";
import set from "lodash.set";

export const generateTableList = async (
  modify: (data: any) => void,
  data: any,
  item: PrasiItem,
  arg: { mode: "table" | "list" | "grid" | "auto"; id_parent?: string },
  commit: boolean
) => {
  
  item.edit.setChilds([
    {
      type: "item",
      name: "1",
    },
    {
      type: "item",
      name: "2",
    },
  ]);
  await item.edit.commit();
//   console.log({ data, item, arg });
//   const table = data.gen_table.value as string;
//   const raw_fields = JSON.parse(data.gen_fields.value) as (
//     | string
//     | { value: string; checked: string[] }
//   )[];
//   let pk = "";
//   let pks: Record<string, string> = {};
//   const fields = parseGenField(raw_fields);
//   // const result = {} as any;
//   // generate value dari raw_field array string convert ke value selected prisma
//   const res = generateSelect(fields);
//   pk = res.pk;
//   const select = res.select as any;
//   const result: Record<string, PropVal> = {};
//   if (arg.id_parent) {
//     select[arg.id_parent] = true;
//   }
//   if (!pk) {
//     alert("Failed to generate! Primary Key not found. ");
//     return;
//   }
//   let childs = [] as any;
//   if (pk) {
//     let sub_name = modeTableList(arg.mode);
//     let rows = Array.isArray(get(data, "child.content.childs"))
//       ? get(data, "child.content.childs")
//       : Array.isArray(get(data, "child.childs"))
//       ? get(data, "child.childs")
//       : [];

//     rows = rows.filter((e: PrasiItem) => e.name !== sub_name);
//     childs = childs.concat(rows);

//     if (data["on_load"]) {
//       result.on_load = {
//         mode: "raw",
//         value: on_load({ pk, table, select, pks }),
//       };
//     }
//     let first = true;

//     const child_sub_name = createItem({
//       name: sub_name,
//       childs: fields
//         .map((e, idx) => {
//           if (idx >= 1 && arg.mode === "list") {
//             return;
//           }
//           if (e.is_pk && arg.mode === "table") return;
//           let tree_depth = "";
//           let tree_depth_built = "";
//           if (first) {
//             tree_depth = `tree_depth={col.depth}`;
//             tree_depth_built = `tree_depth:col.depth`;
//             first = false;
//           }
//           return {
//             component: {
//               id: "297023a4-d552-464a-971d-f40dcd940b77",
//               props: {
//                 name: e.name,
//                 title: formatName(e.name),
//                 child: createItem({
//                   childs: [
//                     createItem({
//                       name: "cell",
//                       padding: {
//                         l: 8,
//                         b: 0,
//                         t: 0,
//                         r: 8,
//                       },
//                       adv: {
//                         js: `\
// <div {...props} className={cx(props.className, "")}>
// <FormatValue value={col.value} name={col.name} gen_fields={gen_fields} ${tree_depth} />
// </div>`,
//                         jsBuilt: `\
// render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }),React.createElement(FormatValue, { value: col.value, name: col.name, gen_fields: gen_fields, ${tree_depth_built} })));
//                 `,
//                       },
//                     }),
//                   ],
//                 }),
//               },
//             },
//           };
//         })
//         .filter((e) => e) as any,
//     });
//     childs.push(child_sub_name);

//     // result.child = {
//     //   mode: "jsx",
//     //   value: createItem({ name: "child", childs: [child] }),
//     // };
//     // item.edit.setChilds([child]);

//     if (commit) {
//       Object.keys(result).map((e) => {
//         item.edit.setProp(e, result[e]);
//       });
//       console.log({ childs });
//       item.edit.setChilds([
//         {
//           name: sub_name,
//         },
//         {
//           name: "123",
//         },
//       ]);
//       await item.edit.commit();
//     } else {
//       set(item, "childs", childs);
//       Object.keys(result).map((e) => {
//         set(data, e, result[e]);
//       });
//     }

//     console.log({ res, item });
//     console.log({ data });
//     console.log({ result });
//   }
//   return;
  //   if (pk) {
  //     console.log("pk");
  //     const code = {} as any;
  //     if (data["on_load"]) {
  //       result["on_load"] = data["on_load"];
  //       result["on_load"].value = on_load({ pk, table, select, pks });
  //       delete result["on_load"].valueBuilt;
  //       code.on_load = result["on_load"].value;
  //     }
  //     let sub_name = "fields";
  //     switch (arg.mode) {
  //       case "table":
  //         sub_name = "tbl-col";
  //         break;
  //       case "list":
  //         sub_name = "md-list";
  //         break;
  //     }
  //     let first = true;
  //     console.log(sub_name);
  //     const child = {
  //       name: sub_name,
  //       childs: fields
  //         .map((e, idx) => {
  //           if (idx >= 1 && arg.mode === "list") {
  //             return;
  //           }
  //           if (e.is_pk && arg.mode === "table") return;
  //           let tree_depth = "";
  //           let tree_depth_built = "";
  //           if (first) {
  //             tree_depth = `tree_depth={col.depth}`;
  //             tree_depth_built = `tree_depth:col.depth`;
  //             first = false;
  //           }
  //           return {
  //             component: {
  //               id: "297023a4-d552-464a-971d-f40dcd940b77",
  //               props: {
  //                 name: {
  //                   mode: "string",
  //                   value: e.name
  //                 },
  //                 title:  {
  //                   mode: "string",
  //                   value: formatName(e.name)
  //                 },
  //                 child: createItem({
  //                   childs: [
  //                     createItem({
  //                       name: "cell",
  //                       padding: {
  //                         l: 8,
  //                         b: 0,
  //                         t: 0,
  //                         r: 8,
  //                       },
  //                       adv: {
  //                         js: `\
  // <div {...props} className={cx(props.className, "")}>
  //   <FormatValue value={col.value} name={col.name} gen_fields={gen_fields} ${tree_depth} />
  // </div>`,
  //                         jsBuilt: `\
  // render(React.createElement("div", Object.assign({}, props, { className: cx(props.className, "") }),React.createElement(FormatValue, { value: col.value, name: col.name, gen_fields: gen_fields, ${tree_depth_built} })));
  //                   `,
  //                       },
  //                     }),
  //                   ],
  //                 }),
  //               },
  //             },
  //           };
  //         })
  //         .filter((e) => e) as any,
  //     };
  //     data.child.value = child;
  //     result["child"] = data.child
  //   }
  //   modify(result);
  //   console.log({ child: data["child"] });
};

const formatName = (name: string) => {
  return name
    .split("_")
    .filter((e) => e.length > 1)
    .map((e) => capitalize(e))
    .join(" ");
};
