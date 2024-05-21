export const generateLogin = async (item: PrasiItem, rel: any) => {
  console.log({ item, rel , coba: item.edit.childs[0].edit.childs[0]});
  item.edit.childs[0].edit.childs[0].edit.setProp("on_submit", {
    mode: "raw",
    value: `\
    async ({ form, error }: IForm) => {
        const user = await db.m_user.findFirst({
            where: {
              username: form.username,
            },
            select: {
              id: true,
              username: true,
              password: true
            }
          });
        if(user){
            const same = await password.match(form.password, user.password);
            if(same){
                const data_user = await db.m_user.findFirst({
                    where: {
                      username: form.username
                    },
                    select: {
                      id: true,
                      username: true,
                      m_role: true
                    }
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
  })
  await item.edit.commit();
};
