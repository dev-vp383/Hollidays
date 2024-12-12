<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="login-container">
        <h1>Admin Dashboard</h1>
        <div id="controls">
            <label for="employee-select">Select Employee:</label>
            <select id="employee-select">
                <option value="john">John Doe</option>
                <option value="jane">Jane Smith</option>
                <option value="mike">Mike Brown</option>
            </select>
            <button id="add-vacation-btn">Add Vacation</button>
        </div>
        <div id="calendar"></div>
    </div>
    <script src="calendar.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/9.17.1/firebase-database.js"></script>
    <script>
        // Firebase configuration
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
        const app = firebase.initializeApp(firebaseConfig);
        const database = firebase.database(app);

        // Generate calendar
        generateCalendar(2025);

        // Track selected dates
        let selectedDates = [];

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

        // Add vacation to Firebase
        document.getElementById('add-vacation-btn').addEventListener('click', async () => {
            const employee = document.getElementById('employee-select').value;

            if (!selectedDates.length) {
                alert('Please select at least one date.');
                return;
            }

            const ref = firebase.database().ref(`vacations/${employee}`);
            const snapshot = await ref.get();

            let existingDates = snapshot.val() || [];
            existingDates = [...new Set([...existingDates, ...selectedDates])];

            await ref.set(existingDates);

            selectedDates.forEach((date) => {
                const dayCell = document.querySelector(`.day-cell[data-date="${date}"]`);
                if (dayCell) {
                    dayCell.style.backgroundColor = 'orange';
                }
            });

            selectedDates = [];
            alert(`Vacation added for ${employee}!`);
        });
    </script>
</body>
</html>
