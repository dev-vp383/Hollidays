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

// Array to track selected dates
let selectedDates = [];

// Event delegation for date selection
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
            event.target.style.backgroundColor = 'orange'; // Highlight selected
        }

        console.log('Selected Dates:', selectedDates);
    }
});

// Add Vacation Button Logic
document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employee = document.getElementById('employee-select').value;

    if (!selectedDates.length) {
        alert('Please select at least one date.');
        return;
    }

    try {
        // Reference to the employee's vacation data
        const ref = database.ref(`vacations/${employee}`);
        const snapshot = await ref.get();

        let existingDates = snapshot.val() || [];

        // Combine and remove duplicates
        existingDates = [...new Set([...existingDates, ...selectedDates])];

        // Save updated data to Firebase
        await ref.set(existingDates);

        console.log(`Vacation data saved for ${employee}:`, existingDates);

        // Update UI to show saved dates
        selectedDates.forEach((date) => {
            const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
            if (dayCell) {
                dayCell.style.backgroundColor = 'orange'; // Confirm as saved
            }
        });

        // Clear selected dates
        selectedDates = [];
        alert(`Vacation added for ${employee}!`);
    } catch (error) {
        console.error('Error saving vacation data:', error);
        alert('Failed to save vacation. Please try again.');
    }
});
