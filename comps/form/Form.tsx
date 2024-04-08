import { useLocal } from "@/utils/use-local";
import { FC } from "react";
import { FMInternal, FMProps } from "./typings";
import { formReload } from "./utils/reload";
import { formInit } from "./utils/init";
import { createPortal } from "react-dom";
import { Toaster } from "sonner";

export const Form: FC<FMProps> = (props) => {
  const { PassProp, body } = props;
  const fm = useLocal<FMInternal>({
    data: "",
    status: "init",
    reload: async () => {
      formReload(fm);
    },
    error: {} as any,
    internal: {
      reload: {
        timeout: null as any,
        promises: [],
        done: [],
      },
    },
    props: {} as any,
  });

  if (fm.status === "init") {
    formInit(fm, props);
  }

  if (document.getElementsByClassName("prasi-toaster").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = "prasi-toaster";
    document.body.appendChild(elemDiv);
  }
  const toaster_el = document.getElementsByClassName("prasi-toaster")[0];

  return (
    <>
      {toaster_el && createPortal(<Toaster cn={cx} />, toaster_el)}
      <PassProp>{body}</PassProp>
    </>
  );
};
