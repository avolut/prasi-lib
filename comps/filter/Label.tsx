import { FC, ReactNode } from "react";

export const Label: FC<{ children: ReactNode; text: string }> = ({
    children,
    text,
}) => {
    return (
        <label className="field c-flex c-w-full c-flex-col c-space-y-1 c-px-2">
            <div className="label c-text-sm c-flex c-items-center c-mt-3 c-capitalize">
                {text}
            </div>
            <div className="field-inner c-flex c-flex-1 c-flex-col">
                <div
                    className={cx(
                        "field-outer c-flex c-flex-1 c-flex-row c-rounded c-border c-text-sm c-flex-wrap",
                        css`
                > * {
                  width: 100%;
                  padding: 5px;
                }
              `
                    )}
                >
                    {children}
                </div>
            </div>
        </label>
    );
};