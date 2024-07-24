export const set_value = ({
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
  (arg: {
    selected: any[];
    options: { label: string; value: string; item?: string }[];
    fm: FMLocal;
    name: string;
    type: string;
  }) => {
    const { selected, options, fm, name, type } = arg;
    if (type === "single-option") {
      if (selected[0]) {
        fm.data[name] = {
          connect: {
            ${pk}: selected[0],
          },
        };
      } else if (fm.data["${pk}"]) {
        fm.data[name] = {
          disconnect: true,
        };
      }
    } else {
      fm.data[name] = selected.map((e) => e);
    }
    fm.render();
  }
  `
};
