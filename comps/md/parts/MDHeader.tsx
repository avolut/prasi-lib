import { FC, useState } from "react";
import { breadcrumbPrefix } from "../utils/md-hash";
import { MDLocal, MDRef } from "../utils/typings";

export const MDHeader: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const [_, set] = useState({});
  const head = mdr.item.edit.props?.header.value;
  const PassProp = mdr.PassProp;
  md.header.render = () => set({});

  const prefix = breadcrumbPrefix(md);
  if (md.selected && md.header.child.breadcrumb) {
    md.header.breadcrumb = [...prefix, ...md.header.child.breadcrumb()];
  } else if (!md.selected && md.header.master.breadcrumb) {
    md.header.breadcrumb = [...prefix, ...md.header.master.breadcrumb()];
  }

  return <PassProp md={md}>{head}</PassProp>;
};
