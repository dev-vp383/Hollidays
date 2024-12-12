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
