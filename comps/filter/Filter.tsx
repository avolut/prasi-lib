import { useLocal } from "@/utils/use-local";
import get from "lodash.get";
import { FC, useEffect, useRef } from "react";

export const MasterFilter: FC<{
  name: string;
  value: any;
  child: any;
}> = ({name, value, child }) => {
  useEffect(() => {
    if (!isEditor) {
      const w = window as any;
      if (typeof w["prasi_filter"] !== "object") w["prasi_filter"] = {};
      if (typeof w["prasi_filter"][name] !== "object")
        w["prasi_filter"][name] = {};
      const val = value();
      w["prasi_filter"][name] = {
        ...w["prasi_filter"][name],
        ...val
      };
      w.prasiContext.render();
    }
  },[])
  
  return <div>{child}</div>;
};
