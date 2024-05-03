// Create web server 
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Get the port from the environment, i.e., Heroku sets it
const port = process.env.PORT || 3000;

// Use the public directory for the web server
app.use(express.static('public'));
app.use(bodyParser.json());

// Load the comments data
let comments = require('./comments.json');

// Save the comments to the file
function saveComments() {
    fs.writeFile('comments.json', JSON.stringify(comments, null, 2), (err) => {
        if (err) {
            console.log('Error writing file:', err);
        }
    });
}

// Get the comments
app.get('/comments', (req, res) => {
    res.json(comments);
});

// Add a comment
app.post('/comments', (req, res) => {
    const comment = req.body;
    comments.push(comment);
    saveComments();
    res.json(comment);
});

// Delete a comment
app.delete('/comments/:id', (req, res) => {
    const id = req.params.id;
    comments = comments.filter(comment => comment.id !== id);
    saveComments();
    res.end();
});

// Start the server
app.listen(port, () => {
    console.log('Server is running on port', port);
});