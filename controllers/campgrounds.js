const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");

const { cloudinary } = require("../cloudinary");



module.exports.index = async (req, res) => {
    const limit = req.query.limit || 150;
    const page = req.query.page || 1;
    const display_name = req.query.user
    const { category, date_after } = req.query
    const options = {
        sort: { updatedAt: -1 },
        populate: [{
            path: 'author',
            select: 'username'
        }, "reviews"],
        limit,
        page,
    };
    const filter = {}
    if (category) {
        filter.category = category
    }
    if (display_name) {
        filter.display_name = display_name
    }
    if (date_after) {
        filter.createdAt = { "$gte": new Date(date_after) }
    }
    const data = await Campground.paginate(filter, options)
    const campgrounds = data.docs;
    res.json(campgrounds);
}

module.exports.renderNewForm = (req, res) => {
    res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res, next) => {
    if (req.body.title.length < 11) {
        return res.json({ state: 'error' })
    }
    const campground = new Campground(req.body);

    // if (req.user) {
    //     campground.author = req.user._id;
    //     // const user = await User.findById(req.user._id);
    //     // user.posts.push(campground);
    //     user.coin += 5;
    //     await user.save();
    // }
    await campground.save();
    res.json({ status: 'success', post: campground });
};



module.exports.showCampground = async (req, res) => {

    const options = {
        sort: { updatedAt: -1 },
    };

    const campground = await Campground.findById(req.params.id)
    const data = await Campground.find({ $or: [{ _id: req.params.id }, { _id: campground.post_group || null }, { post_group: campground.post_group || req.params.id }] }).sort('createdAt');
    res.json(data);

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



module.exports.deleteCampground = async (req, res) => {

    const { id } = req.query;
    await Campground.findByIdAndDelete(id);
    if (req.user) {
        const user = await User.findById(req.user._id);
        user.coin -= 5;
        await user.save();
    }
    res.json({ state: 'success' });
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
    if (req.body.reply.length < 1) {
        return res.json({ state: 'error' })
    }
    console.log(req.body)
    const campground = await Campground.findById(req.body.postId);
    campground.popular += 1;
    const review = await Review.findById(req.body.reviewId);
    review.reply.push(req.body.reply)
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
    res.json({ status: 'success', reply })
}

module.exports.addPopular = async (req, res) => {
    const { id } = req.params
    const { popular } = req.query

    const campground = await Campground.findById(id)
    campground.popular += parseInt(popular)
    await campground.save()
    res.json({ status: 'success', campground })
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
