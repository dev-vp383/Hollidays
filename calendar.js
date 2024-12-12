function generateCalendar(year) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const calendarContainer = document.getElementById('calendar');

    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29;
    }

    calendarContainer.innerHTML = '';

    months.forEach((month, index) => {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        const monthHeader = document.createElement('h2');
        monthHeader.textContent = month;
        monthContainer.appendChild(monthHeader);

        const daysContainer = document.createElement('div');
        daysContainer.className = 'days-container';

        let week = [];
        for (let day = 1; day <= daysInMonth[index]; day++) {
            week.push(day);

            if (week.length === 7 || day === daysInMonth[index]) {
                const weekRow = document.createElement('div');
                weekRow.className = 'week-row';

                week.forEach((dayNumber) => {
                    const dayCell = document.createElement('span');
                    dayCell.className = 'day-cell';
                    dayCell.textContent = dayNumber;
                    dayCell.dataset.date = `${year}-${String(index + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
                    weekRow.appendChild(dayCell);
                });

                daysContainer.appendChild(weekRow);
                week = [];
            }
        }

        monthContainer.appendChild(daysContainer);
        calendarContainer.appendChild(monthContainer);
    });
}
