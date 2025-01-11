const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 1000;

// MongoDB connection details
const uri = "mongodb://127.0.0.1:27017"; 
const dbName = "githubtask";

// Middleware
app.use(express.json());
app.use(cors());
let db, users;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        users = db.collection("users");

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
// app.get('/users', async (req, res) => {
//     try {
//         const allusers = await users.find().toArray();
//         res.status(200).json(allusers);
//     } catch (err) {
//         res.status(500).send("Error fetching users: " + err.message);
//     }
// });

// GET: List one  users
app.get('/users/:userId', async (req, res) => {
    try {
        
        const oneUser = await users.findOne(); 

        if (!oneUser) {
            return res.status(404).send("User not found");
        }

        res.status(200).json(oneUser);
    } catch (err) {
        // Handle errors and send a failure response
        res.status(500).send("Error fetching user: " + err.message);
    }
});


// POST: Add a new users
app.post('/users', async (req, res) => {
    try {
        const newusers = req.body;
        const result = await users.insertOne(newusers);
        res.status(201).send(`users added with ID: ${result.insertedId}`);
    } catch (err) {
        res.status(500).send("Error adding users: " + err.message);
    }
});

// PUT: Update a student completely
app.put('/students/:rollNumber', async (req, res) => {
    try {
        const rollNumber = parseInt(req.params.rollNumber);
        const updatedStudent = req.body;
        const result = await students.replaceOne({ rollNumber }, updatedStudent);
        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error updating student: " + err.message);
    }
});

// PATCH: Partially update a student
// app.patch('/students/:rollNumber', async (req, res) => {
//     try {
//         const rollNumber = parseInt(req.params.rollNumber);
//         const updates = req.body;
//         const result = await students.updateOne({ rollNumber }, { $set: updates });
//         res.status(200).send(`${result.modifiedCount} document(s) updated`);
//     } catch (err) {
//         res.status(500).send("Error partially updating student: " + err.message);
//     }
// });
// PATCH USERS students
app.patch('/users/:userId', async (req, res) => {
    try {
        const userId = req.params.userId; 
        const updates = req.body; 

        // Update one document in the "users" collection based on userId
        const result = await users.updateOne({ userId }, { $set: updates });

        if (result.modifiedCount === 0) {
            return res.status(404).send("No user found to update");
        }

        res.status(200).send(`${result.modifiedCount} document(s) updated`);
    } catch (err) {
        res.status(500).send("Error partially updating user: " + err.message);
    }
});


// DELETE: Remove a student
// app.delete('/users/:userId', async (req, res) => {
//     try {
//         const userId = (req.params.userId);
//         const result = await users.deleteOne({ userId });
//         res.status(200).send(`${result.deletedCount} document(s) deleted`);
//     } catch (err) {
//         res.status(500).send("Error deleting users: " + err.message);
//     }
// });


// Delete the userid 
app.delete('/users/:userId', async (req, res) => {
    try {
        // Extract userId from the request parameters
        const userId = req.params.userId;

        const result = await users.deleteOne({ userId });

        if (result.deletedCount === 0) {
            return res.status(404).send("No user found with the specified ID to delete");
        }

        res.status(200).send(`${result.deletedCount} document(s) deleted`);
    } catch (err) {
        res.status(500).send("Error deleting user: " + err.message);
    }
});
