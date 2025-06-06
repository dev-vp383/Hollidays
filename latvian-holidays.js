if (typeof window.latvianHolidayRanges === "undefined") {
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
    window.latvianHolidayRanges = latvianHolidayRanges;
}

function highlightLatvianHolidays() {
    if (!Array.isArray(window.latvianHolidayRanges)) {
        console.error("Latvian holidays are not properly defined.");
        return;
    }

    console.log("Highlighting Latvian Holidays...");

    latvianHolidayRanges.forEach(({ date, description }) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            // Remove conflicting classes (e.g., special-date)
            dayCell.classList.remove("special-date");

            // Apply Latvian holiday class
            dayCell.classList.add("latvian-holiday");

            // Combine tooltips
            const existingTooltip = dayCell.getAttribute("data-tooltip") || "";
            const combinedTooltip = [existingTooltip, description].filter(Boolean).join("\n");
            dayCell.setAttribute("data-tooltip", combinedTooltip);
        } else {
            console.warn(`No cell found for Latvian holiday date: ${date}`);
        }
    });

    console.log("Latvian holidays highlighted successfully.");
}


// Attach to global scope
window.highlightLatvianHolidays = highlightLatvianHolidays;
