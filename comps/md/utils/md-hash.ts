import { MDLocal } from "./typings";

export const masterDetailParseHash = (md: MDLocal) => {
  let raw_hash = decodeURIComponent(location.hash);

  md.params.hash = {};
  md.params.tabs = {};

  for (const h of raw_hash.split("#")) {
    if (h) {
      if (h.includes("=")) {
        const [tab_name, tab_val] = h.split("=");
        if (tab_name && tab_val) {
          md.params.hash[tab_name] = tab_val;
        }
      } else if (h.includes("~")) {
        const [tab_name, tab_val] = h.split("~");
        if (tab_name && tab_val) {
          md.params.tabs[tab_name] = tab_val;
        }
      }
    }
  }
};

export const masterDetailApplyParams = (md: MDLocal) => {
  let hash = "";

  const row = md.selected;
  if (row) {
    if (md.tab.active) {
      if (md.tab.list.length > 1) {
        md.params.tabs[md.name] = md.tab.active;
      } else {
        delete md.params.tabs[md.name];
      }
    }

    const pk = md.pk;
    if (pk && row[pk.name]) {
      md.params.hash[md.name] = row[pk.name];
    }
  } else {
    delete md.params.tabs[md.name];
    delete md.params.hash[md.name];
  }

  for (const [k, v] of Object.entries(md.params.hash)) {
    hash += `#${k}=${v}`;
  }
  for (const [k, v] of Object.entries(md.params.tabs)) {
    hash += `#${k}~${v}`;
  }

  if (!isEditor) {
    location.hash = hash;
  }
};
