import { useLocal } from "@/utils/use-local";
import { FC, Fragment, isValidElement } from "react";
import { getProp } from "./utils/get-prop";
import { MDActions, MDLocal } from "./utils/typings";

const w = window as unknown as {
  md_panel_master: any;
};
export const MDMaster: FC<{ size: any; min_size: any;  md: MDLocal;child: any; on_init: () => void }> = ({child,on_init, min_size,size, md
}) => {
  let result = on_init();
  
  let width = 0;
  let min_width = 0;
  try {
    width = Number(size) || 0;
    min_width = Number(min_size) || 0;
  } catch (e: any) {
    
  }
  w.md_panel_master = JSON.stringify({
    size: width,
    min_size: min_width
  })
  md.panel.min_size = min_width;
  md.panel.size = width;
  return (
    <>
    {child}
    </>
  );
};
