import { MasterDetailConfig } from "./type";

export const master_detail_params = (md: MasterDetailConfig) => {
  let parent_id =
    md.pk?.type === "int"
      ? parseInt(md.selected?.[md.pk?.name || ""])
      : md.selected?.[md.pk?.name || ""];

  const hash: any = {};
  const tabs: any = {};

  let raw_hash = decodeURIComponent(location.hash);

  if (isEditor) {
    raw_hash = localStorage.getItem("prasi-md-hash") || "";
  }

  for (const h of raw_hash.split("#")) {
    if (h) {
      if (h.includes("=")) {
        const [tab_name, tab_val] = h.split("=");
        if (tab_name && tab_val) {
          hash[tab_name] = tab_val;
        }
      } else if (h.includes("~")) {
        const [tab_name, tab_val] = h.split("~");
        if (tab_name && tab_val) {
          tabs[tab_name] = tab_val;
        }
      }
    }
  }

  if (parent_id) {
    return { hash, parent_id, tabs };
  }
  return { hash, tabs };
};

export const master_detail_gen_hash = (obj: {
  hash: Record<string, number | string>;
  tabs: Record<string, string>;
  parent_id?: string;
}) => {
  let hash = "";
  for (const [k, v] of Object.entries(obj.hash)) {
    hash += `#${k}=${v}`;
  }
  for (const [k, v] of Object.entries(obj.tabs)) {
    hash += `#${k}~${v}`;
  }

  if (isEditor) {
    localStorage.setItem("prasi-md-hash", hash);
  } else {
    location.hash = hash;
  }
};
