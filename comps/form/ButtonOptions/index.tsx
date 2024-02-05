import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { Button } from "../../ui/button";

export const ButtonOptions: FC<{
  on_select: (val: any) => void;
  options: () => Promise<{ value: string; label: string }[]>;
  value: string
}> = ({ options, on_select, value }) => {
  const local = useLocal({
    list: [] as { value: string; label: string }[],
    status: "init" as "init" | "loading" | "ready",
  });

  useEffect(() => {
    if (local.status === "init") {
      local.status = "loading";
      local.render();
      options().then((result) => {
        local.list = result;

        local.status = "ready";
        local.render();
      });
    }
  }, [options]);

  return (
    <div>
      {!!local.list &&
        local.list.map((item, index) => (
          <Button
            key={index}
            onClick={() => {
              on_select(item.value);
              local.render();
            }}
            className="c-mr-3"
            variant={item.value === value ? "default" : "outline"}
          >
            <span>{item.label}</span>
          </Button>
        ))}
    </div>
  );
};
