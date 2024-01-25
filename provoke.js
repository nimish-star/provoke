const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/your_database_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define User Schema and Model
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
});
const User = mongoose.model('User', userSchema);

// Define Note Schema and Model
const noteSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
});
const Note = mongoose.model('Note', noteSchema);

// Authentication Endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_secret_key', {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Note Endpoints
app.get('/api/notes', async (req, res) => {
});

app.get('/api/notes/:id', async (req, res) => {
});

app.post('/api/notes', async (req, res) => {
});

app.put('/api/notes/:id', async (req, res) => {
});

app.delete('/api/notes/:id', async (req, res) => {
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000`);
});
