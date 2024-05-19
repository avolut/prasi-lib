import get from "lodash.get";
import { FC } from "react";
import { MDLocal, MDRef } from "../utils/typings";

export const MDHeader: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  const head = get(mdr.child, "props.meta.item.component.props.header.content");
  const PassProp = mdr.PassProp;
  return <PassProp md={md}>{head}</PassProp>;
};
