import { FC } from "react";

export const Datetime: FC<{
  on_select: (val: any) => void;
}> = ({ on_select }) => {
  return (
    <input
      id="datetime"
      className="c-w-full c-flex c-justify-center c-border c-px-3 c-py-2 c-rounded-lg c-cursor-pointer"
      type="datetime-local"
      onChange={(event) => {
        on_select(event.target.value);
      }}
    />
  );
};
