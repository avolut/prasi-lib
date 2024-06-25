import { get as kget, set as kset } from "@/utils/idb-keyval";

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

export const gen_prop_fields = async (gen_table: string, depth?: number) => {
  if (typeof db === "undefined") return ["- No Database -"];

  const path = window.location.pathname;
  let id_site = null;
  try {
    id_site = path.split("/")[2];
  } catch (e) {
    id_site = window.location.hostname;
  }
  return await loadSchemaLayer(
    id_site,
    typeof depth === "undefined" ? 3 : depth,
    {},
    gen_table
  );
};

const loadSchemaLayer = async (
  id_site: string,
  depth: number,
  arg: any,
  table: string
) => {
  let current_depth = 1;
  const result = await get_layer(id_site, depth, current_depth, arg, table);
  return result;
};

const get_layer = async (
  id_site: string,
  depth: number,
  current: number,
  arg: any,
  table: string
) => {
  const { cols, rels } = await loadSingle(id_site, table);
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
          id_site,
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

const loadSingle = async (id_site: string, table: string) => {
  const ls_key = `schema-md-${id_site}`;
  const idb_key = `${id_site}-${table}`;
  let cached_raw = localStorage.getItem(ls_key);
  let cached_keys: string[] = [];
  if (cached_raw) {
    try {
      let res = JSON.parse(cached_raw);
      if (!Array.isArray(res)) {
        localStorage.setItem(ls_key, JSON.stringify([]));
        res = [];
      }
      cached_keys = res;
    } catch (e) {}
  }

  let cached = null;
  if (cached_keys.includes(table)) {
    cached = await kget(idb_key);
  }

  if (!single[table]) {
    if (cached) {
      single[table] = cached;
    } else {
      single[table] = {
        cols: await db._schema.columns(table as any),
        rels: await db._schema.rels(table as any),
      };
      await kset(idb_key, single[table]);
      localStorage.setItem(ls_key, JSON.stringify([...cached_keys, table]));
    }
  }
  return single[table];
};
