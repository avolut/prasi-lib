export const gen_label = ({
  pk,
  table,
  select,
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
  
  if (isEditor) {
    return row.label;
  }
  const result = [];
  if (!!row.item && !Array.isArray(row.item)) {
    cols.map((e) => {
      if (row.item[e]) {
        result.push(row.item[e]);
      }
    });
    return result.join(" - ");
  }
  return row.label;
}
  `;
};
