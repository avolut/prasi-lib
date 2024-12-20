import dayjs from "dayjs";
import React, { useContext } from "react";

import { MONTHS } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import { loadLanguageModule } from "../../helpers";
import { RoundedButton } from "../utils";

interface Props {
  currentMonth: number;
  clickMonth: (month: number) => void;
  style?: string
}

const Months: React.FC<Props> = ({ currentMonth, clickMonth, style }) => {
  const { i18n } = useContext(DatepickerContext);
  loadLanguageModule(i18n);
  return (
    <div className={"c-w-full c-grid c-grid-cols-2 c-gap-2 c-mt-2"}>
      {MONTHS.map((item) => (
        <RoundedButton
          key={item}
          padding="c-py-3"
          onClick={() => {
            clickMonth(item);
          }}
          active={currentMonth === item}
        >
          <>{dayjs(`2022-${item}-01`).locale(i18n).format(style === "google" ? "MMMM" :"MMM")}</>
        </RoundedButton>
      ))}
    </div>
  );
};

export default Months;
