// Track selected dates
let selectedDates = [];

// Handle date selection
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('day-cell')) {
        const date = event.target.dataset.date;

        if (selectedDates.includes(date)) {
            selectedDates = selectedDates.filter((d) => d !== date);
            event.target.style.backgroundColor = '#2a2a2a'; // Reset color
        } else {
            selectedDates.push(date);
            event.target.style.backgroundColor = 'orange'; // Highlight color
        }
    }
});

// Add vacation and save to vacationData.json
document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employee = document.getElementById('employee-select').value;

    // Fetch existing vacation data
    const response = await fetch('vacationData.json');
    const vacationData = await response.json();

    // Add selected dates for the chosen employee
    if (!vacationData[employee]) {
        vacationData[employee] = [];
    }

    vacationData[employee].push(...selectedDates);
    vacationData[employee] = [...new Set(vacationData[employee])]; // Remove duplicates

    // Save updated data to vacationData.json
    await fetch('vacationData.json', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(vacationData),
    });

    // Clear selected dates
    selectedDates.forEach((date) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            dayCell.style.backgroundColor = 'orange';
        }
    });
    selectedDates = [];

    alert(`Vacation added for ${employee}!`);
});
