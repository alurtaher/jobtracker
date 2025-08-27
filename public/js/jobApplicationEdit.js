document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('editJobAppForm');
  const messageEl = document.getElementById('message');

  // Extract job application ID from URL query params
  const urlParams = new URLSearchParams(window.location.search);
  const jobAppId = urlParams.get('id');

  if (!jobAppId) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Invalid job application ID.';
    form.style.display = 'none';
    return;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Please login to edit applications.';
    form.style.display = 'none';
    return;
  }

  try {
    // Fetch existing data to pre-fill form
    const response = await axios.get(`http://localhost:5000/api/job-applications/${jobAppId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const app = response.data;
    document.getElementById('companyName').value = app.companyName;
    document.getElementById('jobTitle').value = app.jobTitle;
    document.getElementById('applicationDate').value = app.applicationDate;
    document.getElementById('status').value = app.status;
    document.getElementById('notes').value = app.notes || '';

  } catch (error) {
    messageEl.style.color = 'red';
    messageEl.textContent = 'Failed to load job application data.';
    form.style.display = 'none';
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
      companyName: document.getElementById('companyName').value.trim(),
      jobTitle: document.getElementById('jobTitle').value.trim(),
      applicationDate: document.getElementById('applicationDate').value,
      status: document.getElementById('status').value,
      notes: document.getElementById('notes').value.trim(),
    };

    messageEl.style.color = 'red';
    messageEl.textContent = '';

    try {
      await axios.put(`http://localhost:5000/api/job-applications/${jobAppId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      messageEl.style.color = 'green';
      messageEl.textContent = 'Application updated successfully!';
    } catch (error) {
      const errMsg = error.response?.data?.error || 'Update failed.';
      messageEl.textContent = errMsg;
    }
  });
});