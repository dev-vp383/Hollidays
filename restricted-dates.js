// Define vacationNotAllowedRanges only if not already defined
if (typeof window.vacationNotAllowedRanges === "undefined") {
    const vacationNotAllowedRanges = [
        { start: "2025-02-10", end: "2025-02-17" },
        { start: "2025-03-05", end: "2025-03-20" },
        { start: "2025-04-16", end: "2025-04-24" },
        { start: "2025-04-30", end: "2025-05-02" },
        { start: "2025-06-10", end: "2025-06-19" },
        { start: "2025-10-28", end: "2025-11-04" },
        { start: "2025-11-26", end: "2025-12-02" },
        { start: "2025-12-15", end: "2026-01-03" }
    ];
    window.vacationNotAllowedRanges = vacationNotAllowedRanges; // Attach to global scope
    console.log("Vacation Not Allowed Ranges Loaded:", vacationNotAllowedRanges);
}

function highlightVacationNotAllowed() {
    const restrictedDates = vacationNotAllowedRanges.flatMap(range => {
        const dates = [];
        let currentDate = new Date(range.start);
        const endDate = new Date(range.end);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    });

    restrictedDates.forEach(date => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            dayCell.style.backgroundColor = "#e69500"; // Restricted date color
            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            const combinedTooltip = [existingTooltip, "VACATION NOT ALLOWED"]
                .filter(Boolean)
                .join("\n"); // Use \n for multi-line tooltips
            dayCell.setAttribute("data-tooltip", combinedTooltip);
        }
    });
}


// Attach to global scope
window.highlightVacationNotAllowed = highlightVacationNotAllowed;
