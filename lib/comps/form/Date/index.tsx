import { FC } from "react";

export const Date: FC<{
  on_select: (val: any) => void;
}> = ({ on_select }) => {
  return (
    <input
      id="date"
      className="c-w-full c-flex c-justify-center c-border c-px-3 c-py-2 c-rounded-lg c-cursor-pointer"
      type="date"
      onChange={(event) => {
        on_select(event.target.value);
      }}
    ></input>
  );
};
