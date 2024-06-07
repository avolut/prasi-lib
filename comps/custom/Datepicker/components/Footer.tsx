import dayjs from "dayjs";
import React, { useCallback, useContext } from "react";

import { DATE_FORMAT } from "../constants";
import DatepickerContext from "../contexts/DatepickerContext";

import { PrimaryButton, SecondaryButton } from "./utils";

const Footer: React.FC = () => {
  // Contexts
  const { hideDatepicker, period, changeDatepickerValue, configs, classNames } =
    useContext(DatepickerContext);

  // Functions
  const getClassName = useCallback(() => {
    if (
      typeof classNames !== "undefined" &&
      typeof classNames?.footer === "function"
    ) {
      return classNames.footer();
    }

    return " c-flex c-items-center c-justify-end c-pb-2.5 c-pt-3 c-border-t c-border-gray-300 dark:c-border-gray-700";
  }, [classNames]);

  return (
    <div className={getClassName()}>
      <div className="c-w-full md:c-w-auto c-flex c-items-center c-justify-center c-space-x-3">
        <SecondaryButton
          onClick={() => {
            hideDatepicker();
          }}
        >
          <>{configs?.footer?.cancel ? configs.footer.cancel : "Cancel"}</>
        </SecondaryButton>
        <PrimaryButton
          onClick={() => {
            if (period.start && period.end) {
              changeDatepickerValue({
                startDate: dayjs(period.start).format(DATE_FORMAT),
                endDate: dayjs(period.end).format(DATE_FORMAT),
              });
              hideDatepicker();
            }
          }}
          disabled={!(period.start && period.end)}
        >
          <>{configs?.footer?.apply ? configs.footer.apply : "Apply"}</>
        </PrimaryButton>
      </div>
    </div>
  );
};

export default Footer;
