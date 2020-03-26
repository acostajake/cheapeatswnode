const crypto = require('crypto');
const mongoose = require('mongoose');
const passport = require('passport');
const promisify = require('es6-promisify');

const sendEmail = require('../handlers/sendmail');
const User = mongoose.model('User');

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
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Log in required');
    res.redirect('/login');
};

exports.forgotPassword = async (req, res) => {
    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if(!user) {
        req.flash('error', 'No account found with that email.')
        return res.redirect('/login');
    }
   
    // if user set token and timeout
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 3600000
    await user.save();
    
    // send email with token and link
    const resetUrl = `http://${req.headers.host}.account/reset/${user.resetPasswordToken}`
    await sendEmail.sendResetPasswordEmail({
        user,
        subject: 'Password Reset',
        resetUrl,
        filename: 'password-reset'
    })
    req.flash('success', 'Check your email! :D')
    
    // redirect
    res.redirect('/login')
};

exports.resetPassword = async (req, res) => {
    // Look for user by token on link, and use mongoose method gt for greater than now
    const user = await User.find({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user) {
        req.flash('error', 'Reset failed or timout expired.');
        return res.redirect('/login');
    }
    // if user found complete process
    res.render('reset', { title: 'Reset password' });
};

exports.checkPasswords = (req, res, next) => {
    if(req.body.password === req.body['password-confirm']) {
        return next();
    }
    req.flash('error', 'Passwrords do not match');
    res.redirect('back')
};

exports.updatePasswords = async (req, res) => {
    const user = await User.find({ 
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    });
    if(!user) {
        req.flash('error', 'Reset failed or timout expired.');
        return res.redirect('/login');
    }
    // plugin method, uses callback
    const setPasswords =  promisify(user.setPassword, user);
    await setPassword(req.body.password);

    // set vals to undefined to clear from db
    user.resetPasswordExpires = undefined;
    user.resetPasswordToken = undefined;
    const updatedUser = await user.save();

    // passport can autoLogin user
    await req.login(updatedUser);
    
    req.flash('success', 'Booya! Password reset successfully');
    res.redirect('/')
};