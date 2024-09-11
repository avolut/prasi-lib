import { useLocal } from "lib/utils/use-local";
import { icon } from "../icon";
import { FC } from "react";

export const TitleBack: FC<{
  label: string | (() => Promise<string>);
  on_back: () => void;
}> = ({ label, on_back: on_back }) => {
  const local = useLocal({ label: "" }, async () => {
    if (typeof label === "function") {
      local.label = await label();
    } else {
      local.label = label;
    }
    local.render();
  });

  return (
    <div className="c-bg-white c-px-2 c-w-full c-min-h-[20px] c-flex c-py-2">
      <div
        className="c-mr-2 hover:c-cursor-pointer"
        onClick={() => {
          if (typeof on_back === "function") {
            on_back();
          }
        }}
      >
        {icon.left}
      </div>

      <div
        onClick={() => {
          if (typeof on_back === "function") {
            on_back();
          }
        }}
        className="c-font-bold c-w-full"
      >
        {local.label || "-"}
      </div>
    </div>
  );
};
