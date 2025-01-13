const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 3000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "githubtask";

// Middleware
app.use(express.json());
app.use(cors());
let db, issues;

// Connect to MongoDB and initialize collections repositories
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        issues = db.collection("issues");

        // Start server after successful DB connection
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
        process.exit(1); // Exit if database connection fails
    }
}

// Initialize Database
initializeDatabase();

// Routes

// GET: List all issues
// app.get('/issues', async (req, res) => {
//     try {
//         const allissues = await issues.find().toArray();
//         res.status(200).json(allissues);
//     } catch (err) {
//         res.status(500).send("Error fetching issues: " + err.message);
//     }
// });

// Get list by issues issueId 
app.get('/issues/:issueId', async (req, res) => {
    try {
        // Extract issueId from request parameters
        const issueId = req.params.issueId;

        // Find a single issue by its ID
        const issue = await issues.findOne({ issueId });

        if (!issue) {
            return res.status(404).send("Issue not found");
        }

        res.status(200).json(issue);
    } catch (err) {
        res.status(500).send("Error fetching issue: " + err.message);
    }
});


// POST: Add a new issues
app.post('/issues', async (req, res) => {
    try {
        const newissues = req.body;
        const result = await issues.insertOne(newissues);
        res.status(201).send(`issues added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding issues: " + err.message);
    }
});

// PUT: Update a issues completely issueId
app.put('/issues/:issueId', async (req, res) => {
    try {
        const issueId = parseInt(req.params.issueId);
        const updatedissues = req.body;
        const result = await issues.replaceOne({ issueId }, updatedissues);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating issues: " + err.message);
    }
});

// PATCH: Partially update a issues
app.patch('/issues/:issueId', async (req, res) => {
    try {
        const issueId =( req.params.issueId); 
        const updates = req.body; 

        const result = await issues.updateOne({ issueId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating issues: " + err.message);
    }
});

// DELETE: Remove a issues issueId
app.delete('/issues/:issueId', async (req, res) => {
    try {
        const issueId = (req.params.issueId);
        const result = await issues.deleteOne({ issueId});
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting issues: " + err.message);
    }
});