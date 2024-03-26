import { MasterDetailConfig } from "./type";

export const master_detail_params = (md: MasterDetailConfig) => {
  let parent_id =
    md.pk?.type === "int"
      ? parseInt(md.selected?.[md.pk?.name || ""])
      : md.selected?.[md.pk?.name || ""];

  const hash: any = {};
  for (const h of location.hash.split("#")) {
    if (h) {
      const [tab_name, tab_val] = h.split("=");
      if (tab_name && tab_val) {
        hash[tab_name] = tab_val;
      }
    }
  }

  if (parent_id) {
    return { ...hash, parent_id };
  }
  return hash;
};

export const master_detail_gen_hash = (
  obj: Record<string, number | string>
) => {
  let hash = "";
  for (const [k, v] of Object.entries(obj)) {
    hash += `#${k}=${v}`;
  }
  return hash;
};
