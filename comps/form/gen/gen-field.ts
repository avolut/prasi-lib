import { createId } from "@paralleldrive/cuid2";
import { generateSelect } from "lib/comps/md/gen/md-select";
import { parseGenField } from "lib/gen/utils";
import get from "lodash.get";
import { getColumn } from "./gen-rel-many";
import { genTableEdit } from "./gen-table-edit";
import { on_load_rel } from "./on_load_rel";

export const generateField = async (
  data: any,
  item: PrasiItem,
  commit: boolean
) => {
  let fieldType = getString(data.sub_type.value) as string;
  let table = getString(data.rel__gen_table.value) as string;
  const raw_fields = JSON.parse(data.rel__gen_fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  if (["checkbox", "button", "typeahead"].includes(fieldType)) {
    const fields = parseGenField(raw_fields);
    const res = generateSelect(fields);
    const master = fields.find(
      (e: any) => e.type === "has-one" && e.name !== table
    ) as any;
    const pk = fields.find((e: any) => get(e, "is_pk")) as any;
    const pk_master = master.relation.fields.find((e: any) => get(e, "is_pk"));

    const load = on_load_rel({
      pk: generateSelect(parseGenField(master.value.checked)).pk,
      table: master?.name,
      select: generateSelect(parseGenField(master.value.checked)).select,
      pks: {},
      type: fieldType,
    } as any);
    const result = {
      opt__on_load: load,
      opt__get_value: `\
        (arg: {
          options: { label: string; value: string; item?: string }[];
          fm: FMLocal;
          name: string;
          type: string;
        }) => {
          const { options, fm, name, type } = arg;
          if (isEditor) {
            return fm.data[name];
          }
          let result = null;
          result = fm.data[name];
          switch (type) {
            case "single-option":
              try {
                const data = fm.data[name];
                if (typeof data === "object") {
                  if (typeof data?.connect?.id !== "undefined") {
                    result = data.connect.id;
                  }else if (typeof data?.id !== "undefined") {
                    result = data.id;
                  }
                }
              } catch (ex) { }
              break;
            case "multi-option":
              const selected = [];
              const data = fm.data[name];
              if (Array.isArray(data) && data.length) {
                data.map((e) => {
                  try {
                    if (typeof e === "object") {
                      if (typeof e["${master.name}"].connect?.${pk_master.name} === "string") {
                        selected.push(e["${master.name}"].connect.${pk_master.name});
                      } else if (typeof e["${master.name}"]?.${pk_master.name} === "string") {
                        selected.push(e["${master.name}"].${pk_master.name});
                      }
                    }
                  } catch (ex) { }
                })
              }
              return selected;
              break;
          }
          return result;
        }
        `,
      opt__set_value: `\
        (arg: {
          selected: any[];
          options: { label: string; value: string; item?: string }[];
          fm: FMLocal;
          name: string;
          type: string;
        }) => {
          const { selected, options, fm, name, type } = arg;
          switch (type) {
            case "single-option":
              fm.data[name] = {
                connect: {
                  id: selected[0],
                },
              };
              break;
            case "multi-option":
              let parent = {} as any;
              const fields = parseGenField(fm.props.gen_fields);
              const res = generateSelect(fields);
              // try {
              //   parent = {
              //     [fm.props.gen_table]: {
              //       connect: {
              //         [res.pk]: fm.data.id || null,
              //       },
              //     },
              //   };
              // } catch (e) {}
              fm.data[name] = selected.map((e) => {
                return {
                  ${master.name}: {
                    connect: {
                      id: e,
                    },
                  },
                  ...parent,
                };
              });
              break;
            default: 
              fm.data[name] = selected.map((e) => e);
          }
          fm.render();
        }
        `,
      opt__label: `\
(
  row: { value: string; label: string; data?: any },
  mode: "list" | "label", opt: any
) => {
  const cols = ${JSON.stringify(
    getColumn(generateSelect(parseGenField(master.value.checked)))
  )};
  
  const prefix = treePrefix({
    //@ts-ignore
    rel__feature, rel__id_parent, row, mode, opt
  });

  if (isEditor) {
    return row.label;
  }
  const result = [];
  if (!!row.data && !row.label && !Array.isArray(row.data)) {
    if(cols.length > 0){
      cols.map((e) => {
        if (row.data[e]) {
          result.push(row.data[e]);
        }
      });
      return prefix + result.join(" - ");
    } else {
      const fields = parseGenField(rel__gen_fields);
      return prefix + fields
        .filter((e) => !e.is_pk)
        .map((e) => row.data[e.name])
        .filter((e) => e)
        .join(" - ");
    }
  }
  return prefix + row.label;
}
        `,
    } as any;
    Object.keys(result).map((e) => {
      item.edit.setProp(e, {
        mode: "raw",
        value: result[e],
      });
    });
    await item.edit.commit();
    // console.log("halo", {fieldType, table, fields, res, load});
    // console.log({
    //     table_parent: table,
    //     arg: fields.find(
    //       (e: any) => e.type === "has-one"  && e.name !== table
    //     ),
    //     rel: fields.filter(
    //       (e: any) => e.type !== "has-many"
    //     ),
    //   })
    // const result = gen_rel_many({
    //   table_parent: table,
    //   arg: fields.find(
    //     (e: any) => e.type === "has-one"  && e.name !== table
    //   ),
    //   rel: fields.filter(
    //     (e: any) => e.type !== "has-many"
    //   ),
    // });
  } else if (["table-edit"].includes(fieldType)) {
    const result = {
      opt__on_load: "() => { return []; }",
      opt__get_value: `\
        (arg: {
            options: { label: string; value: string; item?: string }[];
            fm: FMLocal;
            name: string;
            type: string;
          }) => {
            const { options, fm, name, type } = arg;
            if (isEditor) {
              return fm.data[name];
            }
            let result = null;
            result = fm.data[name];
            switch (type) {
              case "single-option":
                try {
                  const data = fm.data[name];
                  if (typeof data === "object") {
                    if (typeof data?.connect?.id !== "undefined") {
                      result = data.connect.id;
                    }else if (typeof data?.id !== "undefined") {
                      result = data.id;
                    }
                  }
                } catch (ex) { }
                break;
            }
            return result;
        }
          `,
      opt__set_value: `\
        (arg: {
            selected: any[];
            options: { label: string; value: string; item?: string }[];
            fm: FMLocal;
            name: string;
            type: string;
          }) => {
            
            fm.render();
        }
        `,
      opt__label: `\
        (row: { value: string; label: string; item?: any }) => {
            return row.label;
        }
        `,
    } as any;
    Object.keys(result).map((e) => {
      item.edit.setProp(e, {
        mode: "raw",
        value: result[e],
      });
    });
    const res = (await genTableEdit(
      item,
      {
        gen__table: data.rel__gen_table,
        gen__fields: data.rel__gen_fields,
      },
      false
    )) as any;

    item.edit.setProp("child", {
      mode: "jsx",
      value: {
        id: createId(),
        name: "item",
        type: "item",
        edit: null as any,
        childs: res,
      },
    });
    await item.edit.commit();
  }
};
export const getString = (data: string) => {
  let result = null;
  try {
    result = eval(data);
  } catch (e) {
    result = data;
  }
  return result;
};
