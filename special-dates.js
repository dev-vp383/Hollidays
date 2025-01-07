// Define specialDateRanges only if not already defined
if (typeof window.specialDateRanges === "undefined") {
    const specialDateRanges = [
        { start: "2025-01-01", end: "2025-01-01", description: "New Year's Day" },
        { start: "2025-02-14", end: "2025-02-14", description: "Valentine's Day" },
        { start: "2025-12-25", end: "2025-12-25", description: "Christmas Day" },
        { start: "2025-07-04", end: "2025-07-04", description: "Independence Day" },
    ];
    window.specialDateRanges = specialDateRanges; // Attach to global scope
}

function highlightSpecialDates() {
    if (!Array.isArray(window.specialDateRanges)) {
        console.error("Special dates are not properly defined.");
        return;
    }

    console.log("Highlighting Special Dates...");

    specialDateRanges.forEach(({ date, description }) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell && !dayCell.classList.contains("latvian-holiday")) { // Skip if already a Latvian holiday
            dayCell.classList.add("special-date");

            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            const combinedTooltip = [existingTooltip, description].filter(Boolean).join("\n");
            dayCell.setAttribute("data-tooltip", combinedTooltip);
        }
    });

    console.log("Special dates highlighted successfully.");
}



// Attach to global scope
window.highlightSpecialDates = highlightSpecialDates;
