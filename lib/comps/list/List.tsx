import { useLocal } from "@/utils/use-local";
import { FC, ReactElement, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import get from "lodash.get";

export const List: FC<{
  className: string;
  on_load: (arg: { params: any }) => Promise<any[]>;
  map_val: (item: any) => any;
  row: ReactElement;
  props: any;
  PassProp: any;
}> = ({ className, row, props, on_load, PassProp, map_val }) => {
  const local = useLocal({
    status: "init" as "init" | "loading" | "ready",
    params: {
      skip: 0,
      take: 3,
    },
    list: [] as any[],
  });

  if (isEditor) {
    return (
      <ListDummy
        row={row}
        props={props}
        PassProp={PassProp}
        map_val={map_val}
      />
    );
  }

  useEffect(() => {
    (async () => {
      if (local.status === "init") {
        local.status = "loading";
        local.render();

        local.list = await on_load({ params: local.params });

        local.status = "ready";
        local.render();
      }
    })();
  }, [on_load]);

  return (
    <div
      className="c-flex c-flex-1 c-w-full c-h-full c-relative c-overflow-auto"
      onPointerDown={props.onPointerDown}
      onPointerLeave={props.onPointerLeave}
      onPointerEnter={props.onPointerEnter}
    >
      <div className="c-absolute c-inset-0 c-flex c-flex-col c-items-stretch">
        {local.status !== "ready" ? (
          <div className="c-p-2 c-flex c-flex-col c-space-y-2 c-flex-1 c-items-start">
            <Skeleton className="c-h-4 c-w-[80%]" />
            <Skeleton className="c-h-4 c-w-[70%]" />
          </div>
        ) : (
          <>
            {local.list === null ? (
              <ListDummy
                row={row}
                props={props}
                PassProp={PassProp}
                map_val={map_val}
              />
            ) : (
              local.list.map((item, idx) => {
                const val = (...arg: any[]) => {
                  const value = get(map_val(item), `${arg.join("")}`);
                  return value;
                };
                return (
                  <div key={item} className="c-border-b">
                    <PassProp item={val}>{row}</PassProp>
                  </div>
                );
              })
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ListDummy = ({ props, row, PassProp, map_val }: any) => {
  const item = (...arg: string[]) => {
    if (map_val) {
      const value = get(map_val({}), `${arg.join("")}`);
      if (value) return value;
    }
    return `[${arg.join("")}]`;
  };

  return (
    <div
      className="c-flex c-flex-1 c-w-full c-h-full c-relative c-overflow-auto"
      onPointerDown={props.onPointerDown}
      onPointerLeave={props.onPointerLeave}
      onPointerEnter={props.onPointerEnter}
    >
      <div className="c-absolute c-inset-0 c-flex c-flex-col c-items-stretch">
        <div className="c-border-b ">
          <PassProp item={item}>{row}</PassProp>
        </div>
        <div className="c-border-b px-2"> ...</div>
        <div className="c-border-b px-2"> ...</div>
      </div>
    </div>
  );
};
