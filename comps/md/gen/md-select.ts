export const generateSelect = (data: Array<any>) => {
  const select = {} as any;
  let pk = "";
  for (const f of data) {
    select[f.name] = true;
    if (f.relation) {
      select[f.name] = {
        select: {},
      };
      for (const r of f.relation.fields) {
        select[f.name].select[r.name] = true;
      }
    }
    if (f.is_pk) {
      pk = f.name;
    }
  }
  return {
    pk,
    select,
  };
};
