import * as React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "../../lib/utils";

import "react-day-picker/dist/style.css";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// const CustomNavigation = (props: React.ComponentProps<"div"> & {
//   nextMonth?: Date;
//   previousMonth?: Date;
//   onPreviousClick?: () => void;
//   onNextClick?: () => void;
// }) => (
//   <div className="flex items-center space-x-2">
//     <button
//       onClick={props.onPreviousClick}
//       disabled={!props.previousMonth}
//       aria-label="Previous month"
//       className="h-8 w-8 rounded-md text-[#0f172a] hover:bg-[#f3f4f6] transition disabled:opacity-50"
//     >
//       <ChevronLeft className="h-4 w-4" />
//     </button>
//     <button
//       onClick={props.onNextClick}
//       disabled={!props.nextMonth}
//       aria-label="Next month"
//       className="h-8 w-8 rounded-md text-[#0f172a] hover:bg-[#f3f4f6] transition disabled:opacity-50"
//     >
//       <ChevronRight className="h-4 w-4" />
//     </button>
//   </div>
// );

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0); 

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      disabled={{ before: today }}
      className={cn("p-3 bg-white rounded-lg", className)}
      classNames={{
        months: "flex flex-col",
        month: "space-y-4",
        caption: "flex justify-between items-center px-4",
        caption_label: "text-lg font-semibold text-[#0f172a]",
        nav: "flex items-center space-x-2",
        nav_button: "h-8 w-8 rounded-md text-[#0f172a] hover:bg-[#f3f4f6] transition",
        table: "w-full border-collapse",
        head_row: "flex",
        head_cell:
          "text-[#9ca3af] w-9 h-9 font-medium text-xs text-center",
        row: "flex w-full",
        cell: "h-9 w-9 text-center text-sm p-0 relative focus-within:relative focus-within:z-20",
        day: "h-9 w-9 p-0 text-sm text-[#0f172a] rounded-full hover:bg-[#e5e7eb] transition",
        day_selected:
          "bg-[#0f172a] text-white hover:bg-[#1e293b] focus:bg-[#0f172a] focus:text-white rounded-full",
        day_today: "bg-[#f3f4f6] text-[#0f172a] rounded-full",
        day_outside: "text-[#d1d5db] opacity-50",
        day_disabled: "text-[#9ca3af] opacity-50 cursor-not-allowed line-through",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        // Navigation: CustomNavigation,
      }}
      {...props}
    />
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
