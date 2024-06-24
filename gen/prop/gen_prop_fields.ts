import get from "lodash.get";

const single = {} as Record<
  string,
  {
    cols: Record<
      string,
      {
        is_pk: boolean;
        type: string;
        optional: boolean;
        db_type: string;
        default?: any;
      }
    >;
    rels: Record<
      string,
      {
        type: "has-many" | "has-one";
        to: {
          table: string;
          fields: string[];
        };
        from: {
          table: string;
          fields: string[];
        };
      }
    >;
  }
>;

const load_single = async (table: string) => {
  if (!single[table]) {
    single[table] = {
      cols: await db._schema.columns(table as any),
      rels: await db._schema.rels(table as any),
    };
  }
  return single[table];
};
export const gen_prop_fields = async (gen_table: string, depth?: number) => {
  if (typeof db === "undefined") return ["- No Database -"];

  const path = window.location.pathname;
  let id_site = null;
  try {
    id_site = path.split("/")[2];
  } catch (e) {
    id_site = window.location.hostname;
  }
  const schema = getSchemaOnStorage(id_site, gen_table);
if (!schema) {
    console.log({depth})
    const result = await load_layer_schema(
      typeof depth === "undefined" ? 3 : depth,
      {},
      gen_table
    );
    // const { cols, rels } = await load_single(gen_table);
    // if (cols) {
    //   for (const [k, v] of Object.entries(cols) as any) {
    //     result.push({
    //       value: JSON.stringify({
    //         name: k,
    //         is_pk: v.is_pk,
    //         type: v.db_type || v.type,
    //         optional: v.optional,
    //       }),
    //       label: k,
    //       checked: v.is_pk,
    //     });
    //   }
    // }
    // if (rels) {
    //   for (const [k, v] of Object.entries(rels)) {
    //     let options = [] as any;
    //     const to = v.to;
    //     const from = v.from;
    //     const parent_name = k;
    //     const parent_rel = v;
    //     if (to) {
    //       const { cols, rels } = await load_single(to.table);
    //       // if (cols) {
    //       //   for (const [k, v] of Object.entries(cols)) {
    //       //     options.push({
    //       //       value: JSON.stringify({
    //       //         name: k,
    //       //         is_pk: v.is_pk,
    //       //         type: v.db_type || v.type,
    //       //         optional: v.optional,
    //       //       }),
    //       //       label: k,
    //       //       checked: v.is_pk,
    //       //     });
    //       //   }
    //       // }
    //       // if (rels) {
    //       //   for (const [k, v] of Object.entries(rels)) {
    //       //     let sub_opt = [];
    //       //     const to = v.to;
    //       //     const from = v.from;
    //       //     const { cols } = await load_single(v.to.table);
    //       //     for (const [k, v] of Object.entries(cols)) {
    //       //       sub_opt.push({
    //       //         value: JSON.stringify({
    //       //           name: k,
    //       //           is_pk: v.is_pk,
    //       //           type: v.db_type || v.type,
    //       //           optional: v.optional,
    //       //         }),
    //       //         label: k,
    //       //         checked: v.is_pk,
    //       //       });
    //       //     }
    //       //     options.push({
    //       //       value: JSON.stringify({
    //       //         name: k,
    //       //         is_pk: false,
    //       //         type: v.type,
    //       //         optional: true,
    //       //         relation: { from, to },
    //       //       }),
    //       //       label: k,
    //       //       options: sub_opt,
    //       //       checked:
    //       //         parent_rel.type === "has-many" &&
    //       //         parent_rel.from.table === v.to.table,
    //       //     });
    //       //   }
    //       // }
    //     }
    //     result.push({
    //       value: JSON.stringify({
    //         name: k,
    //         is_pk: false,
    //         type: v.type,
    //         optional: true,
    //         relation: { from, to },
    //       }),
    //       label: k,
    //       options,
    //     });
    //   }
    // }
    try {
      saveSchemaOnStorage(result, id_site, gen_table);
    } catch (e: any) {
      console.error(e.message);
    }
    console.log({result})
    return result;
  } else {
    console.log({schema})
    return schema;
  }
};
const load_layer_schema = async (depth: number, arg: any, table: string) => {
  let current_depth = 1;
  console.log({ depth, current_depth, arg, table });
  const result = await get_layer(depth, current_depth, arg, table);
  console.log({ result });
  return result;
};
const get_layer = async (
  depth: number,
  current: number,
  arg: any,
  table: string
) => {
  const { cols, rels } = await load_single(table);
  console.log({cols, rels , table})
  const options = [];
  if (cols) {
    for (const [k, v] of Object.entries(cols)) {
      options.push({
        value: JSON.stringify({
          name: k,
          is_pk: v.is_pk,
          type: v.db_type || v.type,
          optional: v.optional,
        }),
        label: k,
        checked: v.is_pk,
      });
    }
  }

  if (current < depth) {
    if (rels) {
      for (const [k, v] of Object.entries(rels)) {
        const to = v.to;
        const from = v.from;
        const r_rels = (await get_layer(
          depth,
          current + 1,
          arg,
          v.to.table
        )) as any;
        options.push({
          value: JSON.stringify({
            name: k,
            is_pk: false,
            type: v.type,
            optional: true,
            relation: { from, to },
          }),
          label: k,
          options: r_rels,
          checked: false,
        });
      }
    }
  }
  return options;
};
const saveSchemaOnStorage = (res: any, id_site: string, table: string) => {
  let schemaSite = null;
  let schema_master_detail: Record<string, any> = {};
  const keys = `schema-md-${id_site}`;
  try {
    let smd = localStorage.getItem(keys) as string;
    schemaSite = JSON.parse(smd);
  } catch (error) {}
  try {
    schema_master_detail = {
      ...schemaSite,
      [table]: JSON.stringify(res),
    };
    localStorage.setItem(keys, JSON.stringify(schema_master_detail));
  } catch (e: any) {
    console.error(e.message);
  }
};
const getSchemaOnStorage = (id_site: string, table: string) => {
  const keys = `schema-md-${id_site}`;
  let schemaSite = null;
  try {
    let smd = localStorage.getItem(keys) as string;
    schemaSite = JSON.parse(smd);
  } catch (error) {}
  const schema = get(schemaSite, `${table}`);
  if (schema) return JSON.parse(schema);
  return null;
};
