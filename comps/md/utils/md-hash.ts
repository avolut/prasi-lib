import { MDLocal } from "./typings";

export const masterDetailApplyHash = (md: MDLocal) => {
  let raw_hash = decodeURIComponent(location.hash);

  if (isEditor) {
    raw_hash = localStorage.getItem("prasi-md-hash") || "";
  }

  md.params = { hash: {}, tabs: {} };

  for (const h of raw_hash.split("#")) {
    if (h) {
      if (h.includes("=")) {
        const [tab_name, tab_val] = h.split("=");
        if (tab_name && tab_val) {
          md.params.hash[tab_name] = tab_val;
          if (tab_name === md.name && md.master.pk) {
            if (md.master.pk.type === "int") {
              md.selected = { [md.master.pk.name]: parseInt(tab_val) };
            } else {
              md.selected = { [md.master.pk.name]: tab_val };
            }
          }
        }
      } else if (h.includes("~")) {
        const [tab_name, tab_val] = h.split("~");
        if (tab_name && tab_val) {
          md.params.tabs[tab_name] = tab_val;
          if (tab_name === md.name) {
            md.tab.active = md.name;
          }
        }
      }
    }
  }
};

export const masterDetailStoreHash = (md: MDLocal) => {
  let hash = "";
  for (const [k, v] of Object.entries(md.params.hash)) {
    hash += `#${k}=${v}`;
  }
  for (const [k, v] of Object.entries(md.params.tabs)) {
    hash += `#${k}~${v}`;
  }

  if (isEditor) {
    localStorage.setItem("prasi-md-hash", hash);
  } else {
    location.hash = hash;
  }
};
