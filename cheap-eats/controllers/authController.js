const passport = require('passport');

// can authenicate w social media and replace first arg w i.e. facebook
exports.logIn = passport.authenticate('local', {
    failureRedirect: './login',
    failWithError: 'Could not log in',
    successRedirect: '/',
    successFlash: 'You\'re in!'
});