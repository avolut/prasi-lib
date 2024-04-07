import { GFCol } from "../utils";

export const on_submit = ({
  pk,
  table,
  select,
  pks,
}: {
  pk: GFCol;
  table: string;
  select: any;
  pks: Record<string, string>;
}) => {
  const id = pk.name;

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
