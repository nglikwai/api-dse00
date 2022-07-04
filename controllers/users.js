const Campground = require('../models/campground');
const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        if (email.length > 40) {
            req.flash('error', 'email too long');
            return res.redirect('/users/register');
        }
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to DSE00!');
            user.coin = 50;
            user.grade = '3';
            user.save()
            res.redirect('/users/intro');
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

module.exports.loadUser = async (req, res) => {
    const user = await User.findById(req.params.id).populate('reviews').populate('posts').populate('favour').populate('friendList');
    if (!user) {
        req.flash('error', 'User not found');
        return res.redirect('/');
    }
    res.render('users/user', { user });
}

module.exports.updateUser = async (req, res, next) => {
    if (!req.user) {
        return next()
    }
    const user = req.user;
    const a = user.grade;
    if (user.coin > 800) {
        user.grade = '5**';
        user.level = 7
    } else if (user.coin > 400) {
        user.grade = '5*';
        user.level = 6
    } else if (user.coin > 200) {
        user.grade = 5;
        user.level = 5
    } else if (user.coin > 100) {
        user.grade = 4;
        user.level = 4
    } else if (user.coin > 36) {
        user.grade = 3;
        user.level = 3
    } else if (user.coin > 10) {
        user.grade = 2;
        user.level = 2
    } else if (user.coin > 0) {
        user.grade = 1;
        user.level = 1
    };
    user.save();

    const b = user.grade;
    if (a !== b) {
        req.flash('success', `恭喜你，升到 Lv. ${b} 了！`)
    }
    next();
}

module.exports.renderForget = (req, res) => {
    res.render('users/forget');
}

module.exports.renderIntro = async (req, res) => {
    const user = await User.findById(req.user._id)
    res.render('users/intro', { user });
}

module.exports.intro = async (req, res) => {
    const { id } = req.params;
    const user = await User.findByIdAndUpdate(id, { ...req.body })
    req.flash('success', `${req.body.intro}`)
    res.redirect('/users/addfriend');
}

module.exports.checkIdEmailMatch = async (req, res) => {
    try {
        const [user] = await User.find({ username: req.body.username })
        if (req.body.email !== user.email) {
            req.flash("error", "Username not match");
            return res.redirect("/users/forget");
        }
        await user.setPassword(req.body.password)
        user.save()
        req.login(user, err => {
            if (err) return next(err);
            req.flash('success', 'Password Changed');
            res.redirect('/');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/users/forget');
    }
}

module.exports.addFavour = async (req, res) => {
    const user = await User.findById(req.user._id);
    const campground = await Campground.findById(req.params.id);
    campground.favour += 1;
    await campground.save();
    user.favour.push(req.params.id)

    await user.save();
    req.flash('success', '♥ Liked')
    res.redirect(`/${req.params.id}`)
}

module.exports.removeFavour = async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    campground.favour -= 1;
    await campground.save();
    const user = await User.findById(req.user._id);
    const index = user.favour.indexOf(req.params.id)
    user.favour.splice(index, 1)
    await user.save();
    req.flash('error', '♡ Unliked')
    res.redirect(`/${req.params.id}`)
}

module.exports.addFriend = async (req, res) => {
    const user = await User.findById(req.user._id);
    const counterUser = await User.findById(req.params.id);
    counterUser.friendList.unshift(req.user._id);
    await counterUser.save();
    user.friendList.unshift(req.params.id)
    await user.save();
    req.flash('success', `${counterUser.username.toUpperCase()} 已成為 Friend`)
    res.redirect(`/users/user/${req.params.id}`)
}

module.exports.removeFriend = async (req, res) => {
    const user = await User.findById(req.user._id);
    const index = user.friendList.indexOf(req.params.id)
    user.friendList.splice(index, 1)
    await user.save();
    const counterUser = await User.findById(req.params.id);
    const counterIndex = counterUser.friendList.indexOf(req.user._id);
    counterUser.friendList.splice(counterIndex, 1)
    await counterUser.save();
    req.flash('error', `已移除 ${counterUser.username.toUpperCase()}`)
    res.redirect(`/users/user/${req.params.id}`)
}

module.exports.renderAddFriend = async (req, res) => {
    const users = await User.find({});
    res.render('users/addFriend', { users })
}


module.exports.addFriendFirst = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.friendList.includes(req.query.friend)) {
        req.flash('success', '已加入好友')
        return res.redirect('/users/addfriend');
    }
    user.friendList.unshift(req.query.friend);
    await user.save();
    const counterUser = await User.findById(req.query.friend);
    counterUser.friendList.unshift(req.user._id);
    await counterUser.save();
    console.log(user.username);
    console.log(counterUser);
    setTimeout(() => {
        res.redirect('/users/addfriend')
    }, 5000)
}

