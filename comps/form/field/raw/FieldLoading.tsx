import { Skeleton } from "@/comps/ui/skeleton";

export const FieldLoading = () => {
  return (
    <div className="field-inner c-flex c-flex-col c-space-y-1 c-p-1 c-justify-center">
      <div className="c-flex c-space-x-1">
        <Skeleton
          className={css`
            width: 50px;
            height: 10px;
          `}
        />
        <Skeleton
          className={css`
            width: 50px;
            height: 10px;
          `}
        />
      </div>
      <Skeleton
        className={css`
          width: 80px;
          height: 10px;
        `}
      />
    </div>
  );
};
