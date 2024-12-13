// Generate the calendar dynamically
function generateCalendar(year) {
    const calendarContainer = document.getElementById("calendar");
    calendarContainer.innerHTML = ""; // Clear any existing content

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]; // Short weekday names

    for (let month = 0; month < 12; month++) {
        const monthContainer = document.createElement("div");
        monthContainer.classList.add("month-container");

        // Add month header
        const monthHeader = document.createElement("h2");
        monthHeader.textContent = months[month];
        monthContainer.appendChild(monthHeader);

        // Add weekday headers
        const weekdaysRow = document.createElement("div");
        weekdaysRow.classList.add("weekdays-container");
        weekdays.forEach((day) => {
            const dayCell = document.createElement("div");
            dayCell.textContent = day;
            dayCell.classList.add("weekday-cell");
            weekdaysRow.appendChild(dayCell);
        });
        monthContainer.appendChild(weekdaysRow);

        // Add days container
        const daysContainer = document.createElement("div");
        daysContainer.classList.add("days-container");

        // Get the first day of the month and number of days in the month
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday, 6 = Saturday
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Fill in blank cells for days before the first day of the month
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const blankCell = document.createElement("span");
            blankCell.classList.add("day-cell", "blank");
            daysContainer.appendChild(blankCell);
        }

        // Add actual days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayCell = document.createElement("span");
            dayCell.textContent = day;
            dayCell.dataset.date = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            dayCell.classList.add("day-cell");
            daysContainer.appendChild(dayCell);
        }

        monthContainer.appendChild(daysContainer);
        calendarContainer.appendChild(monthContainer);
    }
}
