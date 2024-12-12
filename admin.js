// Global vacation data
let vacationData = JSON.parse(localStorage.getItem('vacationData')) || {};

// Track selected dates
let selectedDates = [];

// Function to handle date selection
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('day-cell')) {
        const date = event.target.dataset.date;

        if (selectedDates.includes(date)) {
            // Deselect the date
            selectedDates = selectedDates.filter((d) => d !== date);
            event.target.style.backgroundColor = '#2a2a2a'; // Reset color
        } else {
            // Select the date
            selectedDates.push(date);
            event.target.style.backgroundColor = 'orange'; // Highlight color
        }
    }
});

// Add vacation functionality
document.getElementById('add-vacation-btn').addEventListener('click', () => {
    const employee = document.getElementById('employee-select').value;

    if (!vacationData[employee]) {
        vacationData[employee] = [];
    }

    // Add selected dates to the employee's vacation list
    vacationData[employee].push(...selectedDates);

    // Remove duplicates
    vacationData[employee] = [...new Set(vacationData[employee])];

    // Store the updated data in LocalStorage
    localStorage.setItem('vacationData', JSON.stringify(vacationData));

    // Clear selection
    selectedDates.forEach((date) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            dayCell.style.backgroundColor = 'orange';
        }
    });

    selectedDates = [];
    alert(`Vacation added for ${employee}!`);
});
