// Firebase configuration (replace with your Firebase credentials)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

// Track selected dates
let selectedDates = [];

// Handle date selection
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

// Add vacation to Firebase
document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employee = document.getElementById('employee-select').value;

    if (!selectedDates.length) {
        alert('Please select at least one date.');
        return;
    }

    // Reference the employee's vacation data in Firebase
    const ref = firebase.database().ref(`vacations/${employee}`);
    const snapshot = await ref.get();

    // Get existing vacation dates or initialize an empty array
    let existingDates = snapshot.val() || [];

    // Combine selected and existing dates (remove duplicates)
    existingDates = [...new Set([...existingDates, ...selectedDates])];

    // Save the updated vacation dates to Firebase
    await ref.set(existingDates);

    // Update the calendar visually for the admin
    selectedDates.forEach((date) => {
        const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
        if (dayCell) {
            dayCell.style.backgroundColor = 'orange';
        }
    });

    // Clear the selection
    selectedDates = [];
    alert(`Vacation added for ${employee}!`);
});
