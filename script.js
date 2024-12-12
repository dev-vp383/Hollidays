// Predefined users
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
            // Redirect user to the user page
            window.location.href = 'user.html';
        }
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
}

// Add event listener for the button click
document.getElementById('login-btn').addEventListener('click', login);

// Add event listener for the Enter key
document.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        login();
    }
});
