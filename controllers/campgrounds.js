const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
    console.time('main')
    console.timeEnd('main')
    res.render("campgrounds/index");
};





module.exports.index = async (req, res) => {
    console.time('main')
    const limit = req.query.limit || 150;
    const page = req.query.page || 1;
    const category = req.query.category || ['吹水', 'DSE', '大學', '消息'];
    const options = {
        sort: { updatedAt: -1 },
        populate: [{
            path: 'author',
            select: 'username'
        }, "reviews"],
        limit,
        page,
    };
    const data = await Campground.paginate({ category }, options)

    const campgrounds = data.docs;
    console.timeEnd('main')
    res.json(campgrounds);
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    if (req.user) {
        campground.author = req.user._id;
        const user = await User.findById(req.user._id);
        user.posts.push(campground);
        user.coin += 5;
        await user.save();
    }
    await campground.save();
    res.json({ status: 'success', post: campground });
};

module.exports.createCampgroundForIframe = async (req, res, next) => {
    const campground = new Campground(req.body.campground);
    campground.images = req.files.map((f) => ({
        url: f.path,
        filename: f.filename,
    }));
    if (req.user) {
        campground.author = req.user._id;
        const user = await User.findById(req.user._id);
        user.posts.push(campground);
        user.coin += 5;
        await user.save();
    }
    await campground.save();
    req.flash("success", "成功建立POST");
    res.redirect(`/iframe`);
};

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
                select: 'username grade level'
            },
        })
        .populate({
            path: "author",
            select: 'username grade level'
        });
    if (!campground) {
        req.flash("error", "Cannot find that POST!");
        return res.redirect("/");
    }
    res.json(campground);
};

module.exports.showIframeCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    if (!campground) {
        req.flash("error", "Cannot find that POST!");
        return res.redirect("/");
    }
    res.render("campgrounds/showIframe", { campground });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash("error", "收不到POST");
        return res.redirect("/");
    }
    res.render("campgrounds/edit", { campground });
};

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground
    });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash("success", "成功更新");
    res.redirect(`/${campground._id}`);
};

module.exports.updateIframeCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, {
        ...req.body.campground,
    });
    const imgs = req.files.map((f) => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    req.flash("success", "成功更新");
    res.redirect(`/iframe/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    user.coin -= 5;
    await user.save();
    await Campground.findByIdAndDelete(id);
    req.flash("success", "成功刪除");
    res.redirect("/");
};

module.exports.deleteIframeCampground = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    user.coin -= 5;
    await user.save();
    await Campground.findByIdAndDelete(id);
    req.flash("success", "成功刪除");
    res.redirect("/iframe");
};

module.exports.reply = async (req, res) => {
    const { id } = req.params;
    const campgroundid = req.query.post;
    const campground = await Campground.findById(campgroundid);
    campground.popular += 1;
    const review = await Review.findById(id);
    review.reply.push(req.body.review.reply)
    if (!req.user) {
        review.replyAuthor.push('DSEJJ')
    } else {
        req.user.coin += 3;
        await req.user.save();
        review.replyAuthor.push(req.user.username)
    }

    await review.save();
    await campground.save();
    req.flash('success', ' 🪙 + 3');
    res.redirect(`/${campgroundid}`)
}

module.exports.renderReply = async (req, res) => {
    const { id } = req.params;
    const campgroundid = req.query.post;
    const replyReview = await Review.findById(id).populate('author');
    const campground = await Campground.findById(campgroundid)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");

    res.render("campgrounds/show", { campground, replyReview })
}



// module.exports.index = async (req, res) => {
//     console.time('main')
//     const id = req.user ? req.user._id : '622874ccc8ed254d82edf591';
//     const limit = req.query.limit || 150;
//     const page = req.query.page || 1;
//     const category = req.query.category || ['吹水', 'DSE', '大學', '消息'];
//     const options = {
//         sort: { updatedAt: -1 },
//         populate: ["author", "reviews"],
//         limit,
//         page,
//     };
//     let friendList = ['622874ccc8ed254d82edf591', '62249a88f2e44a001678e0ef', '62246de9a1b279001669c648'];
//     if (req.user) { friendList = req.user.friendList; }


//     const [user, data, reviews] = await Promise.all([
//         User.findById(id).populate("friendList"),
//         Campground.paginate({ category }, options),
//         Review.find({ "author": friendList }).sort({ updatedAt: -1 }).limit(7).populate("author")
//     ])

//     const campgrounds = data.docs;
//     console.timeEnd('main')
//     res.render("campgrounds/index", { campgrounds, user, reviews });
// };
