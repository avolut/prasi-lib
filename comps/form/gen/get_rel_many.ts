import get from "lodash.get";

export const get_rel_many = (data: Array<any>) => {
  const rel = [] as Array<{ table: string; fk: string }>;
  if (Array.isArray(data) && data.length) {
    const has_many = data.filter((e: any) => e.type === "has-many") || [];
    if (has_many.length) {
      has_many.map((e) => {
        rel.push({
          table: e.name,
          fk: get(e, "relation.to.fields[0]"),
        });
      });
    }
  }
  return rel
};
