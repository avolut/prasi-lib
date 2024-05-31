import { useLocal } from "@/utils/use-local";
import { FC, ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { GenField } from "../form/typings";
import { default_filter_local, filter_window } from "./utils/types";
import { FilterContent } from "./FilterContent";
import { getPathname } from "lib/utils/pathname";

type FilterMode = "regular" | "inline" | "popup";

type FilterProps = {
  gen_fields: GenField[];
  gen_table: string;
  name: string;
  value: any;
  mode: FilterMode;
  children?: ReactNode;
  onClose?: () => void;
  PassProp: any;
  child: any;
  _item: PrasiItem;
};

export const MasterFilter: FC<FilterProps> = ({
  gen_fields,
  gen_table,
  name,
  value,
  mode,
  PassProp,
  child,
  onClose,
  _item,
}): ReactNode => {
  const filter = useLocal({ ...default_filter_local });
  filter.name = name;

  if (!isEditor) {
    if (!filter_window.prasi_filter) {
      filter_window.prasi_filter = {};
    }
    const pf = filter_window.prasi_filter;
    if (pf) {
      const pathname = getPathname();
      if (!pf[pathname]) pf[pathname] = {};
      if (!pf[pathname][name]) pf[pathname][name] = {};
      pf[pathname][name][_item.id] = filter;
    }
  }

  if (mode === "popup") {
    let popup = document.querySelector(".main-content-preview > .portal");
    if (!popup) {
      popup = document.createElement("div");
      popup.classList.add("portal");

      const main = document.querySelector(".main-content-preview");
      if (main) {
        main.appendChild(popup);
      }
    }
    return (
      <>
        {createPortal(
          <div
            onClick={onClose}
            className={cx(
              css`
                position: absolute;
                top: 0;
                bottom: 0;
                right: 0;
                left: 0;
                background: white;
                z-index: 100;
              `,
              "c-flex c-flex-col"
            )}
          >
            <FilterContent
              PassProp={PassProp}
              child={child}
              mode={mode}
              _item={_item}
              filter={filter}
            />
          </div>,
          popup
        )}
      </>
    );
  }

  return (
    <FilterContent
      PassProp={PassProp}
      _item={_item}
      child={child}
      mode={mode}
      filter={filter}
    />
  );
};
