const express = require('express');
const mongoose = require('mongoose');
const port = process.env.PORT || 5000;

const app = express();
app.get('/', (req, res) => {
    res.send("Hello Again Ivan")
})
app.listen(port, () => {
    console.log(`Listenning port ${port}`)
})