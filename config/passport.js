const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const express = require('express');
const keys = require('./keys');

// Load users model
const User = mongoose.model('users')

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        // For Heroku not to load HTTPS
        proxy: true
    },
        function (accessToken, refreshToken, profile, done) {
            // console.log(profile)
            const image = profile.photos[0].value.substring(0, profile.photos[0].value.indexOf('?'));
            const newUser = {
                googleID: profile.id,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                email: profile.emails[0].value,
                image: image
            }
            // Check for existing User
            User.findOne({ googleID: profile.id })
                .then(user => {
                    if (user) {
                        // Return user
                        done(null, user)
                    }
                    else {
                        // Create new user
                        new User(newUser).save().then(user => done(null, user))
                    }
                });

        }
    ));
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        User.findById(id).then(user => done(null, user));
    });
}