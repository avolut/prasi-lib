import { GFCol } from "../utils";

export const on_load = ({
  pk,
  table,
  select,
  pks,
  opt,
}: {
  pk: GFCol;
  table: string;
  select: any;
  pks: Record<string, string>;
  opt?: {
    before_load: string;
    after_load: string;
  };
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
async (opt) => {
  if (isEditor) return ${JSON.stringify(sample)};

  let raw_id = params.id;
  if (typeof md === 'object' && md.selected && md.master?.pk) {
    const pk = md.master?.pk?.name;
    if (md.selected[pk]) {
      raw_id = md.selected[pk]; 
    }
  }

  ${
    opt?.before_load
      ? opt.before_load
      : `let id = ${pk.type === "int" ? "parseInt(raw_id)" : "raw_id"};`
  }
  
  let item = {};
  if (id){
    item = await db.${table}.findFirst({
      where: {
        ${pk.name}: id,
      },
      select: ${JSON.stringify(select, null, 2).split("\n").join("\n      ")},
    });

    ${opt?.after_load ? opt?.after_load : ""}

    return item;
  } else {
    ${opt?.after_load ? opt?.after_load : ""}
  }
}`;
};
