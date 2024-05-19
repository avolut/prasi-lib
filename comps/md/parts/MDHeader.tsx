import { FC } from "react";
import { MDLocal, MDRef } from "../utils/typings";

export const MDHeader: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const head = mdr.item.edit.props?.header.value;
  const PassProp = mdr.PassProp;
  return <PassProp md={md}>{head}</PassProp>;
};
