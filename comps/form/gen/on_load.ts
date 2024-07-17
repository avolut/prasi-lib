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
    is_md?: boolean | string;
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

  let is_md: string | boolean =
    typeof opt?.is_md === "undefined" ? true : !!opt?.is_md;
  if (!is_md) is_md = "";

  return `\
async (opt) => {
  if (isEditor) return ${JSON.stringify(sample, null, 2)};

  let raw_id = params.id;
${
  is_md &&
  `\
  if (typeof md === 'object' && md.selected && md.pk) {
    const pk = md.pk?.name;
    if (md.selected[pk]) {
      raw_id = md.selected[pk]; 
    }
  }
`
}
  call_prasi_events("form", "before_load", [opt?.fm]);

  ${opt?.before_load ? opt.before_load : `let id = raw_id`}
  let item = {};
  if (id){
    //@ts-ignore
    const table = db[gen__table] as any;
    //@ts-ignore
    const fields = parseGenField(gen__fields);

    if (Array.isArray(fields)) {
      const pk = fields.find((e) => e.is_pk);
      if (pk && pk.type === "int") id = parseInt(id);
    }

    let where = {
      ${pk}: id,
    };
    
    const gen = generateSelect(fields);
    item = await table?.findFirst({
      where,
      select: gen.select,
    });

    setTimeout(() => {
      call_prasi_events("form", "after_load", [opt?.fm]);

      ${opt?.after_load ? opt?.after_load : ""}
      
    });

    return item;
  } else {
    ${opt?.after_load ? opt?.after_load : ""}
  }
}`;
};
