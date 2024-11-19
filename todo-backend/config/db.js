// config/db.js
const { Client } = require('pg');
require('dotenv').config(); // Load environment variables from .env file

// Create a new PostgreSQL client
const client = new Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database!'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = client;
