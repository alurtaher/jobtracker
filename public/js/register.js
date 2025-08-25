document
  .getElementById("registerForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const messageEl = document.getElementById("message");
    const careerGoals = document.getElementById("careerGoals").value;

    messageEl.style.color = "red";
    messageEl.textContent = "";

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        {
          name,
          email,
          password,
          careerGoals,
        }
      );
      if (response) {
        messageEl.style.color = "green";
        messageEl.textContent = "Registration successful! Please login.";

        // Delay redirect by 2 seconds to allow user to see message
        setTimeout(() => {
          window.location.href = "/views/login.html"; // Adjust path as needed
        }, 1000);
      }
      this.reset();
    } catch (error) {
      const errMsg = error.response?.data?.error || "Registration failed";
      messageEl.textContent = errMsg;
    }
  });
