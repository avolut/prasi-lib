import { GFCol } from "./fields";

export const on_load = ({
  pk,
  table,
  select,
  pks,
  opt,
}: {
  pk: string;
  table: string;
  select: any;
  pks: Record<string, string>;
  opt?: {
    before_load?: string;
    after_load?: string;
  };
}) => {
  const sample: any = {};
  for (const [k, v] of Object.entries(select) as any) {
    if (typeof v === "object") {
      sample[k] = {};

      Object.keys(v.select).map((e) => {
        sample[k][e] = "sample";
      });
    } else {
      sample[k] = "sample";
    }
  }

  return `\
async (opt) => {
  if (isEditor) return ${JSON.stringify(sample)};

  let raw_id = params.id;
  if (typeof md === 'object' && md.selected && md.pk) {
    const pk = md.pk?.name;
    if (md.selected[pk]) {
      raw_id = md.selected[pk]; 
    }
  }
  if (parseInt(raw_id)) raw_id = parseInt(raw_id);

  ${opt?.before_load ? opt.before_load : `let id = raw_id`}
  let item = {};
  let where = {
    ${pk}: id,
  };
  if (id){
    //@ts-ignore
    const table = db[gen__table] as any;
    //@ts-ignore
    const fields = parseGenField(gen__fields);

    if (Array.isArray(fields)) {
      const pk = fields.find((e) => e.is_pk);
      if (pk && pk.type === "int") id = parseInt(id);
    }

    const gen = generateSelect(fields);
    item = await table?.findFirst({
      where,
      select: gen.select,
    });

    ${opt?.after_load ? opt?.after_load : ""}

    return item;
  } else {
    ${opt?.after_load ? opt?.after_load : ""}
  }
}`;
};
