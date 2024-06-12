import { FC, useState } from "react";
import { MDLocal, MDRef } from "../utils/typings";

export const MDHeader: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const [_, set] = useState({});
  const head = mdr.item.edit.props?.header.value;
  const PassProp = mdr.PassProp;
  md.header.render = () => set({});
  return <PassProp md={md}>{head}</PassProp>;
};
