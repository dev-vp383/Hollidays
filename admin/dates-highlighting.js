document.addEventListener("DOMContentLoaded", () => {
    const latvianHolidayRanges = {
        2025: [
            { date: "2025-01-01", description: "Jaungada diena" },
            { date: "2025-04-18", description: "Lielā piektdiena" },
            { date: "2025-04-20", description: "Pirmās Lieldienas" },
            { date: "2025-04-21", description: "Otrās Lieldienas" },
            { date: "2025-05-01", description: "Darba svētki, Latvijas Republikas Satversmes sapulces sasaukšanas diena" },
            { date: "2025-05-04", description: "Latvijas Republikas Neatkarības deklarācijas pasludināšanas diena" },
            { date: "2025-05-05", description: "Pārceltā brīvdiena (no 04.05.2025)" },
            { date: "2025-05-11", description: "Mātes diena" },
            { date: "2025-06-08", description: "Vasarsvētki" },
            { date: "2025-06-23", description: "Līgo diena" },
            { date: "2025-06-24", description: "Jāņu diena" },
            { date: "2025-11-18", description: "Latvijas Republikas proklamēšanas diena" },
            { date: "2025-12-24", description: "Ziemassvētku vakars" },
            { date: "2025-12-25", description: "Pirmie Ziemassvētki" },
            { date: "2025-12-26", description: "Otrie Ziemassvētki" },
            { date: "2025-12-31", description: "Vecgada diena" },
        ],
        2026: [
            { date: "2026-01-01", description: "Jaungada diena" },
            { date: "2026-04-03", description: "Lielā piektdiena" },
            { date: "2026-04-05", description: "Pirmās Lieldienas" },
            { date: "2026-04-06", description: "Otrās Lieldienas" },
            { date: "2026-05-01", description: "Darba svētki, Latvijas Republikas Satversmes sapulces sasaukšanas diena" },
            { date: "2026-05-04", description: "Latvijas Republikas Neatkarības deklarācijas pasludināšanas diena" },
            { date: "2026-05-10", description: "Mātes diena" },
            { date: "2026-06-07", description: "Vasarsvētki" },
            { date: "2026-06-23", description: "Līgo diena" },
            { date: "2026-06-24", description: "Jāņu diena" },
            { date: "2026-11-18", description: "Latvijas Republikas proklamēšanas diena" },
            { date: "2026-12-24", description: "Ziemassvētku vakars" },
            { date: "2026-12-25", description: "Pirmie Ziemassvētki" },
            { date: "2026-12-26", description: "Otrie Ziemassvētki" },
            { date: "2026-12-31", description: "Vecgada diena" },
        ]
    };

    const vacationNotAllowedRanges = {
        2025: [
            { start: "2025-02-10", end: "2025-02-17" },
            { start: "2025-03-05", end: "2025-03-20" },
            { start: "2025-04-16", end: "2025-04-24" },
            { start: "2025-04-30", end: "2025-05-02" },
            { start: "2025-06-10", end: "2025-06-19" },
            { start: "2025-10-28", end: "2025-11-04" },
            { start: "2025-11-26", end: "2025-12-02" },
            { start: "2025-12-15", end: "2026-01-03" }
        ],
        2026: [
            { start: "2026-02-09", end: "2026-02-16" },
            { start: "2026-03-03", end: "2026-03-18" },
            { start: "2026-04-15", end: "2026-04-23" },
            { start: "2026-04-29", end: "2026-05-01" },
            { start: "2026-06-09", end: "2026-06-18" },
            { start: "2026-10-27", end: "2026-11-03" },
            { start: "2026-11-25", end: "2026-12-01" },
            { start: "2026-12-15", end: "2027-01-03" }
        ]
    };

    // Helper: Generate date ranges
    function generateDateRange(start, end) {
        const dates = [];
        let currentDate = new Date(start);
        const endDate = new Date(end);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    // Highlighting function
    function highlightDates() {
    console.log("Highlighting dates...");

    // Get current year from calendar or default to 2025
    const currentYear = window.currentYear || 2025;
    const yearHolidays = latvianHolidayRanges[currentYear] || latvianHolidayRanges[2025];
    const yearRestrictedRanges = vacationNotAllowedRanges[currentYear] || vacationNotAllowedRanges[2025];

    const latvianDates = yearHolidays.map(h => h.date);
    const restrictedDates = yearRestrictedRanges.flatMap(range =>
        generateDateRange(range.start, range.end)
    );

    const allDates = new Set([...latvianDates, ...restrictedDates]);

    allDates.forEach(date => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            const isLatvianHoliday = latvianDates.includes(date);
            const isRestrictedDate = restrictedDates.includes(date);

            // Add a class to trigger CSS triangle
            if (isLatvianHoliday && isRestrictedDate) {
                dayCell.classList.add("highlighted-date", "both-highlighted");
            } else if (isLatvianHoliday) {
                dayCell.classList.add("highlighted-date", "holiday-highlighted");
            } else if (isRestrictedDate) {
                dayCell.classList.add("highlighted-date", "restricted-highlighted");
            }

            // Update tooltip
            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            const newTooltip = [];
            if (isLatvianHoliday) {
                const holiday = yearHolidays.find(h => h.date === date);
                if (holiday) newTooltip.push(holiday.description);
            }
            if (isRestrictedDate) {
                newTooltip.push("VACATION NOT ALLOWED");
            }
            const combinedTooltip = [existingTooltip, ...newTooltip].filter(Boolean).join("\n");
            dayCell.setAttribute("data-tooltip", combinedTooltip);
        }
    });

    console.log("Dates highlighted successfully.");
}


    // Call the highlighting function
    highlightDates();
});
