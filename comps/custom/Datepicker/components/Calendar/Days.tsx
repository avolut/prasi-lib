import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React, { useCallback, useContext } from "react";

import { BG_COLOR, TEXT_COLOR } from "../../constants";
import DatepickerContext from "../../contexts/DatepickerContext";
import {
  formatDate,
  nextMonth,
  previousMonth,
  classNames as cn,
} from "../../helpers";
import { Period } from "../../types";

dayjs.extend(isBetween);

interface Props {
  calendarData: {
    date: dayjs.Dayjs;
    days: {
      previous: number[];
      current: number[];
      next: number[];
    };
  };
  onClickPreviousDays: (day: number) => void;
  onClickDay: (day: number) => void;
  onClickNextDays: (day: number) => void;
  onIcon?: (day: number, date: Date) => any;
  style?: string;
}

const Days: React.FC<Props> = ({
  calendarData,
  onClickPreviousDays,
  onClickDay,
  onClickNextDays,
  onIcon,
  style,
}) => {
  // Contexts
  const {
    primaryColor,
    period,
    changePeriod,
    dayHover,
    changeDayHover,
    minDate,
    maxDate,
    disabledDates,
  } = useContext(DatepickerContext);

  // Functions
  const currentDateClass = useCallback(
    (item: number) => {
      const itemDate = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${item >= 10 ? item : "0" + item}`;
      if (formatDate(dayjs()) === formatDate(dayjs(itemDate)))
        return TEXT_COLOR["500"][
          primaryColor as keyof (typeof TEXT_COLOR)["500"]
        ];
      return "";
    },
    [calendarData.date, primaryColor]
  );

  const activeDateData = useCallback(
    (day: number) => {
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day}`;
      let className = "";

      if (
        dayjs(fullDay).isSame(period.start) &&
        dayjs(fullDay).isSame(period.end)
      ) {
        className = ` ${BG_COLOR["500"][primaryColor]} c-text-white c-font-medium rounded-full`;
      } else if (dayjs(fullDay).isSame(period.start)) {
        className = ` ${
          BG_COLOR["500"][primaryColor]
        } c-text-white c-font-medium ${
          dayjs(fullDay).isSame(dayHover) && !period.end
            ? "c-rounded-full"
            : "c-rounded-l-full"
        }`;
      } else if (dayjs(fullDay).isSame(period.end)) {
        className = ` ${
          BG_COLOR["500"][primaryColor]
        } c-text-white c-font-medium ${
          dayjs(fullDay).isSame(dayHover) && !period.start
            ? "c-rounded-full"
            : "c-rounded-r-full"
        }`;
      }

      return {
        active:
          dayjs(fullDay).isSame(period.start) ||
          dayjs(fullDay).isSame(period.end),
        className: className,
      };
    },
    [calendarData.date, dayHover, period.end, period.start, primaryColor]
  );

  const hoverClassByDay = useCallback(
    (day: number) => {
      let className = currentDateClass(day);
      const fullDay = `${calendarData.date.year()}-${
        calendarData.date.month() + 1
      }-${day >= 10 ? day : "0" + day}`;

      if (period.start && period.end) {
        if (dayjs(fullDay).isBetween(period.start, period.end, "day", "[)")) {
          return ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
            day
          )} dark:bg-white/10`;
        }
      }

      if (!dayHover) {
        return className;
      }

      if (
        period.start &&
        dayjs(fullDay).isBetween(period.start, dayHover, "day", "[)")
      ) {
        className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
          day
        )} dark:bg-white/10`;
      }

      if (
        period.end &&
        dayjs(fullDay).isBetween(dayHover, period.end, "day", "[)")
      ) {
        className = ` ${BG_COLOR["100"][primaryColor]} ${currentDateClass(
          day
        )} dark:bg-white/10`;
      }

      if (dayHover === fullDay) {
        const bgColor = BG_COLOR["500"][primaryColor];
        className = ` transition-all duration-500 text-white font-medium ${bgColor} ${
          period.start ? "rounded-r-full" : "rounded-l-full"
        }`;
      }

      return className;
    },
    [
      calendarData.date,
      currentDateClass,
      dayHover,
      period.end,
      period.start,
      primaryColor,
    ]
  );

  const isDateTooEarly = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (!minDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = newDate.set("date", day);
      return dayjs(formattedDate).isSame(dayjs(minDate), "day")
        ? false
        : dayjs(formattedDate).isBefore(dayjs(minDate));
    },
    [calendarData.date, minDate]
  );

  const isDateTooLate = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (!maxDate) {
        return false;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = newDate.set("date", day);
      return dayjs(formattedDate).isSame(dayjs(maxDate), "day")
        ? false
        : dayjs(formattedDate).isAfter(dayjs(maxDate));
    },
    [calendarData.date, maxDate]
  );

  const isDateDisabled = useCallback(
    (day: number, type: "current" | "previous" | "next") => {
      if (isDateTooEarly(day, type) || isDateTooLate(day, type)) {
        return true;
      }
      const object = {
        previous: previousMonth(calendarData.date),
        current: calendarData.date,
        next: nextMonth(calendarData.date),
      };
      const newDate = object[type as keyof typeof object];
      const formattedDate = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;

      if (
        !disabledDates ||
        (Array.isArray(disabledDates) && !disabledDates.length)
      ) {
        return false;
      }

      let matchingCount = 0;
      disabledDates?.forEach((dateRange) => {
        if (
          dayjs(formattedDate).isAfter(dateRange.startDate) &&
          dayjs(formattedDate).isBefore(dateRange.endDate)
        ) {
          matchingCount++;
        }
        if (
          dayjs(formattedDate).isSame(dateRange.startDate) ||
          dayjs(formattedDate).isSame(dateRange.endDate)
        ) {
          matchingCount++;
        }
      });
      return matchingCount > 0;
    },
    [calendarData.date, isDateTooEarly, isDateTooLate, disabledDates]
  );

  const buttonClass = useCallback(
    (day: number, type: "current" | "next" | "previous") => {
      let baseClass = `calender-day c-flex c-items-center c-justify-center ${
        style === "google"
          ? " c-w-6 c-h-6 c-m-1"
          : "c-w-12 c-h-12 lg:c-w-10 lg:c-h-10"
      } c-relative`;
      if (type === "current") {
        return cn(
          baseClass,
          !activeDateData(day).active
            ? hoverClassByDay(day)
            : style === "google"
            ? ""
            : activeDateData(day).className,
          isDateDisabled(day, type) && "c-text-gray-400 c-cursor-not-allowed"
        );
      }
      return cn(
        baseClass,
        isDateDisabled(day, type) && "c-cursor-not-allowed",
        "c-text-gray-400"
      );
    },
    [activeDateData, hoverClassByDay, isDateDisabled]
  );

  const checkIfHoverPeriodContainsDisabledPeriod = useCallback(
    (hoverPeriod: Period) => {
      if (!Array.isArray(disabledDates)) {
        return false;
      }
      for (let i = 0; i < disabledDates.length; i++) {
        if (
          dayjs(hoverPeriod.start).isBefore(disabledDates[i].startDate) &&
          dayjs(hoverPeriod.end).isAfter(disabledDates[i].endDate)
        ) {
          return true;
        }
      }
      return false;
    },
    [disabledDates]
  );

  const getMetaData = useCallback(() => {
    return {
      previous: previousMonth(calendarData.date),
      current: calendarData.date,
      next: nextMonth(calendarData.date),
    };
  }, [calendarData.date]);

  const hoverDay = useCallback(
    (day: number, type: string) => {
      const object = getMetaData();
      const newDate = object[type as keyof typeof object];
      const newHover = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;

      if (period.start && !period.end) {
        const hoverPeriod = { ...period, end: newHover };
        if (dayjs(newHover).isBefore(dayjs(period.start))) {
          hoverPeriod.start = newHover;
          hoverPeriod.end = period.start;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: null,
              end: period.start,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }

      if (!period.start && period.end) {
        const hoverPeriod = { ...period, start: newHover };
        if (dayjs(newHover).isAfter(dayjs(period.end))) {
          hoverPeriod.start = period.end;
          hoverPeriod.end = newHover;
          if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
            changePeriod({
              start: period.end,
              end: null,
            });
          }
        }
        if (!checkIfHoverPeriodContainsDisabledPeriod(hoverPeriod)) {
          changeDayHover(newHover);
        }
      }
    },
    [
      changeDayHover,
      changePeriod,
      checkIfHoverPeriodContainsDisabledPeriod,
      getMetaData,
      period,
    ]
  );

  const handleClickDay = useCallback(
    (day: number, type: "previous" | "current" | "next") => {
      function continueClick() {
        if (type === "previous") {
          onClickPreviousDays(day);
        }

        if (type === "current") {
          onClickDay(day);
        }

        if (type === "next") {
          onClickNextDays(day);
        }
      }

      if (disabledDates?.length) {
        const object = getMetaData();
        const newDate = object[type as keyof typeof object];
        const clickDay = `${newDate.year()}-${newDate.month() + 1}-${
          day >= 10 ? day : "0" + day
        }`;

        if (period.start && !period.end) {
          dayjs(clickDay).isSame(dayHover) && continueClick();
        } else if (!period.start && period.end) {
          dayjs(clickDay).isSame(dayHover) && continueClick();
        } else {
          continueClick();
        }
      } else {
        continueClick();
      }
    },
    [
      dayHover,
      disabledDates?.length,
      getMetaData,
      onClickDay,
      onClickNextDays,
      onClickPreviousDays,
      period.end,
      period.start,
    ]
  );
  const load_marker = (day: number, type: string) => {
    let fullDay = `${calendarData.date.year()}-${
      calendarData.date.month() + 1
    }-${day >= 10 ? day : "0" + day}`;
    if (type === "previous") {
      const newDate = previousMonth(calendarData.date);
      fullDay = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;
    }
    if (type === "next") {
      const newDate = nextMonth(calendarData.date);
      fullDay = `${newDate.year()}-${newDate.month() + 1}-${
        day >= 10 ? day : "0" + day
      }`;
    }
    const res = new Date(fullDay);
    return typeof onIcon === "function" ? onIcon(day, res) : null;
  };
  return (
    <div
      className={cx(
        "calender-days c-grid c-grid-cols-7 c-gap-y-0.5 c-my-1",
        css`
          grid-template-columns: repeat(
            auto-fit,
            minmax(0px, 1fr)
          ); /* Grid fleksibel */

          .calender-grid {
            aspect-ratio: 1 / 1;
          }
        `
      )}
    >
      {calendarData.days.previous.map((item, index) => (
        <div
          className={cx(
            "calender-grid c-flex c-flex-row",
            style === "google" ? "hover:c-bg-gray-100  c-cursor-pointer" : ""
          )}
          onClick={() => {
            if (style === "google") handleClickDay(item, "previous");
          }}
        >
          <div className="c-flex c-flex-col c-flex-grow calender-day-wrap">
            {style === "google" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "previous")}
                  className={`${buttonClass(item, "previous")}`}
                  onMouseOver={() => {
                    hoverDay(item, "previous");
                  }}
                >
                  <span className="c-relative">{item}</span>
                </button>
                <div>{load_marker(item, "previous")}</div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "previous")}
                  className={`${buttonClass(item, "previous")}`}
                  onClick={() => handleClickDay(item, "previous")}
                  onMouseOver={() => {
                    hoverDay(item, "previous");
                  }}
                >
                  <span className="c-relative">
                    {item}
                    {load_marker(item, "previous")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {calendarData.days.current.map((item, index) => (
        <div
          className={cx(
            "calender-grid c-flex c-flex-row",
            style === "google"
              ? activeDateData(item).active
                ? "c-bg-blue-200/75 c-ring-1  c-cursor-pointer"
                : "hover:c-bg-gray-100  c-cursor-pointer"
              : ""
          )}
          onClick={() => {
            if (style === "google") handleClickDay(item, "current");
          }}
        >
          <div className="c-flex c-flex-col c-flex-grow calender-day-wrap">
            {style === "google" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "current")}
                  className={`${buttonClass(item, "current")}`}
                  // onClick={() => handleClickDay(item, "current")}
                  onMouseOver={() => {
                    hoverDay(item, "current");
                  }}
                >
                  <span className="c-relative">{item}</span>
                </button>
                <div>{load_marker(item, "current")}</div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "current")}
                  className={`${buttonClass(item, "current")}`}
                  onClick={() => handleClickDay(item, "current")}
                  onMouseOver={() => {
                    hoverDay(item, "current");
                  }}
                >
                  <span className="c-relative">
                    {item}
                    {load_marker(item, "current")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}

      {calendarData.days.next.map((item, index) => (
        <div
          className={cx(
            "calender-grid c-flex c-flex-row",
            style === "google" ? "hover:c-bg-gray-100  c-cursor-pointer" : ""
          )}
          onClick={() => {
            if (style === "google") handleClickDay(item, "next");
          }}
        >
          <div className="c-flex c-flex-col c-flex-grow calender-day-wrap">
            {style === "google" ? (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "next")}
                  className={`${buttonClass(item, "next")}`}
                  onMouseOver={() => {
                    hoverDay(item, "next");
                  }}
                >
                  <span className="c-relative">{item}</span>
                </button>
                <div>{load_marker(item, "next")}</div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  key={index}
                  disabled={isDateDisabled(item, "next")}
                  className={`${buttonClass(item, "next")}`}
                  onClick={() => handleClickDay(item, "next")}
                  onMouseOver={() => {
                    hoverDay(item, "next");
                  }}
                >
                  <span className="c-relative">
                    {item}
                    {load_marker(item, "next")}
                  </span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Days;
