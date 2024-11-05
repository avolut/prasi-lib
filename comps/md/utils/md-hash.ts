import { fetchLinkParams, parseLink } from "lib/utils/fetch-link-params";
import { MDLocal } from "./typings";
import { BreadItem } from "lib/comps/custom/Breadcrumb";

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

  md.params.links = md.params.links.filter((e) => e);

  const parsed_link = parseLink();
  let changed = parsed_link.length !== md.params.links.length;

  if (!changed) {
    for (let i = 0; i < parsed_link.length; i++) {
      if (parsed_link[i] !== md.params.links[i].hash) {
        changed = true;
      }
    }
  }

  if (changed) {
    md.params.links = [];
    md.header.loading = true;
    fetchLinkParams(parsed_link).then((links) => {
      md.params.links = links;
      md.header.loading = false;
      md.header.render();
    });
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
  if(!isEditor){
    if(md.props.tab_mode === "v-tab" || md.props.tab_mode === "h-tab"){
      try{
        if(row && md?.childs?.form?.fm && md?.childs?.form?.fm?.status === "ready" && md.selected?.id){
          md.childs.form.fm.reload();
        }
      }catch(ex){

      }
    }
  }
};

const cleanHash = (hash: string) => {
  return hash
    .split("#")
    .filter(function (value, index, self) {
      return self.indexOf(value) === index;
    })
    .join("#");
};

export const breadcrumbPrefix = (md: MDLocal) => {
  let prefix: (BreadItem & { url: string })[] = [];
  if (md.params.links && md.params.links.length > 0) {
    md.params.links = md.params.links.filter((e) => e);
    const hashes: string[] = [];
    for (const link of md.params.links) {
      if (!hashes.includes(link.hash)) {
        hashes.push(link.hash);
      }
    }
    for (const link of md.params.links) {
      if (link.name && link.name !== md.name) continue;
      for (const p of link.prefix) {
        prefix.push({
          label: p.label,
          url: p.url || link.url,
          onClick(ev) {
            let url = "";

            const hashIndex = hashes.indexOf(link.hash);
            const link_hashes = hashes.slice(0, hashIndex).join("+");
            let lnk = link_hashes ? `#lnk=${link_hashes}` : ``;

            if (p.md) {
              lnk = `#${p.md.name}=${p.md.value}${lnk}`;
            }

            url = `${p.url || link.url}${cleanHash(lnk)}`;

            if (url) {
              navigate(url);
            }
          },
        });
      }
    }
  }
  return prefix;
};
