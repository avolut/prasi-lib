const cache: any = [];

export const gen_props_table = async () => {
  if (cache.length > 0) return cache;

  const tables = await db._schema.tables();
  if (!Array.isArray(tables)) {
    alert("WARNING: failed to get tables from app server");
    return [];
  }

  const result = [{ value: "", label: "" }];
  const final = [
    ...result,
    ...tables.map((e) => ({
      value: e,
      label: e,
      reload: ["gen_fields", "gen_label"],
    })),
  ];

  for (const f of final) {
    cache.push(f);
  }

  return cache;
};
