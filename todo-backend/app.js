const { Client } = require('pg');

// Create a new PostgreSQL client
const client = new Client({
    host: 'localhost', // Replace with your host
    port: 5432,        // Default PostgreSQL port
    user: 'postgres', // Replace with your database username
    password: 'iambatman@123', // Replace with your database password
    database: 'todo' // Replace with your database name
});

// Connect to the database
client.connect()
    .then(() => {
        console.log('Connected to PostgreSQL database!');
        return client.query('SELECT NOW()'); // Example query to get current timestamp
    })
    .then(result => {
        console.log('Current time:', result.rows[0]);
    })
    .catch(err => {
        console.error('Connection error', err.stack);
    })
    .finally(() => {
        client.end(); // Close the connection
    });
