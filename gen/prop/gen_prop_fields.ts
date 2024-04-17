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
      cols: await db._schema.columns(table),
      rels: await db._schema.rels(table),
    };
  }
  return single[table];
};

export const gen_prop_fields = async (gen_table: string) => {
  const result: {
    label: string;
    value: string;
    options?: any[];
    checked?: boolean;
  }[] = [];
  const { cols, rels } = await load_single(gen_table);
  if (cols) {
    for (const [k, v] of Object.entries(cols) as any) {
      result.push({
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
  if (rels) {
    for (const [k, v] of Object.entries(rels)) {
      let options = [];
      const to = v.to;
      const from = v.from;
      const parent_name = k;
      const parent_rel = v;
      const { cols, rels } = await load_single(v.to.table);
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
      if (rels) {
        for (const [k, v] of Object.entries(rels)) {
          let sub_opt = [];
          const to = v.to;
          const from = v.from;
          const { cols } = await load_single(v.to.table);
          for (const [k, v] of Object.entries(cols)) {
            sub_opt.push({
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
          options.push({
            value: JSON.stringify({
              name: k,
              is_pk: false,
              type: v.type,
              optional: true,
              relation: { from, to },
            }),
            label: k,
            options: sub_opt,
            checked:
              parent_rel.type === "has-many" &&
              parent_rel.from.table === v.to.table,
          });
        }
      }
      result.push({
        value: JSON.stringify({
          name: k,
          is_pk: false,
          type: v.type,
          optional: true,
          relation: { from, to },
        }),
        label: k,
        options,
      });
    }
  }

  return result;
};
