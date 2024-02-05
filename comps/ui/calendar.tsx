import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/utils"
import { buttonVariants } from "@/comps//ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("c-p-3", className)}
      classNames={{
        months: "c-flex c-flex-col sm:c-flex-row c-space-y-4 sm:c-space-x-4 sm:c-space-y-0",
        month: "c-space-y-4",
        caption: "c-flex c-justify-center c-pt-1 c-relative c-items-center",
        caption_label: "c-text-sm c-font-medium",
        nav: "c-space-x-1 c-flex c-items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "c-h-7 c-w-7 c-bg-transparent c-p-0 c-opacity-50 hover:c-opacity-100"
        ),
        nav_button_previous: "c-absolute c-left-1",
        nav_button_next: "c-absolute c-right-1",
        table: "c-w-full c-border-collapse c-space-y-1",
        head_row: "c-flex",
        head_cell:
          "c-text-muted-foreground c-rounded-md c-w-9 c-font-normal c-text-[0.8rem]",
        row: "c-flex c-w-full c-mt-2",
        cell: "c-h-9 c-w-9 c-text-center c-text-sm c-p-0 c-relative [&:has([aria-selected].day-range-end)]:c-rounded-r-md [&:has([aria-selected].day-outside)]:c-bg-accent/50 [&:has([aria-selected])]:c-bg-accent first:[&:has([aria-selected])]:c-rounded-l-md last:[&:has([aria-selected])]:c-rounded-r-md focus-within:c-relative focus-within:c-z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "c-h-9 c-w-9 c-p-0 c-font-normal aria-selected:c-opacity-100"
        ),
        day_range_end: "c-day-range-end",
        day_selected:
          "c-bg-primary c-text-primary-foreground hover:c-bg-primary hover:c-text-primary-foreground focus:c-bg-primary focus:c-text-primary-foreground",
        day_today: "c-bg-accent c-text-accent-foreground",
        day_outside:
          "c-day-outside c-text-muted-foreground c-opacity-50 aria-selected:c-bg-accent/50 aria-selected:c-text-muted-foreground aria-selected:c-opacity-30",
        day_disabled: "c-text-muted-foreground c-opacity-50",
        day_range_middle:
          "aria-selected:c-bg-accent aria-selected:c-text-accent-foreground",
        day_hidden: "c-invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeft className="c-h-4 c-w-4" />,
        IconRight: ({ ...props }) => <ChevronRight className="c-h-4 c-w-4" />,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
