import { useLocal } from "@/utils/use-local";
import { FC, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../ui/button";

export const PopUpDropdown: FC<{
  on_select: (val: any) => void;
  on_close: () => void;
  title: string;
  options: () => Promise<{ value: string; label: string }[]>;
}> = ({ on_close, title, options, on_select }) => {
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
    <div className="c-fixed c-inset-0 c-bg-white c-z-50">
      <div className="c-flex c-flex-col c-mx-3">
        <div className="c-flex c-justify-between c-items-center">
          <h1 className="c-font-bold c-text-center c-truncate c-text-ellipsis c-overflow-hidden ...">
            {title}
          </h1>
          <button
            className="c-my-5 c-mx-3 hover:c-text-black/50"
            onClick={() => {
              on_close();
            }}
          >
            <span>
              <X />
            </span>
          </button>
        </div>

        <div className="rounded">
          {!!local.list &&
            local.list.map((item, index) => (
              <Button
                key={index}
                onClick={() => {
                  on_select(item.value);
                  on_close();
                  local.render();
                }}
                className="w-full px-3 py-2 mb-2 cursor-pointer rounded hover:rounded hover:c-text-white"
              >
                <p>{item.label}</p>
              </Button>
            ))}
        </div>
      </div>
    </div>
  );
};
