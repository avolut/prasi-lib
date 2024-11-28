import dayjs from "dayjs";
import React, { useContext, useMemo } from "react";

import { DAYS } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import { loadLanguageModule, shortString, ucFirst } from "../../helpers";
interface Props {
  style?: string
}
const Week: React.FC<Props> = ({style}) => {
  const { i18n, startWeekOn } = useContext(DatepickerContext);
  loadLanguageModule(i18n);
  const startDateModifier = useMemo(() => {
    if (startWeekOn) {
      switch (startWeekOn) {
        case "mon":
          return 1;
        case "tue":
          return 2;
        case "wed":
          return 3;
        case "thu":
          return 4;
        case "fri":
          return 5;
        case "sat":
          return 6;
        case "sun":
          return 0;
        default:
          return 0;
      }
    }
    return 0;
  }, [startWeekOn]);

  return (
    <div className="calender-week c-grid c-grid-cols-7 c-border-b c-border-gray-300 dark:c-border-gray-700 c-py-2">
      {DAYS.map((item) => (
        <div
          key={item}
          className="c-tracking-wide c-text-gray-500 c-text-center"
        >
          {style === "google" ? dayjs(`2022-11-${6 + (item + startDateModifier)}`)
                .locale(i18n)
                .format(isMobile ? "dd" :"dddd") : ucFirst(
                  shortString(
                    dayjs(`2022-11-${6 + (item + startDateModifier)}`)
                      .locale(i18n)
                      .format(isMobile ? "dd" :"dddd")
                  ),
                  
                )}
        </div>
      ))}
    </div>
  );
};

export default Week;
