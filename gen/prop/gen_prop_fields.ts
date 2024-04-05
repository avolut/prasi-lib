export const gen_prop_fields = async (gen_table: string) => {
  const result: {
    label: string;
    value: string;
    options?: any[];
    checked?: boolean;
  }[] = [];
  const fields = await db._schema.columns(gen_table);
  for (const [k, v] of Object.entries(fields)) {
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
  const rels = await db._schema.rels(gen_table);
  for (const [k, v] of Object.entries(rels)) {
    let options = [];
    const to = v.to;
    const from = v.from;
    const fields = await db._schema.columns(v.to.table);
    for (const [k, v] of Object.entries(fields)) {
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
  return result;
};
