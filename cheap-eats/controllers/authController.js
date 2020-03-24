const passport = require('passport');

// can authenicate w social media and replace first arg w i.e. facebook
exports.logInAuth = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Could not log in',
    successRedirect: '/',
    successFlash: 'You\'re in!'
});

exports.logOut = (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out.');
    res.redirect('/')
};

exports.isLoggedIn = (req, res, next) => {
    // use passport method
    if(req.isAuthenticated()) {
        next();
    }
    req.flash('error', 'Log in to add a place');
    res.redirect('/login');
}