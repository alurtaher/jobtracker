document.addEventListener('DOMContentLoaded', async () => {
  const profileDiv = document.getElementById('profileData');
  const avatarDiv = document.getElementById('userAvatar');
  const token = localStorage.getItem('token');

  if (!token) {
    window.location.href = '/login';
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/users/profiledata', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const user = response.data;

    // Update avatar with initials
    if (user.name) {
      avatarDiv.textContent = user.name.charAt(0).toUpperCase();
    }

    profileDiv.innerHTML = `
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Career Goals:</strong> ${user.careerGoals || '-'}</p>
      <p><strong>Joined:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
    `;
  } catch (error) {
    profileDiv.innerHTML = `
      <p>Failed to load profile. Please 
      <a href="/login">login</a> again.</p>`;
    localStorage.removeItem('token');
  }
});

// Logout button handler
document.getElementById('logoutBtn').addEventListener('click', () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
});