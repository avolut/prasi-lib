export const gen_props_table = async () => {
  const result = [{ value: "", label: "" }];
  return [
    ...result,
    ...(await db._schema.tables()).map((e) => ({
      value: e,
      label: e,
      reload: ["gen_fields", "gen_label"],
    })),
  ];
};
