const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const skillsRoutes = require('./routes/skillsRoutes');
const goalRoutes = require('./routes/goalRoutes');


dotenv.config();

const app = express();
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Serve views
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'views', 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, 'views', 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(__dirname, 'views', 'dashboard.html')));

// Routes
app.use('/auth', authRoutes);
app.use('/skills', skillsRoutes);
app.get('/skills', (req, res) => res.sendFile(path.join(__dirname, 'views', 'skills.html')));
app.get('/my-skills', (req, res) => res.sendFile(path.join(__dirname, 'views', 'my-skills.html')));
app.use('/goals', goalRoutes);
app.use('/skills', skillsRoutes);
app.use((req, res) => {
    res.status(404).send('Page not found');
  });
  
const PORT = process.env.PORT || 5000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`)))
    .catch(err => console.error('Database connection error:', err));
