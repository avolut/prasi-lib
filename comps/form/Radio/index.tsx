import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { Button } from "../../ui/button";

export const Radio: FC<{
  on_select: (val: any) => void;
  options: () => Promise<(string | { value: string; label: string })[]>;
  value: string;
  PassProp: any;
  custom: "y" | "n";
  child: any;
}> = ({ options, on_select, value, custom, child, PassProp }) => {
  const local = useLocal({
    list: [] as { value: string; label: string }[],
    status: "init" as "init" | "loading" | "ready",
  });

  useEffect(() => {
    if (local.status === "init") {
      local.status = "loading";
      local.render();
      options().then((result) => {
        local.list = result.map((e) => {
          if (typeof e === "string") {
            return {
              value: e,
              label: e,
            };
          }
          return e;
        });

        local.status = "ready";
        local.render();
      });
    }
  }, [options]);

  return (
    <div className="c-flex c-flex-1">
      {!!local.list &&
        local.list.map((item, index) => {
          if (custom === "y") return <PassProp>{child}</PassProp>;
          return (
            <Button
              key={index}
              onClick={() => {
                on_select(item.value);
                local.render();
              }}
              className={cx("c-mr-2")}
              variant={item.value === value ? "default" : "outline"}
            >
              <span>{item.label}</span>
            </Button>
          );
        })}
    </div>
  );
};
