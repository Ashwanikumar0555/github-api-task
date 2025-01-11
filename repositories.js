const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 2000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "githubtask";

// Middleware
app.use(express.json());
app.use(cors());
let db, repositories;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        repositories = db.collection("repositories");

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

// GET: List all students
// app.get('/repositories/:repoId', async (req, res) => {
//     try {
//         const allrepositories = await repositories.find().toArray();
//         res.status(200).json(allrepositories);
//     } catch (err) {
//         res.status(500).send("Error fetching repositories: " + err.message);
//     }
// });



// Get list by repo id 

app.get('/repositories/:repoId', async (req, res) => {
    try {
        // Extract repoId from request parameters
        const repoId = req.params.repoId;

        // Find a single repository by its ID
        const repository = await repositories.findOne({ repoId });

        // If no repository is found, send a 404 response
        if (!repository) {
            return res.status(404).send("Repository not found");
        }

        // Send the found repository as a response
        res.status(200).json(repository);
    } catch (err) {
        res.status(500).send("Error fetching repository: " + err.message);
    }
});


// POST: Add a new repositories
app.post('/repositories', async (req, res) => {
    try {
        const newrepositories = req.body;
        const result = await repositories.insertOne(newrepositories);
        res.status(201).send(`repositories added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding repositories: " + err.message);
    }
});

// PUT: Update a repositories completely
// app.put('/repositories/:repoId', async (req, res) => {
//     try {
//         const repoId = parseInt(req.params.repoId);
//         const updatedrepositories = req.body;
//         const result = await repositories.replaceOne({ repoId }, updatedrepositories);
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error updating repositories: " + err.message);
//     }
// });

// PUT: Update a repositories completely
app.put('/repositories/:repoId', async (req, res) => {
    try {
        const repoId = req.params.repoId; // Assuming repoId is a string, remove parseInt if it's not numeric.
        const updatedRepository = req.body;

        // Ensure the updatedRepository is not empty
        if (!updatedRepository || Object.keys(updatedRepository).length === 0) {
            return res.status(400).send("Invalid data. Request body is empty.");
        }

        const result = await repositories.replaceOne(
            { repoId: repoId }, // Filter by repoId
            updatedRepository
        );

        if (result.matchedCount === 0) {
            return res.status(404).send("Repository not found.");
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated.`);
    } catch (err) {
        res.status(500).send("Error updating repository: " + err.message);
    }
});

// PATCH: Partially update a student
app.patch('/repositories/:repoId', async (req, res) => {
    try {
        const repoId =( req.params.repoId); 
        const updates = req.body; 

        const result = await repositories.updateOne({ repoId }, { $set: updates });
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating repositories: " + err.message);
    }
});

// DELETE: Remove a student
app.delete('/repositories/:repoId', async (req, res) => {
    try {
        const repoId = (req.params.repoId);
        const result = await repositories.deleteOne({ repoId });
        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting repositories: " + err.message);
    }
});