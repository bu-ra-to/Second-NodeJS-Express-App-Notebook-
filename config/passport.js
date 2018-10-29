const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const express = require('express');
const keys = require('./keys')

module.exports = function (passport) {
    passport.use(new GoogleStrategy({
        clientID: keys.googleClientID,
        clientSecret: keys.googleClientSecret,
        callbackURL: "/auth/google/callback",
        // For Heroku not to load HTTPS
        proxy: true
    },
        function (accessToken, refreshToken, profile, cb) {
            // User.findOrCreate({ googleId: profile.id }, function (err, user) {
            //   return cb(err, user);
            // });
            console.log(accessToken);
            console.log(profile)
        }
    ));
}