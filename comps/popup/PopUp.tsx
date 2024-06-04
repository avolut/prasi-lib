import { useLocal } from "lib/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type PopupProp = {
  on_close: (value: boolean) => void;
  open: boolean | (() => boolean);
  child: ReactNode;
};
export const Popup: FC<PopupProp> = ({ on_close, open, child }) => {
  const local = useLocal({
    ref: null as any,
    open: false,
  });
  useEffect(() => {
    const open_props = typeof open === "function" ? open() : open;
    local.open = open_props;
    local.render();
  }, [open]);

  if (document.getElementsByClassName("prasi-popup").length === 0) {
    const elemDiv = document.createElement("div");
    elemDiv.className = cx(
      "prasi-popup c-overflow-y-auto c-overflow-x-hidden c-fixed c-top-0 c-right-0 c-left-0 c-z-50 c-flex c-flex-row c-items-center c-justify-center"
    );
    document.body.appendChild(elemDiv);
  }
  const prasi_popup = document.getElementsByClassName("prasi-popup")[0];
  //   return <></>
  //   prasi_popup.className = cx("prasi-popup", " c-w-full c-bg-gray-800 c-w-screen c-h-screen");
  return (
    <>
      {prasi_popup &&
        local.open &&
        createPortal(
          <div
            ref={(e) => (local.ref = e)}
            className="c-w-screen c-h-screen c-bg-transparent  c-flex c-flex-row c-items-center c-justify-center"
            onClick={(e) => {
              console.log({ e });
              console.log(local.ref, e.target);
              if (local.ref) {
                if (e.target === local.ref) {
                  on_close(false);
                  local.open = false;
                  local.render();
                } else {
                  console.log("click inside popup");
                }
              }
            }}
          >
            <div className="c-flex c-flex-row c-items-stretch">{child}</div>
          </div>,
          prasi_popup
        )}
    </>
  );
};
