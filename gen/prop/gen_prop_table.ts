const cache: any = [];

export const gen_props_table = async () => {
  if (cache.length > 0) return cache;

  const result = [{ value: "", label: "" }];
  const final = [
    ...result,
    ...(await db._schema.tables()).map((e) => ({
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
