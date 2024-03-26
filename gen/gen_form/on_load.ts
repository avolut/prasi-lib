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
  return `\
async (opt) => {
  if (isEditor) return {};

  let id = ${pk.type === "int" ? "parseInt(params.id)" : "params.id"};
  ${opt?.before_load}
  
  let item = {};
  if (id){
    item = await db.${table}.findFirst({
      where: {
        ${pk.name}: id,
      },
      select: ${JSON.stringify(select, null, 2).split("\n").join("\n      ")},
    });

    for (const [k, v] of Object.entries(item)) {
    ${Object.entries(pks)
      .map(([k, v]) => {
        return `\
      if (k === "${k}") {
        if (v?.["${v}"]) item[k] = { connect: { ${v}: v?.["${v}"] } } as any;
        else delete item[k];
      }`;
      })
      .join("\n")}

    ${opt?.after_load}

    return item;
  } else {
    ${opt?.after_load}
  }
}`;
};
