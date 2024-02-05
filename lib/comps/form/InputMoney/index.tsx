import { FC } from "react";
import { Input } from "../../ui/input";
import { useLocal } from "@/utils/use-local";

export const InputMoney: FC<{
  value: string;
  on_select: (val: any) => void;
}> = ({ value, on_select }) => {
  const local = useLocal({
    numberWithComma: "",
    number: 0,
  });

  const removeNonNumeric = (num: any) => {
    // replace  non numeric
    return num.replace(/[^0-9]/g, "");
  };

  const handleChange = (event: any) => {
    const val = event.target.value;

    local.number = parseInt(val.replace(/\W/g, ""));
    local.numberWithComma = formatMoney(removeNonNumeric(val));
    local.render();

    on_select(local.number);
  };

  return (
    <div className="c-relative">
      <Input
        type="text"
        className="c-pl-10"
        value={local.numberWithComma}
        onChange={(event) => {
          handleChange(event);
        }}
      />
      <span className="c-absolute c-top-1/2 c-left-4 c-transform -c-translate-y-1/2 absolute top-1/2 left-1/2 c-text-base">
        Rp.
      </span>
    </div>
  );
};

export const formatMoney = (num: any) => {
  // add comma
  if (!!num) {
    let str = num;
    if (typeof num === "number") str = num.toString();
    if (typeof str === "string")
      return str.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return "";
  }
};
