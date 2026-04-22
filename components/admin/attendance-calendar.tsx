import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isAfter,
  isBefore,
  isSameDay,
  isSameMonth,
  isSunday,
  startOfDay,
  startOfWeek
} from "date-fns";

type CalendarHoliday = {
  title: string;
  description: string | null;
};

type AttendanceCalendarProps = {
  monthStart: Date;
  monthEnd: Date;
  holidayByDay: Map<string, CalendarHoliday>;
  statusByDay: Map<string, string>;
  isScheduledWorkingDay: (date: Date) => boolean;
  isWeeklyHoliday: (date: Date) => boolean;
};

export function AttendanceCalendar({
  monthStart,
  monthEnd,
  holidayByDay,
  statusByDay,
  isScheduledWorkingDay,
  isWeeklyHoliday
}: AttendanceCalendarProps) {
  const today = startOfDay(new Date());
  const calendarDays = eachDayOfInterval({
    start: startOfWeek(monthStart, { weekStartsOn: 0 }),
    end: endOfWeek(monthEnd, { weekStartsOn: 0 })
  });
  const weeks = [];

  for (let index = 0; index < calendarDays.length; index += 7) {
    weeks.push(calendarDays.slice(index, index + 7));
  }

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((label) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 px-2 py-3">
            {label}
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {weeks.map((week, weekIndex) => (
          <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-3">
            {week.map((day) => {
              const dateKey = format(day, "yyyy-MM-dd");
              const holiday = holidayByDay.get(dateKey);
              const attendanceStatus = statusByDay.get(dateKey);
              const weeklyHoliday = isWeeklyHoliday(day);
              const holidayDay = weeklyHoliday || Boolean(holiday);
              const todayCell = isSameDay(day, today);
              const futureDay = isAfter(day, today);
              const pastDay = isBefore(day, today);
              const currentMonthDay = isSameMonth(day, monthStart);

              let label = attendanceStatus ?? "ABSENT";
              if (holidayDay) {
                label = holiday?.title ?? "Sunday Holiday";
              } else if (todayCell && !attendanceStatus) {
                label = "In Progress";
              } else if (futureDay && !attendanceStatus) {
                label = "Upcoming";
              } else if (!attendanceStatus && !pastDay && !todayCell) {
                label = "Upcoming";
              }

              const statusTone = holidayDay
                ? "border-amber-400/30 bg-amber-500/12"
                : todayCell && attendanceStatus === "PRESENT"
                  ? "border-cyan-400/35 bg-cyan-500/12"
                  : todayCell
                    ? "border-sky-400/35 bg-sky-500/12"
                    : futureDay
                      ? "border-zinc-600/40 bg-zinc-800/30"
                      : attendanceStatus === "PRESENT"
                        ? "border-emerald-400/30 bg-emerald-500/12"
                        : attendanceStatus === "HALF_DAY"
                          ? "border-yellow-400/30 bg-yellow-500/12"
                          : attendanceStatus === "LEAVE"
                            ? "border-violet-400/30 bg-violet-500/12"
                            : attendanceStatus === "ABSENT" || label === "ABSENT"
                              ? "border-rose-400/30 bg-rose-500/12"
                              : "border-white/10 bg-white/5";

              return (
                <div
                  key={day.toISOString()}
                  className={`min-h-[156px] rounded-[24px] border p-4 ${statusTone} ${
                    currentMonthDay ? "" : "opacity-35"
                  } ${isSunday(day) ? "shadow-[inset_0_0_0_1px_rgba(245,158,11,0.12)]" : ""}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">{format(day, "MMM")}</p>
                      <p className="mt-1 text-2xl font-semibold text-white">{format(day, "dd")}</p>
                    </div>
                    {todayCell ? (
                      <span className="rounded-full bg-sky-500/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-sky-100">
                        Today
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <p className="text-sm font-semibold text-white">{label.replaceAll("_", " ")}</p>
                    <p className="mt-2 text-xs leading-5 text-zinc-400">
                      {holiday?.description ??
                        (holidayDay
                          ? "Weekly holiday"
                          : futureDay
                            ? "Scheduled working day"
                            : isScheduledWorkingDay(day)
                              ? "Working day"
                              : "Holiday")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6 text-xs text-zinc-300">
        <span className="rounded-full border border-emerald-400/25 bg-emerald-500/10 px-3 py-2 text-center">Present</span>
        <span className="rounded-full border border-rose-400/25 bg-rose-500/10 px-3 py-2 text-center">Absent</span>
        <span className="rounded-full border border-yellow-400/25 bg-yellow-500/10 px-3 py-2 text-center">Half Day</span>
        <span className="rounded-full border border-violet-400/25 bg-violet-500/10 px-3 py-2 text-center">Leave</span>
        <span className="rounded-full border border-amber-400/25 bg-amber-500/10 px-3 py-2 text-center">Holiday</span>
        <span className="rounded-full border border-sky-400/25 bg-sky-500/10 px-3 py-2 text-center">Today / In Progress</span>
      </div>
    </div>
  );
}
