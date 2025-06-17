// server/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
const uri = process.env.ATLAS_URI;
// The deprecated options have been removed from the line below
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});

// --- Simple Authentication Middleware ---
// This middleware will protect our admin routes
// In your .env file, add: ADMIN_PASSWORD=your_super_secret_password
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return res.status(401).json('Unauthorized: Access is denied');
    }
    next();
};


// --- Mongoose Schemas ---

// About Schema (for the "intro about me")
const aboutSchema = new mongoose.Schema({
    content: { type: String, required: true }
});
const About = mongoose.model('About', aboutSchema);

// Experience Schema
const experienceSchema = new mongoose.Schema({
  role: { type: String, required: true },
  company: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, required: true },
});
const Experience = mongoose.model('Experience', experienceSchema);

// Certificate Schema
const certificateSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
});
const Certificate = mongoose.model('Certificate', certificateSchema);

// Project Schema
const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    githubLink: { type: String },
    demoLink: { type: String },
});
const Project = mongoose.model('Project', projectSchema);

// Skill Schema
const skillSchema = new mongoose.Schema({
    name: { type: String, required: true },
    iconClass: { type: String, required: true } // e.g., "devicon-javascript-plain"
});
const Skill = mongoose.model('Skill', skillSchema);

// Badge Schema
const badgeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }
});
const Badge = mongoose.model('Badge', badgeSchema);

// CV Schema
const cvSchema = new mongoose.Schema({
    fileUrl: { type: String, required: true }
});
const CV = mongoose.model('CV', cvSchema);


// --- Generic CRUD Factory ---
// To avoid repetitive code, we can use a factory to create CRUD routes
const createCrudRoutes = (model, modelName) => {
    const router = express.Router();

    // GET all
    router.get('/', async (req, res) => {
        try {
            const items = await model.find();
            res.json(items);
        } catch (err) {
            res.status(400).json(`Error getting ${modelName}s: ` + err);
        }
    });

    // POST new (Protected)
    router.post('/', authMiddleware, async (req, res) => {
        const newItem = new model(req.body);
        try {
            await newItem.save();
            res.json(`${modelName} added!`);
        } catch (err) {
            res.status(400).json(`Error adding ${modelName}: ` + err);
        }
    });

    // PUT update (Protected)
    router.put('/:id', authMiddleware, async (req, res) => {
        try {
            const updatedItem = await model.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!updatedItem) return res.status(404).json(`${modelName} not found.`);
            res.json(`${modelName} updated!`);
        } catch (err) {
            res.status(400).json(`Error updating ${modelName}: ` + err);
        }
    });

    // DELETE (Protected)
    router.delete('/:id', authMiddleware, async (req, res) => {
        try {
            const deletedItem = await model.findByIdAndDelete(req.params.id);
            if (!deletedItem) return res.status(404).json(`${modelName} not found.`);
            res.json(`${modelName} deleted.`);
        } catch (err) {
            res.status(400).json(`Error deleting ${modelName}: ` + err);
        }
    });

    return router;
};


// --- API Routes ---
app.use('/api/about', createCrudRoutes(About, 'About'));
app.use('/api/experience', createCrudRoutes(Experience, 'Experience'));
app.use('/api/certificates', createCrudRoutes(Certificate, 'Certificate'));
app.use('/api/projects', createCrudRoutes(Project, 'Project'));
app.use('/api/skills', createCrudRoutes(Skill, 'Skill'));
app.use('/api/badges', createCrudRoutes(Badge, 'Badge'));
app.use('/api/cv', createCrudRoutes(CV, 'CV'));

// Special route for login (to keep it simple)
app.post('/api/login', (req, res) => {
    const { password } = req.body;
    if (password === process.env.ADMIN_PASSWORD) {
        // In a real app, you'd return a JWT token.
        // For this simple case, we'll just confirm the password is correct.
        res.json({ success: true, message: 'Login successful' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});


// --- Server Listener ---
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
