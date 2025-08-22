// Define vacationNotAllowedRanges only if not already defined
if (typeof window.vacationNotAllowedRanges === "undefined") {
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
    window.vacationNotAllowedRanges = vacationNotAllowedRanges; // Attach to global scope
    console.log("Vacation Not Allowed Ranges Loaded:", vacationNotAllowedRanges);
}

function highlightVacationNotAllowed() {
    // Get current year from calendar or default to 2025
    const currentYear = window.currentYear || 2025;
    const yearRanges = vacationNotAllowedRanges[currentYear] || vacationNotAllowedRanges[2025];
    
    const restrictedDates = yearRanges.flatMap(range => {
        const dates = [];
        let currentDate = new Date(range.start);
        const endDate = new Date(range.end);

        while (currentDate <= endDate) {
            dates.push(currentDate.toISOString().split("T")[0]);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    });

    // Store restricted dates globally so vacation-status.js can access them
    window.restrictedDates = restrictedDates;

    restrictedDates.forEach(date => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            // Don't set background color here - let vacation-status.js handle it
            // Just add the tooltip
            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            
            // Only add "VACATION NOT ALLOWED" if it's not already there
            if (!existingTooltip.includes("VACATION NOT ALLOWED")) {
                const combinedTooltip = [existingTooltip, "VACATION NOT ALLOWED"]
                    .filter(Boolean)
                    .join("\n"); // Use \n for multi-line tooltips
                dayCell.setAttribute("data-tooltip", combinedTooltip);
            }
        }
    });
}


// Attach to global scope
window.highlightVacationNotAllowed = highlightVacationNotAllowed;
