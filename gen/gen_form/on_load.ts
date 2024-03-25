import { GFCol } from "./type";

export const on_load = ({
  pk,
  table,
  select,
  pks,
}: {
  pk: GFCol;
  table: string;
  select: any;
  pks: Record<string, string>;
}) => {
  return `\
async (opt) => {
  if (isEditor) return {};

  let id = ${pk.type === "int" ? "parseInt(params.id)" : "params.id"};

  if (id){
    const item = await db.${table}.findFirst({
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
        item[k] = { connect: { ${v}: v["${v}"] } } as any;
      }`;
      })
      .join("\n")}
    }

    return item;
  }
}`;
};
