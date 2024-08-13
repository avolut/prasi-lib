import { FC, ReactNode, useEffect, useState } from "react";
import { breadcrumbPrefix } from "../utils/md-hash";
import { MDLocal, MDRef } from "../utils/typings";
import { BreadItem } from "lib/comps/custom/Breadcrumb";
import { useLocal } from "lib/utils/use-local";

export const MDHeader: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const local = useLocal({ breads_length: 0 });
  const head = mdr.item.edit.props?.header.value;
  const PassProp = mdr.PassProp;
  md.header.render = local.render;

  const prefix = breadcrumbPrefix(md);
  let breads: (BreadItem & { url: string })[] = [];
  if (md.selected && md.header.child.breadcrumb) {
    breads = [...prefix, ...md.header.child.breadcrumb()] as any;
  } else if (!md.selected && md.header.master.breadcrumb) {
    breads = [...prefix, ...md.header.master.breadcrumb()] as any;
  }

  md.header.breadcrumb = [];
  let overrideLabel = "" as ReactNode;
  let skipItem = false;
  for (const v of breads) {
    if (v.label === "--reset--") {
      md.header.breadcrumb = [];
      overrideLabel = "";
      continue;
    }

    if (v.url === "--override--") {
      overrideLabel = v.label;
      continue;
    }
    if (v.label === "--skip--") {
      skipItem = true;
      continue;
    }
    if (skipItem) {
      skipItem = false;
      continue;
    }
    if (overrideLabel) {
      v.label = overrideLabel;
      overrideLabel = "";
    }
    md.header.breadcrumb.push(v);
  }

  useEffect(() => {
    if (local.breads_length !== md.header.breadcrumb.length) {
      local.breads_length = md.header.breadcrumb.length;
      if (!md.selected && md.master.reload) md.master.reload();
    }
  }, [md.header.breadcrumb.length]);

  if (md.internal.reset_detail) return null;
  return <PassProp md={md}>{head}</PassProp>;
};
