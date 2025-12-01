require('dotenv').config();
const express = require('express');

// initialization
const app = express();
const port = process.env.PORT || 5000;

// middlewares

// routes
app.get("/", (req, res) => {
    res.end("server is working")
})
// error middleware

// run server
app.listen(port, (err) => {
    if (err) {
        console.error(`failed to connect to server: ${err}`)
    }
    console.log(`server running on port: ${port}`)
})