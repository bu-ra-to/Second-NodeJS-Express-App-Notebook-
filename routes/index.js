const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("../views/index/welcome.handlebars")
});
router.get('/dashboard', (req, res) => {
    res.send("Hello Dashboard")
});

module.exports = router