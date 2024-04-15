import { GFCol } from "../utils";

export const on_load = ({
  pk,
  table,
  select,
  pks,
  opt,
  id_parent,
}: {
  pk: GFCol;
  table: string;
  select: any;
  pks: Record<string, string>;
  opt?: {
    before_load: string;
    after_load: string;
  };
  id_parent: string;
}) => {
  const sample: any = {};
  for (const [k, v] of Object.entries(select) as any) {
    if (typeof v === "object") {
      sample[k] = {};

      Object.keys(v.select).map((e) => {
        sample[k][e] = "sample";
      });
    } else {
      sample[k] = "sample";
    }
  }

  return `\
async (opt: { value: any }) => {
  if (isEditor) return { items: [${JSON.stringify(sample)}], pk: "${pk.name}" };

  let raw_id = opt.value;
  ${
    opt?.before_load
      ? opt.before_load
      : `let id = ${pk.type === "int" ? "parseInt(raw_id)" : "raw_id"};`
  }
  
  let items = await db.${table}.findMany({
    select: ${JSON.stringify(select, null, 2).split("\n").join("\n      ")},
  });

  return { items, pk: "${pk.name}" };
}`;
};
