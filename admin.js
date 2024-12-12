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
    technical: 'blue',
    analytics: 'green',
    vip: 'orange',
    other: 'purple'
};

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

        console.log('Selected Dates:', selectedDates);
    }
});

// Add vacation and apply department color
document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employeeValue = document.getElementById('employee-select').value;
    const [employee, department] = employeeValue.split('|'); // Extract employee and department

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
