import { formatName, GFCol } from "./fields";

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
        sample[k][e] = formatName(e);
      });
    } else {
      sample[k] = formatName(k);
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
    const table = db[gen__table] as any;
    const fields = parseGenField(gen__fields);

    if (Array.isArray(fields)) {
      const pk = fields.find((e) => e.is_pk);
      //@ts-ignore
      if (pk && pk.type === "int") id = parseInt(id);
    }

    try {
      const gen = generateSelect(fields);
      const select = {
        ...gen.select,
      } as Prisma.${table}Select;
      let where = {
        id: id,
      } as Prisma.${table}WhereInput;

      item = await table?.findFirst({
        where,
        select: gen.select,
      });
    } catch (e) {
      item = null;
      console.error(e);
    }

    setTimeout(() => {
      call_prasi_events("form", "after_load", [opt?.fm]);

      ${opt?.after_load ? opt?.after_load : ""}
      
    });

    return item;
  } else {
    call_prasi_events("form", "after_load", [opt?.fm]);
    ${opt?.after_load ? opt?.after_load : ""}
  }
}`;
};
