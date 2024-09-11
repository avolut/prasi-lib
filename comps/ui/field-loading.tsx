import { Skeleton } from "lib/comps/ui/skeleton";
import { Loader2 } from "lucide-react";
import { FC } from "react";

export const FieldLoading: FC<{ height?: "normal" | "short" }> = (prop) => {
  let height = "10px";
  if (prop.height === "short") height = "6px";
  return (
    <div className="field-inner c-flex c-flex-col c-space-y-1 c-p-1 c-justify-center">
      <div className="c-flex c-space-x-1">
        <Skeleton
          className={css`
            width: 50px;
            height: ${height};
          `}
        />
        <Skeleton
          className={css`
            width: 50px;
            height: ${height};
          `}
        />
      </div>
      <Skeleton
        className={css`
          width: 80px;
          height: ${height};
        `}
      />
    </div>
  );
};

export const Spinner = ({ className }: { className?: string }) => {
  return (
    <div className={className}>
      <Loader2 className={cx("c-h-4 c-w-4 c-animate-spin")} />
    </div>
  );
};
