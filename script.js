// Predefined users with plaintext passwords
const users = {
    admin: {
        password: 'admin', // Admin password
        role: 'Admin'
    },
    user: {
        password: 'user', // User password
        role: 'User'
    }
};

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');
    const welcomeMessage = document.getElementById('welcome-message');

    errorMessage.textContent = '';
    welcomeMessage.textContent = '';

    // Validate username and password
    if (!users[username]) {
        errorMessage.textContent = 'Invalid username or password.';
        return;
    }

    if (password === users[username].password) {
        if (users[username].role === 'Admin') {
            // Redirect admin to the admin page
            window.location.href = 'admin.html';
        } else {
            // Show welcome message for user
            window.location.href = 'user.html';
        }
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
}

// Add event listener for the button
document.getElementById('login-btn').addEventListener('click', login);

// Function to generate a custom calendar
function generateCalendar(year) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const calendarContainer = document.getElementById('calendar');

    // Leap year adjustment
    if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29;
    }

    // Clear the container
    calendarContainer.innerHTML = '';

    // Generate calendar for each month
    months.forEach((month, index) => {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        const monthHeader = document.createElement('h2');
        monthHeader.textContent = month;
        monthContainer.appendChild(monthHeader);

        const daysContainer = document.createElement('div');
        daysContainer.className = 'days-container';

        // Fill the days for the month
        let week = [];
        for (let day = 1; day <= daysInMonth[index]; day++) {
            week.push(day);
            if (week.length === 7 || day === daysInMonth[index]) {
                const weekRow = document.createElement('div');
                weekRow.className = 'week-row';
                weekRow.textContent = week.join(', ');
                daysContainer.appendChild(weekRow);
                week = [];
            }
        }

        monthContainer.appendChild(daysContainer);
        calendarContainer.appendChild(monthContainer);
    });
}

