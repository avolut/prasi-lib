import { isEmptyString } from "lib/utils/is-empty-string";

export const on_load_rel = ({
  pk,
  table,
  select,
  pks,
  type
}: {
  pk: string;
  table: string;
  select: any;
  pks: Record<string, string>;
  type?: string;
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
async (arg: {
  reload: () => Promise<void>;
  orderBy?: Record<string, "asc" | "desc">;
  paging: { take: number; skip: number };
  mode: 'count' | 'query'
}) => {
  if (isEditor) return [${JSON.stringify(sample)}];
  if (arg.mode === 'count') {
    return await db.${table}.count();
  }

  return new Promise(async (done) => {
    ${!isEmptyString(type) && ["checkbox", "typeahead", "button"].includes(type as any) ? `` : `const fields = parseGenField(rel__gen_fields);
    const res = generateSelect(fields);`}


    const is_tree =
      typeof rel__feature !== "undefined" &&
      Array.isArray(rel__feature) &&
      rel__feature.includes("tree");
      
    if (is_tree && typeof rel__id_parent === "string" && rel__id_parent) {
      res.select[rel__id_parent] = true;
    }

    const items = await db.${table}.findMany({
      ${!isEmptyString(type) && ["checkbox", "typeahead", "button"].includes(type as any) ? `` : `select: {
        ...${JSON.stringify(select)}, 
        ...(res?.select || {}) 
      },`}
      orderBy: arg.orderBy || {
        ${pk}: "desc"
      },
      ...arg.paging,
    });

    if (is_tree && typeof rel__id_parent === "string" && rel__id_parent) {
      items = sortTree(items, rel__id_parent, "${pk}");
    }

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
