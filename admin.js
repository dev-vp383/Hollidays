// Track selected dates
let selectedDates = [];

// Handle date selection
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('day-cell')) {
        const date = event.target.dataset.date;

        if (selectedDates.includes(date)) {
            selectedDates = selectedDates.filter((d) => d !== date);
            event.target.style.backgroundColor = '#3a3a3a'; // Reset color
        } else {
            selectedDates.push(date);
            event.target.style.backgroundColor = 'yellow'; // Temporary highlight
        }
    }
});

// Add vacation and apply department color
document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employeeValue = document.getElementById('employee-select').value;
    const [employee, department] = employeeValue.split('|');

    if (!selectedDates.length) {
        alert('Please select at least one date.');
        return;
    }

    try {
        // Get reference to Firebase
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        // Combine existing and new dates
        let existingDates = snapshot.val() || [];
        existingDates = [...new Set([...existingDates, ...selectedDates])];

        // Save updated data
        await ref.set(existingDates);

        // Apply department color
        selectedDates.forEach((date) => {
            const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
            if (dayCell) {
                dayCell.style.backgroundColor = departmentColors[department]; // Apply department color
            }
        });

        selectedDates = [];
        alert(`Vacation added for ${employee}!`);
    } catch (error) {
        console.error('Error saving vacation:', error);
        alert('Failed to save vacation.');
    }
});
