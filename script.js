// Predefined users with hashed passwords
const users = {
    admin: {
        password: 'admin', // Plaintext password for simplicity
        role: 'Admin'
    },
    user: {
        password: 'user', // Plaintext password for simplicity
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
            welcomeMessage.textContent = `Welcome, ${users[username].role}!`;
            alert('User access granted. You can view the system.');
        }
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
}
