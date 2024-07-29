import { GenFormArgs } from "./types";

export const genFormOnSubmit = ({
  result,
  pk,
  pks,
  table,
  select,
  is_md,
  rel_many
}: GenFormArgs) => {
  result.on_submit = {
    mode: "raw",
    value: `\
async ({ form, error, fm }: IForm) => {
  let result = false;
  try {${
    is_md &&
    `\
    if (typeof md !== "undefined") {
      fm.status = "saving";
      md.render();
    }`
  }
    const data = { ...form };
    const record = {} as Record<string, any>;

    const relation_ref = ${JSON.stringify(rel_many)};
    const has_many = [] as Array<{
      table: string;
      data: Array<any>;
      fk: string;
    }>;


    // validasi
    fm.error.clear();
    for (const [k, field] of Object.entries(fm.fields)) {
      validateField(field, fm);
    }
${
  is_md &&
  `\
    if (fm.error.list.length > 0) {
      if (typeof md !== "undefined") {
        fm.status = "ready";
        md.render();
      }
      return false;
    }`
}

    call_prasi_events("form", "before_save", [fm, data]);

    // pisahkan antara has_many dengan field biasa
    for (const [k, v] of Object.entries(data) as any) {
      if (Array.isArray(v)) {
        const rel =
          Array.isArray(relation_ref) && relation_ref.length
            ? relation_ref.find((e) => e.table === k)
            : null;
        if (rel) {
          has_many.push({
            table: k,
            data: v,
            fk: rel.fk,
          });
        }
      } else {
        record[k] = v;
      }
    }

    // prisma create / update ga boleh ada record.${pk}
    if (record) delete record.${pk};

    if (form.${pk}) {
      await db.${table}.update({
        where: {
          ${pk}: form.${pk},
        },
        data: {
          ...record,
        },
      });
    } else {
      const res = await db.${table}.create({
        //@ts-ignore
        data: {
          ...record,
        },
      });
      
      if (res) {
        form.id = res.id;
        fm.is_newly_created = true;
      }
    }

    if (has_many.length) {
      const exec_query_bulk = async (
        current: { table: string; data: Array<any>; fk: string },
        list: Array<{ table: string; data: Array<any>; fk: string }>,
        index: number,
      ) => {
        if (list.length) {
          const data = current.data.map((e) => {
            const record =  {
              ...e,
              ${table}: {
                connect: {
                  ${pk}: form.${pk},
                },
              },
            };

            call_prasi_events("form", "before_save", [fm, record]);

            return record;
          });
          await db._batch.upsert({
            table: current.table,
            where: {
              [current.fk]: form.${pk},
            },
            data: data,
            mode: "relation",
          } as any);

          if (list.length > 1) {
            try {
              index++;
              if (index <= list.length - 1) {
                await exec_query_bulk(list[index], list, index);
              }
            } catch (ex) {}
          }
        }
      };
      await exec_query_bulk(has_many[0], has_many, 0);
    }
    result = true;
  
    call_prasi_events("form", "after_save", [fm, data]);

    ${
      is_md &&
      `if (typeof md !== "undefined") {
      fm.status = "ready";
      fm.data = form;
      md.selected = form;
      md.render();
      fm.render();

      if (fm.props.back_on_save === "y") {
        md.selected = null;
        md.tab.active = "master";
        md.internal.action_should_refresh = true;
        md.params.apply();
        md.render();
      }
    }`
    }
  } catch (e) {
    console.error(e);
    result = false;
  }

  return result;
};

type IForm = { form: any; error: Record<string, string>; fm: FMLocal }
`,
  };
};
