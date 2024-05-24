import { select } from "@/preset/login/utils/select";
import get from "lodash.get";
import set from "lodash.set";

type typeFieldLogin = {
  upload: string;
};
export const generateProfile = async (
  item: PrasiItem,
  rel: any,
  table: string,
  field: typeFieldLogin
) => {
  console.log({ rel, item });
  const profile =
    item.edit.childs[0].edit.childs[0].edit.childs[0].edit.childs.find(
      (item) =>
        get(item, "component.id") === "29b55441-73b2-4104-899a-d51efe05bfa8"
    );
  const btn =
    item.edit.childs[0].edit.childs[0].edit.childs[0].edit.childs.find(
      (item) => get(item, "name") === "list-button"
    );
  if (profile) {
    profile.edit.setProp("image_url", {
      mode: "raw",
      value: `\
        profile
            `,
    });
  }
  console.log({btn})
  if (btn) {
    const upload = btn.edit.childs.find(
      (e) => get(e, "component.id") === "296825f3-dac7-4a13-8871-9743718bc411"
    );
    if (upload) {
      upload.edit.setProp(
        "url_upload",
        eval(get(item, "component.props.pht__api_upload.value") || "")
      );
      upload.edit.setProp("on_update", {
        mode: "raw",
        value: `\
              async (url: string) => {
                  if(typeof ph === "object"){
                      await ph.on_update(url);
                  }
                }
                    `,
      });
    }

    const del = btn.edit.childs.find(
      (e) => get(e, "component.id") === "a15d152d-0118-408f-89f1-f6b2dfbd2e05"
    );
    if (del) {
      del.edit.setProp("on_click", {
        mode: "raw",
        value: `\
                  async (e: React.MouseEvent<HTMLDivElement>) => {
                      if(typeof ph === "object"){
                          await ph.on_update(null);
                      }
                    }
                        `,
      });
    }
  }
  let field_detail = {};
  Object.entries(rel).map(([key, value]) => {
    if (typeof value !== "object") {
      set(field_detail, key, [label(key)]);
    }
  });
  const field_select = select(rel);
  item.edit.setProp("on_load", {
    mode: "raw",
    value: `\
        async (op: { params: {} }) => {
            if(isEditor){
                return {
                    name: "PT Reparasi",
                    address: "Surabaya",
                    contact_person: "Bp Syamsul",
                    telephone: "081",
                    email: "joni@gmail.com",
                    note: "notesss",
                    photo_profile: "https://prasi.avolut.com/_proxy/https%3A%2F%2Fjulong-dev.avolut.com%2F_file%2F1.jpg"
                  };
            }
            const id = "masukan id"
            const result = await db.${table}.findFirst({
              where: {
                id: "masukan id",
              },
              select: ${JSON.stringify(field_select)}

            });
            return result
            
          }
        `,
  });
  item.edit.setProp("detail", {
    mode: "raw",
    value: `\
    (item: any) => {
        if(isEditor){
            return {
                company_name: ["Company Name", "PT Reparasi 1"],
                address: ["Address", "Surabaya"],
                contact_person: ["Contact Person", "Bp Syamsul"],
                telephone: ["Telephone/WA", "081"],
                email: ["Email", "joni@gmail.com"],
                note: ["Notes", "notesss"],
              };
        }else{
            // sesuaikan
            return {
                ${Object.entries(rel).map(([key, value]) => {
                  if (typeof value !== "object") {
                    return `${key}: ["${label(key)}", item.${key}]`;
                  }
                })}
            }
        }
        
      }
        `,
  });
  item.edit.setProp("pht__on_update", {
    mode: "raw",
    value: `\
    async (url: string) => {
        // masukan prisma untuk update foto profile
        await db.${table}.update({
          data: {
            ${field.upload}: url,
          }
        })
        if(typeof ph === "object"){
            const item = await ph.on_load({params: {}})
            ph.internal.item = item;
            ph.internal.render();
        }
      }
        `,
  });
  item.edit.setProp("pht__on_load", {
    mode: "raw",
    value: `\
     (item: any) => {
        return "https://static.promediateknologi.id/crop/0x0:0x0/0x0/webp/photo/p2/132/2023/12/27/image-6-2212458342.png"
        if(isEditor){
            return "https://img.okezone.com/content/2023/10/19/406/2904557/8-hewan-yang-bisa-membunuh-singa-di-alam-liar-raja-hutan-jangan-sok-jagoan-y7qBOhpKYt.jpg"
        }
        return item.${field.upload}
      }
        `,
  });
  await item.edit.commit();
  return "";
};
const label = (rel: string) => {
  return capitalizeString(rel.replaceAll("_", " "));
};
const capitalizeString = (str: string) => {
  return str
    .split(" ")
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};
