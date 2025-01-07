// Predefined users
const users = {
    admin: {
        password: 'admin',
        role: 'Admin'
    },
    user: {
        password: 'user',
        role: 'User'
    }
};

// Login function
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('error-message');

    errorMessage.textContent = '';

    if (!users[username]) {
        errorMessage.textContent = 'Invalid username or password.';
        return;
    }

    if (password === users[username].password) {
        if (users[username].role === 'Admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'user.html';
        }
    } else {
        errorMessage.textContent = 'Invalid username or password.';
    }
}

// Add event listener for login button
document.getElementById('login-btn').addEventListener('click', login);

// Allow Enter key to trigger login
document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        login();
    }
});