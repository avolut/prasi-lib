export const gen_label = ({
  pk,
  table,
  select
}: {
  pk: string;
  table: string;
  select: any;
}) => {
  const sample = {} as any;
  const cols = [];
  for (const [k, v] of Object.entries(select) as any) {
    if (k !== pk && typeof v !== "object") {
      cols.push(k);
    }
  }

  return `\
    (row: { value: string; label: string; item?: any }) => {
      const cols = ${JSON.stringify(cols)};
      const getLabel = (data: any) => {
        const result = [];
        cols.map((e) => {
          if (data[e]) {
            result.push(data[e]);
          }
        });
        return result.join(" - ");
      };
      if (isEditor) {
        return row.label;
      }
      return getLabel(row.item);
    }
  `;
};
