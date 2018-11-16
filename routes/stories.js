const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Story = mongoose.model('stories');
const User = mongoose.model('users');
const { ensureAuthenticated, ensureGuest } = require('../helpers/auth');


/// Stories index
router.get('/', (req, res) => {
    Story.find({ status: 'public' })
        .populate('user')
        .then(stories => {
            res.render("stories/index", { stories: stories })
        })

});

/// Add Story Form
router.get('/add', ensureAuthenticated, (req, res) => {
    res.render("stories/add")
});

/// Show Story
router.get('/show/:id', (req, res) => {
    Story.findOne({
        _id: req.params.id
    })
        .populate('user')
        .then(story => {
            res.render('stories/show', {
                story: story
            })
        })
})

/// Process Add Story
router.post('/', (req, res) => {

    let allowComments;

    if (req.body.allowComments) {
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title: req.body.title,
        body: req.body.body,
        status: req.body.status,
        allowComments: allowComments,
        user: req.user.id
    }

    // Create New Story
    new Story(newStory)
        .save()
        .then(story => {
            res.redirect(`/stories/show/${story.id}`)
        })
})

module.exports = router;