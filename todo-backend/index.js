// index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const client = require('./config/db');

const app = express();
const PORT = process.env.PORT || 4000;
const bcrypt = require('bcrypt');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// CRUD Operations for To-Do List

app.post('/login', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the user exists
        const userQuery = 'SELECT * FROM users WHERE email = $1 AND username = $2';
        const result = await client.query(userQuery, [email, username]);

        if (result.rows.length == 0) {
            return res.status(401).json({ success: false, message: 'User not found' });
        }

        const user = result.rows[0];

        // Directly compare passwords
        if (password !== user.password) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }

        // Return success response with user ID
        res.json({ success: true, message: 'Login successful', userId: user.id });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});



// Fetch todos for a specific user
app.get('/todos/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await client.query('SELECT * FROM todos WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching todos:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new todo
app.post('/todos', async (req, res) => {
    const { userId, task } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO todos (user_id, title, completed) VALUES ($1, $2, $3) RETURNING *',
            [userId, task, false] // Set completed to false by default
        );
        res.json(result.rows[0]); // Return the newly created todo
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


// Update the completed status of a todo
app.put('/todos/:user_id/:todo_id', async (req, res) => {
    const user_id = req.params.user_id;
    const todo_id = req.params.todo_id;
    const { completed } = req.body; // Get the completed status from the request body

    try {
        const result = await client.query(
            'UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 RETURNING *',
            [completed, todo_id, user_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        // Send the updated todo as a response
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Delete a todo
app.delete('/todos/:todoId', async (req, res) => {
    const { todoId } = req.params;

    try {
        const result = await client.query('DELETE FROM todos WHERE id = $1 RETURNING *', [todoId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Todo not found' });
        }

        res.json({ message: 'Todo deleted successfully', todo: result.rows[0] });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Register endpoint
app.post('/register', async (req, res) => {
    const { email, username, password } = req.body;

    try {
        // Check if the user already exists
        const userCheckQuery = 'SELECT * FROM users WHERE email = $1 OR username = $2';
        const existingUser = await client.query(userCheckQuery, [email, username]);

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        // Insert new user into the database
        const insertUserQuery = 'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id';
        const result = await client.query(insertUserQuery, [email, username, password]);
        
        res.status(201).json({ success: true, userId: result.rows[0].id });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Fetch notes for a specific user
app.get('/notes/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await client.query('SELECT * FROM notes WHERE user_id = $1', [userId]);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching notes:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add a new note
app.post('/notes', async (req, res) => {
    const { userId, title, content } = req.body;

    try {
        const result = await client.query(
            'INSERT INTO notes (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
            [userId, title, content]
        );
        res.status(201).json(result.rows[0]); // Return the newly created note
    } catch (error) {
        console.error('Error adding note:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.delete('/notes/:id', async (req, res) => {
    const { id } = req.params; // Get the note ID from the URL
  
    try {
      const result = await client.query('DELETE FROM notes WHERE id = $1', [id]);
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: 'Note not found' });
      }
  
      res.status(200).json({ message: 'Note deleted successfully' });
    } catch (error) {
      console.error('Error deleting note:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
