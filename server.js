const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'yourSecretKey';

app.use(bodyParser.json());
app.use(express.static('public')); // For serving static files

mongoose.connect('mongodb://localhost:27017/login_dashboard', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword, email });
        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: 'Invalid username or password' });
        }

        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
        res.json({ success: true, token, username: user.username });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.get('/dashboard', (req, res) => {
    res.send('Welcome to your dashboard');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:3000`);
});
