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
    if (typeof error === "object" && Object.keys(error).length > 0)
      return {};

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
  
    if (md.mode !== "breadcrumb") {
      md.cache("master")?.reload();
    }
    
    return true;
  };
  
  type IForm = { form: any; error: Record<string, string> }`;
};
