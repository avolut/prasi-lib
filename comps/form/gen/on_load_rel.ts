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
    const sample = {} as any;
    const cols = [];
    for (const [k, v] of Object.entries(select) as any) {
      if(k !== pk && typeof v !== "object"){
        cols.push(k);
      }
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
  
      const items = await db.${table}.findMany({
        select: ${JSON.stringify(select)},
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
        done(items.map((e) => {
            return {
                value: e.${pk},
                label: getLabel(e),
            }
        }))
      } else {
        done([])
      }
    })
  }
  `;
  };
  