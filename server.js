const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const jobAppRoutes = require('./routes/applicationRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const companyRoutes = require('./routes/companyRoutes');
const jobListingRoutes = require('./routes/jobListingRoutes');

const reminderNotificationService = require('./services/reminderNotificationService');
reminderNotificationService();

const path = require('path');
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'register.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'views', 'login.html'));
});

app.use(cors());
app.use(bodyParser.json());

app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/job-applications', jobAppRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/job-listings', jobListingRoutes);

const sequelize = require('./config/db');
sequelize.sync({alter:true}).then(() => {
  console.log('Database synced');
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});