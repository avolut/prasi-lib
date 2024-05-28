import get from "lodash.get";
import { select } from "./select";

type typeFieldLogin = {
  username: string;
  password: string;
};
export const generateLogin = async (
  item: PrasiItem,
  rel: any,
  field: typeFieldLogin
) => {
  console.log({ item, rel, coba: item.edit.childs[0].edit.childs[0] });
  const item_form: any = get(
    item,
    "edit.childs[0].edit.childs[0].edit.props.body.value"
  );
  const form: PrasiItem = item_form;
  const filterField = form.edit.childs.filter(
    (e: any) =>
      get(e, "component.id") !== "32550d01-42a3-4b15-a04a-2c2d5c3c8e67"
  );
  form.edit.childs[0].edit.setProp("name", field.username)
  // form.edit.childs[1].edit.setProp("name", field.password)
  let rels = { ...rel };
  try {
    delete rels[field.password];
  } catch (e) {}
  const field_select = select(rels);
  item.edit.childs[0].edit.childs[0].edit.setProp("on_submit", {
    mode: "raw",
    value: `\
    async ({ form, error }: IForm) => {
        const user = await db.m_user.findFirst({
            where: {
              username: form.${field.username},
            },
            select: {
              id: true,
              ${field.username}: true,
              ${field.password}: true
            }
          });
        if(user){
            const same = await password.match(form.${field.password}, user.${
      field.password
    });
            if(same){
                const data_user = await db.m_user.findFirst({
                    where: {
                      ${field.username}: form.${field.username}
                    },
                    select: ${JSON.stringify(field_select)}
                  });
                  if (data_user) {
                    registerSession({ data: data_user, expired: null });
                    const home = prasi_user.prasi_home[prasi_user.user.m_role.name];
                    navigate(home);
                  }
            }else{
                alert("password salah");
            }

        }else{
            alert("user belum terdaftar")
        }

    };

    type IForm = { form: any; error: Record<string, string> }
    `,
  });
  await item.edit.commit();
};
