import { createItem, parseGenField } from "lib/gen/utils";
import get from "lodash.get";
import { newField } from "./fields";
import { generateSelect } from "../../md/gen/md-select";
import { createId } from "@paralleldrive/cuid2";
import { get_rel_many } from "./get_rel_many";
import { on_load } from "./on_load";
import { set } from "lib/utils/set";

export const generateForm = async (
  modify: (data: any) => void,
  data: any,
  item: PrasiItem,
  commit: boolean
) => {
  const table = data.gen__table.value as string;
  const raw_fields = JSON.parse(data.gen__fields.value) as (
    | string
    | { value: string; checked: string[] }
  )[];
  let pk = "";
  let pks: Record<string, string> = {};
  const fields = parseGenField(raw_fields);
  const res = generateSelect(fields);
  const rel_many = get_rel_many(fields);
  console.log({rel_many})
  pk = res.pk;
  const select = res.select as any;
  const result: Record<string, PropVal> = {};
  if (!pk) {
    alert("Failed to generate! Primary Key not found. ");
    return;
  }
  console.log({fields, res})
  if (pk) {
    if (data["on_load"]) {
      result.on_load = {
        mode: "raw",
        value: on_load({ pk, table, select, pks }),
      };
    }
    if (data["on_submit"]) {
      result.on_submit = {
        mode: "raw",
        value: `\
        async ({ form, error }: IForm) => {
          let result = false;
          try {
            
            const data = { ...form }; // data form
            const data_rel = ${JSON.stringify(rel_many)}  // list relasi has many
            const data_master = {} as Record<string, any> | any; // variabel untuk data master
            const data_array = [] as Array<{
              table: string;
              data: Array<any>;
              fk: string;
            }>; // variabel untuk data array atau has many

            // proses untuk membagi antara data master dengan data array
            // data array / has many dilihat dari value yang berupa array
            for (const [k, v] of Object.entries(data) as any) {
              if (Array.isArray(v)) {
                const rel = Array.isArray(data_rel) && data_rel.length ? data_rel.find((e) => e.table === k) : null
                if (rel) {
                  data_array.push({
                    table: k,
                    data: v,
                    fk: rel.fk,
                  });
                }
              } else {
                data_master[k] = v;
              }
            }
            // hapus id dari data_master jika ada
            try {
              delete data_master.${pk};
            } catch (ex) {}
            if (form.${pk}) {
              await db.${table}.update({
                where: {
                  ${pk}: form.${pk},
                },
                data: data_master,
              });
            } else {
              const res = await db.${table}.create({
                data: data_master,
              });
              if (res) form.${pk} = res.${pk};
            }
            if (data_array.length) {
              const exec_query_bulk = async (
                current: { table: string; data: Array<any>; fk: string },
                list: Array<{ table: string; data: Array<any>; fk: string }>,
                index: number,
              ) => {
                if (list.length) {
                  const data = current.data.map((e) => {
                    return {
                      ...e,
                      ${table}: {
                        connect: {
                          ${pk}: form.${pk},
                        },
                      },
                    };
                  });
                  await db[current.table].batch_upsert({
                    where: {
                      [current.fk]: form.${pk},
                    },
                    data: data,
                  });
        
                  if (list.length > 1) {
                    try {
                      index++;
                      if (index < list.length - 1) {
                        await exec_query_bulk(list[index], list, index);
                      }
                    } catch (ex) {}
                  }
                }
              };
              await exec_query_bulk(data_array[0], data_array, 0);
            }
            result = true;
          } catch (e) {
            console.error(e);
            result = false;
          }
        
          return result;
        };
        
        type IForm = { form: any; error: Record<string, string> }
        `
      };
    }
    const childs = [];
    for (const item of fields.filter((e) => !e.is_pk)) {
      let value = [] as Array<string>;
      if (["has-one", "has-many"].includes(item.type)) {
        value = get(item, "value.checked") as any;
      }
      const field = newField(item, { parent_table: table, value });
      childs.push(field);
    }
    childs.push(
      createItem({
        name: "btn-wrapper",
        layout: { dir: "row", align: "top-left", gap: 0, wrap: "flex-nowrap" },
        padding: { l: 10, b: 10, t: 10, r: 10 },
        childs: [
          createItem({
            component: {
              id: "a15d152d-0118-408f-89f1-f6b2dfbd2e05",
              props: {
                on_click: [
                  `\
            () => {
              fm.submit();
            }
            `,
                ],
              },
            },
          }),
        ],
      })
    );
    // console.log({ childs });
    if (commit) {
      Object.keys(result).map((e) => {
        item.edit.setProp(e, result[e]);
      });
      item.edit.setProp("body", {
        mode: "jsx",
        value: createItem({
          name: "item",
          childs: childs,
        }),
      });
      await item.edit.commit();
    } else {
      console.log({data})
      set(data, "body.value.childs", childs);
      Object.keys(result).map((e) => {
        set(data, e, result[e]);
      });
      return 
    }
  }
};
