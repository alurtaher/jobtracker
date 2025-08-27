document.addEventListener('DOMContentLoaded', async () => {
  const messageEl = document.getElementById('message');
  const tbody = document.getElementById('jobAppTableBody');
  const token = localStorage.getItem('token');

  if (!token) {
    messageEl.textContent = 'Please login to view your job applications.';
    tbody.innerHTML = '<tr><td colspan="6">Not authorized</td></tr>';
    return;
  }

  try {
    const response = await axios.get('http://localhost:5000/api/job-applications', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const applications = response.data;

    if (applications.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6">No job applications found.</td></tr>';
      return;
    }

    tbody.innerHTML = applications.map(app => `
      <tr>
        <td>${app.companyName}</td>
        <td>${app.jobTitle}</td>
        <td>${new Date(app.applicationDate).toLocaleDateString()}</td>
        <td>${app.status}</td>
        <td>${app.notes || '-'}</td>
        <td>
          <button data-id="${app.id}" class="editBtn">Edit</button>
          <button data-id="${app.id}" class="deleteBtn">Delete</button>
        </td>
      </tr>
    `).join('');

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.deleteBtn').forEach(button => {
      button.addEventListener('click', async (e) => {
        const id = e.target.getAttribute('data-id');
        if (confirm('Are you sure to delete this application?')) {
          try {
            await axios.delete(`http://localhost:5000/api/job-applications/${id}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            messageEl.style.color = 'green';
            messageEl.textContent = 'Deleted successfully.';
            e.target.closest('tr').remove();
          } catch (err) {
            messageEl.style.color = 'red';
            messageEl.textContent = 'Failed to delete application.';
          }
        }
      });
    });

    document.querySelectorAll('.editBtn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        // Redirect to edit page (to be implemented next)
        window.location.href = `/views/jobApplicationEdit.html?id=${id}`;
      });
    });

  } catch (error) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Failed to load job applications.';
    tbody.innerHTML = '<tr><td colspan="6">Error loading data</td></tr>';
  }
});