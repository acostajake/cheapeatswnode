const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

exports.logInUser = (req, res) => {
    res.render('login', { title: 'Login' })
};

exports.signup = (req, res) => {
    res.render('signup', { title: 'Sign up' })
};

exports.validateSignup = (req, res, next) => {
    // From expressValidator imported in root, handle errs gracefully
    req.sanitizeBody('name');
    req.check('name', 'Add your name').notEmpty();
    req.checkBody('email', 'Thant email is not valid').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false,
        icloud_remove_subaddress: false,
        outlookdotcom_remove_subaddress: false,
        yahoo_remove_subaddress: false
    });
    req.checkBody('password', 'You need a password').notEmpty();
    req.checkBody('confirm-password', 'Confirm your password').notEmpty();
    req.checkBody('confirm-password', 'Your passwords do not match.').equals(req.body.password);

    const errors = req.validationErrors();
    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('signup', { title: 'Sign up', body: req.body, flashes: req.flash()  })
        return;
    }
    // All good, push to db
    next();
};

exports.addUserToDB = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name })
    // create promise and use register method on passportjs
    const registerUser = promisify(User.register, User);
    await registerUser(user, req.body.password);
    next();
};

exports.viewAccount = (req, res) => {
    res.render('account', { title: 'Update account' })
};

exports.updateAccount = async (req, res) => {
    const changes = {
        name: req.body.name,
        email: req.body.email
    };
    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true , runValidators: true, context: 'query' }
    );
    req.flash('success', 'Account updated!')
    res.redirect('back');
}