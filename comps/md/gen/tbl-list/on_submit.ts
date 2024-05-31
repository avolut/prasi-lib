import { GFCol } from "lib/gen/utils";


export const on_submit = ({
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
  const id = pk;

  return `\
async ({ form, error }: IForm) => {
  if (typeof form !== "object") return false;
  if (typeof error === "object" && Object.keys(error).length > 0) return false;

  let original_actions = [];
  if (typeof md === "object") {
    original_actions = md.actions;
    md.actions = [{ label: <>...</> }];
    md.render();
  }

  let result = false;
  try { 
    const data = { ...form };
    delete data.${id};

    if (data) {
      const pks = ${JSON.stringify(pks)};
      for (const [k, v] of Object.entries(pks)) {
        if (typeof data[k] === 'object') {
          if (data[k] === null) {
            data[k] = {
              disconnect: true
            }
          }
          if (data[k][v]) {
            data[k] = {
              connect: {
                [v]: data[k][v]
              }
            }
          }
        }
      }
    }

    if (form.${id}) {
      await db.${table}.update({
        where: {
          ${id}: form.${id},
        },
        data,
      });
    } else {
      const res = await db.${table}.create({
        data,
        select: { ${id}: true },
      });
      if (res) form.${id} = res.${id};
    }
    
    result = true;
  } catch (e) {
    console.error(e);
    result = false;
  }

  if (typeof md === "object") {
    md.actions = original_actions;
    md.selected = null;
    md.render();
  }

  return result;
};

type IForm = { form: any; error: Record<string, string> }`;
};
