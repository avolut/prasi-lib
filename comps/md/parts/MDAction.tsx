import { FC } from "react";
import { MDLocal } from "../utils/typings";

export const MDAction: FC<{
  item: PrasiItem;
  md: MDLocal;
  PassProp: any;
  child: any;
}> = ({ child }) => {
  return (
    <div
      className={cx(
        "c-flex c-flex-row c-space-x-1 c-items-stretch c-self-stretch c-h-full"
      )}
    >
      {child}
    </div>
  );
};
