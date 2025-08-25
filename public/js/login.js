document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  const messageEl = document.getElementById('message');
  messageEl.style.color = 'red';
  messageEl.textContent = '';

  try {
    const response = await axios.post('http://localhost:5000/api/auth/login', {
      email,
      password,
    });

    const { token, user } = response.data;

    // Save JWT token in localStorage
    localStorage.setItem('token', token);

    messageEl.style.color = 'green';
    messageEl.textContent = `Welcome back, ${user.name}! Redirecting...`;

    // Redirect to profile page or dashboard after 1.5 seconds
    setTimeout(() => {
      window.location.href = '/api/users/profile';
    }, 1500);
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Login failed';
    messageEl.textContent = errMsg;
  }
});