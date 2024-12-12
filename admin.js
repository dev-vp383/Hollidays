let vacationData = JSON.parse(localStorage.getItem('vacationData')) || {};
let selectedDates = [];

document.addEventListener('click', (event) => {
    if (event.target.classList.contains('day-cell')) {
        const date = event.target.dataset.date;

        if (selectedDates.includes(date)) {
            selectedDates = selectedDates.filter((d) => d !== date);
            event.target.style.backgroundColor = '#2a2a2a';
        } else {
            selectedDates.push(date);
            event.target.style.backgroundColor = 'orange';
        }
    }
});

document.getElementById('add-vacation-btn').addEventListener('click', () => {
    const employee = document.getElementById('employee-select').value;

    if (!vacationData[employee]) {
        vacationData[employee] = [];
    }

    vacationData[employee].push(...selectedDates);
    vacationData[employee] = [...new Set(vacationData[employee])];

    localStorage.setItem('vacationData', JSON.stringify(vacationData));

    selectedDates.forEach((date) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            dayCell.style.backgroundColor = 'orange';
        }
    });

    selectedDates = [];
    alert(`Vacation added for ${employee}!`);
});
