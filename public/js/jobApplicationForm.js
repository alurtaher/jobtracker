document.getElementById('jobAppForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const companyName = document.getElementById('companyName').value.trim();
  const jobTitle = document.getElementById('jobTitle').value.trim();
  const applicationDate = document.getElementById('applicationDate').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value.trim();
  const resumeFileInput = document.getElementById('resumeFile');
  const resumeFile = resumeFileInput ? resumeFileInput.files[0] : null;

  const messageEl = document.getElementById('message');
  messageEl.style.color = 'red';
  messageEl.textContent = '';

  const token = localStorage.getItem('token');
  if (!token) {
    messageEl.textContent = 'You must be logged in to add a job application.';
    return;
  }

  // Helper function to send API request
  async function sendRequest(resumeBase64, resumeName, resumeMimeType) {
    const payload = {
      companyName,
      jobTitle,
      applicationDate,
      status,
      notes,
    };

    if (resumeBase64 && resumeName && resumeMimeType) {
      payload.resumeBase64 = resumeBase64;
      payload.resumeName = resumeName;
      payload.resumeMimeType = resumeMimeType;
    }

    const response = await axios.post('http://localhost:5000/api/job-applications', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response;
  }

  try {
    if (resumeFile) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64String = reader.result.split(',')[1]; // Remove prefix
        try {
          await sendRequest(base64String, resumeFile.name, resumeFile.type);
          messageEl.style.color = 'green';
          messageEl.textContent = 'Job application added successfully!';
          this.reset();
        } catch (err) {
          const errMsg = err.response?.data?.error || 'Failed to add job application.';
          messageEl.textContent = errMsg;
        }
      };
      reader.readAsDataURL(resumeFile);
    } else {
      await sendRequest(null, null, null);
      messageEl.style.color = 'green';
      messageEl.textContent = 'Job application added successfully!';
      this.reset();
    }
  } catch (error) {
    const errMsg = error.response?.data?.error || 'Failed to add job application.';
    messageEl.textContent = errMsg;
  }
});