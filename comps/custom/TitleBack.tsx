import { icon } from "../icon";
import { FC } from "react";

export const TitleBack: FC<{
  label: string;
  url: string;
  name_page: string;
}> = ({ label, url, name_page }) => {

  return (
    <div className="c-bg-gray-100 c-px-2 c-w-full c-h-[20px] c-flex  c-py-2">
      <div
        className="c-mr-2 hover:c-cursor-pointer"
        onClick={() => {
          navigate(`${url}`);
        }}
      >
        {icon.left}
      </div>

      <div>{label || "-"}</div>
    </div>
  );
};
