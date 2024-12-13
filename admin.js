// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyD0Biwjk-PfEGAsm_FUwavuo_6-FpfQw8I",
    authDomain: "vacation-calendar-ad463.firebaseapp.com",
    databaseURL: "https://vacation-calendar-ad463-default-rtdb.firebaseio.com",
    projectId: "vacation-calendar-ad463",
    storageBucket: "vacation-calendar-ad463.firebasestorage.app",
    messagingSenderId: "318751055172",
    appId: "1:318751055172:web:b511b2a74e7b804f56cb11"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Department Colors
const departmentColors = {
    technical: '#03346E',
    analytics: '#03346E',
    vip: '#FCC737',
    other: '#7E1891'
};

// Track selected dates
let selectedDates = [];

// Ensure DOM is fully loaded before executing
document.addEventListener("DOMContentLoaded", () => {
    // Generate Calendar
    generateCalendar(2025);

    // Load Existing Vacations
    loadExistingVacations();

    // Add Vacation Button Logic
    document.getElementById('add-vacation').addEventListener('click', async () => {
        const employeeValue = document.getElementById('employee-select').value;
        const [employee, department] = employeeValue.split('|'); // Extract employee and department

        if (!selectedDates.length) {
            alert('Please select at least one date.');
            return;
        }

        try {
            const ref = database.ref(`vacations/${employee}`);
            const snapshot = await ref.get();

            // Retrieve existing data or initialize with default structure
            let existingData = snapshot.val() || { dates: [], department };

            // Combine existing and new dates
            existingData.dates = [...new Set([...existingData.dates, ...selectedDates])];

            // Save updated data with department
            await ref.set(existingData);

            // Apply department color to selected dates
            selectedDates.forEach((date) => {
                const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                if (dayCell) {
                    dayCell.style.backgroundColor = departmentColors[department]; // Apply department color
                }
            });

            selectedDates = []; // Clear the selected dates array
            alert(`Vacation added for ${employee}!`);
        } catch (error) {
            console.error('Error saving vacation:', error);
            alert('Failed to save vacation.');
        }
    });

    // Handle date selection
    document.addEventListener('click', (event) => {
        if (event.target.classList.contains('day-cell')) {
            const date = event.target.dataset.date;

            if (selectedDates.includes(date)) {
                selectedDates = selectedDates.filter((d) => d !== date);
                event.target.style.backgroundColor = ''; // Reset to default color
            } else {
                selectedDates.push(date);
                event.target.style.backgroundColor = 'yellow'; // Temporary highlight
            }

            console.log('Selected Dates:', selectedDates);
        }
    });
});

// Load Existing Vacations on Page Load
async function loadExistingVacations() {
    try {
        const ref = database.ref('vacations');
        const snapshot = await ref.get();
        const vacationData = snapshot.val() || {};
        console.log('Loaded vacation data:', vacationData);

        Object.entries(vacationData).forEach(([employee, data]) => {
            const { dates, department } = data;

            if (Array.isArray(dates)) {
                dates.forEach((date) => {
                    const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                    if (dayCell) {
                        dayCell.style.backgroundColor = departmentColors[department] || 'gray'; // Apply department color
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error loading vacations:', error);
    }
}
