import express from 'express';
import dotenv from 'dotenv';
import user from './models/user.js';

const app = express();

// Load environment variables from .env file
dotenv.config();

// Get the PORT from env or default to 5000
const PORT = process.env.PORT || 5000;

//😁😁😁😁 Middleware for reading JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//😁😁😁😁 Middleware example
app.use((req, res, next) => {
    console.log(`Middleware: ${req.method} ${req.url}`);
    next(); // Pass control to the next middleware or route
});


//😁😁😁😁 Routes
app.get('/', (req, res) => {
    res.send('Route created');
});

// Create a user (POST /create)
app.post("/create-user", async (req, res) => {
    try {
        const { name, email } = req.body;
        const userData = await user.create({ name, email });
        res.status(201).send({ message: "User created", user: userData });
    } catch (error) {
        res.status(400).send({ message: "Error creating user", error: error.message });
    }
});

// Read all users (GET /users)
app.get("/users", async (req, res) => {
    try {
        const users = await user.find();
        res.status(200).send(users);
    } catch (error) {
        res.status(500).send({ message: "Error fetching users", error: error.message });
    }
});

// Update a user (PUT /update/:id)
app.put("/update/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;
        const updatedUser = await user.findByIdAndUpdate(
            id,
            { name, email },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User updated", user: updatedUser });
    } catch (error) {
        res.status(400).send({ message: "Error updating user", error: error.message });
    }
});

// Delete a user (DELETE /delete/:id)
app.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await user.findByIdAndDelete(id);
        if (!deletedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({ message: "User deleted", user: deletedUser });
    } catch (error) {
        res.status(500).send({ message: "Error deleting user", error: error.message });
    }
});

//😁😁😁😁😁😁😁😁 Start the server
app.listen(PORT, () => {
    console.log(`${PORT} port is running`);
});
