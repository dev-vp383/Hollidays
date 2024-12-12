const firebaseConfig = {
    apiKey: "AIzaSyD0Biwjk-PfEGAsm_FUwavuo_6-FpfQw8I",
    authDomain: "vacation-calendar-ad463.firebaseapp.com",
    databaseURL: "https://vacation-calendar-ad463-default-rtdb.firebaseio.com",
    projectId: "vacation-calendar-ad463",
    storageBucket: "vacation-calendar-ad463.firebasestorage.app",
    messagingSenderId: "318751055172",
    appId: "1:318751055172:web:b511b2a74e7b804f56cb11"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database(app);

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

document.getElementById('add-vacation-btn').addEventListener('click', async () => {
    const employee = document.getElementById('employee-select').value;

    if (!selectedDates.length) {
        alert('Please select at least one date.');
        return;
    }

    const ref = database.ref(`vacations/${employee}`);
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
