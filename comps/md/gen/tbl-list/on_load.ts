export const on_load = ({
  pk,
  table,
  select,
  pks,
  fields,
}: {
  pk: string;
  table: string;
  select: any;
  pks: Record<string, string>;
  fields: Array<any>;
}) => {
  const sample = {} as any;

  for (const [k, v] of Object.entries(select) as any) {
    if (typeof v === "object") {
      const val = {} as any;
      Object.keys(v.select)
        .filter((e) => e !== pks[k])
        .map((e) => {
          val[e] = "sample";
        });
      const field = fields.find((e) => e.name === k);
      sample[k] = val;
      if (field) {
        if (field.type === "has-many") {
          sample[k] = [val];
        }
      }
    } else {
      sample[k] = "sample";
    }
  }

  return `\
async (arg: TableOnLoad) => {
  if (isEditor)
    return [${JSON.stringify(sample)}];

  let where = arg.where;
  if (arg.mode === "count") {
    return await db.${table}.count({
      where: {
        ...where,
      },
    });
  }

  return new Promise(async (done, reject) => {
    try {
      //@ts-ignore
      const fields = parseGenField(gen__fields);
      const gen = generateSelect(fields);

      const result = {items: []}
      result.items = await db.${table}.findMany({
        select: gen.select,
        orderBy: arg.orderBy || {
          ${pk}: "desc",
        },
        where: {
          ...where,
        },
        ...arg.paging,
      });

      await call_prasi_events("tablelist", "after_load", ["${table}", result.items, (input) => {
        result.items = input;
      }]);

      done(result.items);
    } catch(e) {
      reject(e);
    }
  });
};

type TableOnLoad = {
  reload: () => Promise<void>;
  orderBy?: Record<string, "asc" | "desc">;
  paging: { take: number; skip: number };
  mode: "count" | "query";
  where?: any;
}`;
};
