// Calendar Year
const year = 2025;

// Generate Calendar Dynamically
function generateCalendar(year) {
    const calendarContainer = document.getElementById("calendar");

    if (!calendarContainer) {
        console.error("Calendar container not found!");
        return;
    }

    calendarContainer.innerHTML = ""; // Clear existing content

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement("div");
        monthContainer.classList.add("month-container");

        // Add Month Header
        const monthHeader = document.createElement("h2");
        monthHeader.textContent = months[month];
        monthContainer.appendChild(monthHeader);

        // Add Weekday Headers
        const weekdaysRow = document.createElement("div");
        weekdaysRow.classList.add("weekdays-container");
        weekdays.forEach(day => {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.classList.add("weekday-cell");
            weekdaysRow.appendChild(dayCell);
        });
        monthContainer.appendChild(weekdaysRow);

        // Add Days Container
        const daysContainer = document.createElement("div");
        daysContainer.classList.add("days-container");

        // Get First Day and Number of Days in the Month
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Add Blank Cells Before First Day of the Month
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const blankCell = document.createElement("span");
            blankCell.classList.add("day-cell", "blank");
            daysContainer.appendChild(blankCell);
        }

        // Add Actual Days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("span");
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            dayCell.classList.add("day-cell");

            // Remove the diagonal background logic entirely
            // If you had any conditions for applying diagonals, they are now removed.

            daysContainer.appendChild(dayCell);
        }

        monthContainer.appendChild(daysContainer);
        calendarContainer.appendChild(monthContainer);
    }
}

// Initialize Calendar
document.addEventListener("DOMContentLoaded", () => {
    generateCalendar(year);
});
