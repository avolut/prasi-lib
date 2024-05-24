import { FC } from "react";
import { MDMaster } from "../parts/MDMaster";
import { MDLocal, MDRef } from "../utils/typings";
import { MDDetail, should_show_tab } from "../parts/MDDetail";

export const ModeFull: FC<{ md: MDLocal; mdr: MDRef }> = ({ md, mdr }) => {
  if (should_show_tab(md)) {
    return <MDDetail md={md} mdr={mdr} />;
  }

  return (
    <>
      {!md.selected && <MDMaster md={md} mdr={mdr} />}
      {md.selected && <MDDetail md={md} mdr={mdr} />}
    </>
  );
};
