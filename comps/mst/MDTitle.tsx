import { FC } from "react";
import { MasterDetailConfig } from "./type";

export const MDTitle: FC<{ md: MasterDetailConfig }> = ({ md }) => {
  return (
    <div>
      {md.ui.breadcrumb.length > 0
        ? md.ui.breadcrumb.map((e, idx) => {
            let label = (typeof e === "object" ? e?.[0] : e) || "-";
            let url = typeof e === "object" ? e?.[1] : null;

          return (
              <>
                {idx > 0 && (
                  <span className="c-pl-[6px] c-pr-[5px] c-text-gray-300">
                    /
                  </span>
                )}

                <span
                  onClick={() => {
                    if (url === "") {
                      md.ui.actions = [...md.ui.default_actions];
                      md.ui.breadcrumb = [];
                      md.ui.back = false;
                      md.selected = null;
                      md.render();
                    }
                  }}
                  className={cx(
                    typeof url === "string"
                      ? "c-cursor-pointer hover:c-underline"
                      : "c-text-gray-500"
                  )}
                >
                  {label}
                </span>
              </>
            );
          })
        : md.ui.title}
    </div>
  );
};
