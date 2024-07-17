document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = '/dashboard';
        } else {
            document.getElementById('error-message').textContent = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});

document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;
    const email = document.getElementById('reg-email').value;
    
    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password, email })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Registration successful! Please log in.');
        } else {
            document.getElementById('register-error-message').textContent = data.message;
        }
    })
    .catch(error => console.error('Error:', error));
});
