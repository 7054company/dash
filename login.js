// login.js
document.addEventListener('DOMContentLoaded', function () {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch(`http://localhost:3000/api/login/${username}/${password}`);
      const data = await response.json();

      if (data.success) {
        // Login successful, store user session in cookies
        console.log('Login successful');
        console.log('User:', data.user);
        console.log('Session ID:', data.sessionId);

        // Set cookies for user session
        document.cookie = `loggedInUser=${JSON.stringify(data.user)}; path=/`;
        document.cookie = `sessionId=${data.sessionId}; path=/`;

        // Redirect to the dashboard in the "views" directory
        window.location.href = '/views/dashboard.html';
      } else {
        // Login failed, display an error message
        console.error('Login failed:', data.message);
        alert('Login failed. Please check your credentials.');
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred during login. Please try again.');
    }
  });
});

