// Combined Date Highlighting - Contains Restricted Dates, Latvian Holidays, and Special Dates

// ============================================================================
// RESTRICTED DATES (Vacations Not Allowed)
// ============================================================================

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
            
            // Ensure date number is preserved for restricted dates
            const dateNumber = dayCell.dataset.dateNumber || dayCell.textContent.trim();
            if (dateNumber && !dayCell.hasAttribute("data-date-number")) {
                dayCell.setAttribute("data-date-number", dateNumber);
            }
        }
    });
}

// ============================================================================
// LATVIAN HOLIDAYS
// ============================================================================

if (typeof window.latvianHolidayRanges === "undefined") {
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
    window.latvianHolidayRanges = latvianHolidayRanges;
}

function highlightLatvianHolidays() {
    if (!window.latvianHolidayRanges) {
        console.error("Latvian holidays are not properly defined.");
        return;
    }

    

    // Get current year from calendar or default to 2025
    const currentYear = window.currentYear || 2025;
    const yearHolidays = latvianHolidayRanges[currentYear] || latvianHolidayRanges[2025];
    
    yearHolidays.forEach(({ date, description }) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            // Remove conflicting classes (e.g., special-date)
            dayCell.classList.remove("special-date");

            // Apply Latvian holiday class
            dayCell.classList.add("latvian-holiday");

            // Combine tooltips - prevent duplicates
            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            if (!existingTooltip.includes(description)) {
                const combinedTooltip = [existingTooltip, description].filter(Boolean).join("\n");
                dayCell.setAttribute("data-tooltip", combinedTooltip);
            }
            
            // Ensure date number is preserved for Latvian holidays
            const dateNumber = dayCell.dataset.dateNumber || dayCell.textContent.trim();
            if (dateNumber && !dayCell.hasAttribute("data-date-number")) {
                dayCell.setAttribute("data-date-number", dateNumber);
            }
        } else {
            console.warn(`No cell found for Latvian holiday date: ${date}`);
        }
    });


}

// ============================================================================
// SPECIAL DATES
// ============================================================================

// Define specialDateRanges only if not already defined
if (typeof window.specialDateRanges === "undefined") {
    const specialDateRanges = {
        2025: [
            { start: "2025-01-01", end: "2025-01-01", description: "New Year's Day" },
            { start: "2025-02-14", end: "2025-02-14", description: "Valentine's Day" },
            { start: "2025-12-25", end: "2025-12-25", description: "Christmas Day" },
            { start: "2025-07-04", end: "2025-07-04", description: "Independence Day" },
        ],
        2026: [
            { start: "2026-01-01", end: "2026-01-01", description: "New Year's Day" },
            { start: "2026-02-14", end: "2026-02-14", description: "Valentine's Day" },
            { start: "2026-12-25", end: "2026-12-25", description: "Christmas Day" },
            { start: "2026-07-04", end: "2026-07-04", description: "Independence Day" },
        ]
    };
    window.specialDateRanges = specialDateRanges; // Attach to global scope
}

function highlightSpecialDates() {
    if (!window.specialDateRanges) {
        console.error("Special dates are not properly defined.");
        return;
    }

   

    // Get current year from calendar or default to 2025
    const currentYear = window.currentYear || 2025;
    const yearSpecialDates = specialDateRanges[currentYear] || specialDateRanges[2025];
    
            yearSpecialDates.forEach(({ start, end, description }) => {
        const date = start; // For single day events, start and end are the same
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell && !dayCell.classList.contains("latvian-holiday")) { // Skip if already a Latvian holiday
            dayCell.classList.add("special-date");

            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            if (!existingTooltip.includes(description)) {
                const combinedTooltip = [existingTooltip, description].filter(Boolean).join("\n");
                dayCell.setAttribute("data-tooltip", combinedTooltip);
            }
            
            // Ensure date number is preserved for special dates
            const dateNumber = dayCell.dataset.dateNumber || dayCell.textContent.trim();
            if (dateNumber && !dayCell.hasAttribute("data-date-number")) {
                dayCell.setAttribute("data-date-number", dateNumber);
            }
        }
    });

   

// ============================================================================
// GLOBAL FUNCTIONS - Attach to global scope
// ============================================================================

window.highlightVacationNotAllowed = highlightVacationNotAllowed;
window.highlightLatvianHolidays = highlightLatvianHolidays;
window.highlightSpecialDates = highlightSpecialDates;


