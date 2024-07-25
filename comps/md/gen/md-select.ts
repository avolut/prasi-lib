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
        if (r.type === "has-one") {
          select[f.name].select[r.name] = { select: {} };
          for (const rel of r.relation.fields) {
            select[f.name].select[r.name].select[rel.name] = true;
          }
        } else {
          select[f.name].select[r.name] = true;

          if (r.relation) {
            if (r.relation?.fields) {
              select[f.name].select[r.name] = {
                select: generateSelect(r.relation?.fields).select,
              };
            }
          }
        }
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
