export const on_load = ({
  pk,
  table,
  select,
  pks,
}: {
  pk: string;
  table: string;
  select: any;
  pks: Record<string, string>;
}) => {
  const sample = {} as any;

  for (const [k, v] of Object.entries(select) as any) {
    if (typeof v === "object") {
      sample[k] = {};

      Object.keys(v.select)
        .filter((e) => e !== pks[k])
        .map((e) => {
          sample[k][e] = "sample";
        });
    } else {
      sample[k] = "sample";
    }
  }

  return `\
(arg: TableOnLoad) => {
  if (isEditor) return [${JSON.stringify(sample)}];

  return new Promise(async (done) => {
    if (arg.mode === 'count') {
      return await db.${table}.count();
    }

    const items = await db.${table}.findMany({
      select: ${JSON.stringify(select, null, 2).split("\n").join("\n    ")},
      orderBy: arg.orderBy || {
        ${pk}: "desc"
      },
      ...arg.paging,
    });

    done(items);
  })
}

type TableOnLoad = {
  reload: () => Promise<void>;
  orderBy?: Record<string, "asc" | "desc">;
  paging: { take: number; skip: number };
  mode: 'count' | 'query';
  where?: any
}
`;
};
