export const on_load_rel = ({
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
  const sample = {
    label: "sample",
    value: "sample",
    data: null,
  } as any;
  const cols = [];
  for (const [k, v] of Object.entries(select) as any) {
    if (k !== pk && typeof v !== "object") {
      cols.push(k);
    }
  }

  return `\
(arg: {
  reload: () => Promise<void>;
  orderBy?: Record<string, "asc" | "desc">;
  paging: { take: number; skip: number };
  mode: 'count' | 'query'
}) => {
  if (isEditor) return [${JSON.stringify(sample)}];

  return new Promise(async (done) => {
    if (arg.mode === 'count') {
      return await db.${table}.count();
    }

    const fields = parseGenField(rel__gen_fields);
    const res = generateSelect(fields);

    const items = await db.${table}.findMany({
      select: {
        ...${JSON.stringify(select)}, 
        ...(res?.select || {}) 
      },
      orderBy: arg.orderBy || {
        ${pk}: "desc"
      },
      ...arg.paging,
    });
    if(items.length){
      const cols = ${JSON.stringify(cols)};
      const getLabel = (data: any)  => {
        const result = [];
        cols.map((e) => {
          if(data[e]){
            result.push(data[e]);
          }
        })
        return result.join(" - ");
      }
      
      let blank: any = undefined;
      if (ext__required !== "y") {
        blank = { value: undefined, label: "", data: {} };
      }
      done(
        [
          blank,
          ...items.map((e) => {
            return {
              value: e.${pk},
              label: getLabel(e),
              data: e,
            };
          }),
        ].filter((e) => e),
      );
    } else {
      done([])
    }
  })
}
  `;
};
