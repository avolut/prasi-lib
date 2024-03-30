import { FC } from "react";
import { MasterDetailConfig } from "./type";
import { Button } from "../../ui/button";

export const MDAction: FC<{ md: MasterDetailConfig }> = ({ md }) => {
  return (
    <div
      className={cx(
        "md-action c-flex c-space-x-2",
        css`
          button {
            height: 25px;
          }
        `
      )}
    >
      {md.ui.actions.length > 0 &&
        md.ui.actions.map((e, idx) => {
          return (
            <Button
              size="sm"
              variant={e.type || "default"}
              onClick={e.onClick}
              className={cx(
                "c-flex c-items-center",
                css`
                  padding: 0px 8px !important;
                `
              )}
            >
              {e.icon && (
                <span
                  className={cx(
                    "c-mr-[5px]",
                    css`
                      svg {
                        width: 15px;
                        height: 15px;
                      }
                    `
                  )}
                  dangerouslySetInnerHTML={{ __html: e.icon }}
                ></span>
              )}{" "}
              {e.label}
            </Button>
          );
        })}
    </div>
  );
};
