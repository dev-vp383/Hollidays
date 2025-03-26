document.addEventListener("DOMContentLoaded", () => {
    const latvianHolidayRanges = [
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
    ];

    const vacationNotAllowedRanges = [
        { start: "2025-02-10", end: "2025-02-17" },
        { start: "2025-03-05", end: "2025-03-20" },
        { start: "2025-04-16", end: "2025-04-24" },
        { start: "2025-04-30", end: "2025-05-02" },
        { start: "2025-10-28", end: "2025-11-04" },
        { start: "2025-11-26", end: "2025-12-02" },
        { start: "2025-12-15", end: "2026-01-03" }
    ];

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

    const latvianDates = latvianHolidayRanges.map(h => h.date);
    const restrictedDates = vacationNotAllowedRanges.flatMap(range =>
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
                const holiday = latvianHolidayRanges.find(h => h.date === date);
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
