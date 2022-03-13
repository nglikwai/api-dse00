const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to DSE00!');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/register');
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', "Goodbye!");
    res.redirect('/');
}

module.exports.loadUser = async(req, res) => {
    const user = await User.findById(req.params.id).populate('reviews').populate('posts');
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/');
    }
    console.log(user);
    res.render('users/user', { user });
}

module.exports.updateUser = async(req, res, next) => {
    if (!req.user) {
        return next()
    }
    const user = req.user;
    const a = user.grade;
    if (user.coin > 1200) { user.grade = '5**' } else if (user.coin > 500) { user.grade = '5*' } else if (user.coin > 250) { user.grade = 5 } else if (user.coin > 100) { user.grade = 4 } else if (user.coin > 36) { user.grade = 3 } else if (user.coin > 10) { user.grade = 2 } else if (user.coin > 0) { user.grade = 1 };
    user.save();
    const b = user.grade;
    if (a !== b) {
        req.flash('success', `恭喜你，升到 Lv. ${b} 了！`)
    }
    console.log(user)
    next();
}