import { FC } from "react";
import { MDMain } from "../parts/MDMaster";
import { MDLocal, MDRef } from "../utils/typings";
import { MDTab, should_show_tab } from "../parts/MDTab";

export const ModeFull: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  if (should_show_tab(md)) {
    return <MDTab md={md} mdr={mdr} />;
  }

  return (
    <>
      {!md.selected && <MDMain md={md} mdr={mdr} />}
      {md.selected && <MDTab md={md} mdr={mdr} />}
    </>
  );
};
