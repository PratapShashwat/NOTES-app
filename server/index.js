require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// --- MODELS ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: String,
    content: String,
    tags: [String]
}, { timestamps: true });
const Note = mongoose.model('Note', NoteSchema);

// --- MIDDLEWARE (The Gatekeeper) ---
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ error: "Access Denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Attaches the user ID to the request
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token" });
    }
};

// --- AUTH ROUTES ---
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

        // Create JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user: { id: user._id, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- CRUD ROUTES (Protected) ---

// 1. GET all notes for the logged-in user
app.get('/notes', authMiddleware, async (req, res) => {
    const notes = await Note.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
});

// 2. CREATE a new note
app.post('/notes', authMiddleware, async (req, res) => {
    const { title, content, tags } = req.body;
    const newNote = new Note({ userId: req.user.id, title, content, tags });
    await newNote.save();
    res.json(newNote);
});

// 3. UPDATE a note
app.put('/notes/:id', authMiddleware, async (req, res) => {
    const { title, content } = req.body;
    // Ensure user owns the note before updating
    const updatedNote = await Note.findOneAndUpdate(
        { _id: req.params.id, userId: req.user.id }, 
        { title, content },
        { new: true }
    );
    res.json(updatedNote);
});

// 4. DELETE a note
app.delete('/notes/:id', authMiddleware, async (req, res) => {
    await Note.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ message: "Note deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));