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
(row: { value: string; label: string; data?: any }) => {
  const cols = ${JSON.stringify(cols)};
  
  if (isEditor) {
    return row.label;
  }
  const result = [];
  if (!!row.data && !row.label && !Array.isArray(row.data)) {
    if(cols.length > 0){
      cols.map((e) => {
        if (row.data[e]) {
          result.push(row.data[e]);
        }
      });
      return result.join(" - ");
    } else {
      const fields = parseGenField(rel__gen_fields);
      return fields
        .filter((e) => !e.is_pk)
        .map((e) => row.data[e.name])
        .filter((e) => e)
        .join(" - ");
    }
  }
  return row.label;
}
  `;
};
