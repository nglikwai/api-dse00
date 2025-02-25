const User = require("../models/user");
const users = require("./users");
const Token = require("../models/token");
const upgradeCoin = users.updateUser;

module.exports.saveToken = async (req, res) => {
  const token = new Token({ ...req.body });
  await token.save();
  res.json(token);
};

module.exports.seeall = async (req, res) => {
  const users = await User.find({}).populate("posts").populate("reviews");
  res.render("admins/seeall", { users, upgradeCoin });
};

module.exports.activity = async (req, res) => {
  const users = await User.find({})
    .populate("posts")
    .populate("reviews")
    .sort({ updatedAt: 1 });
  res.render("admins/seeall", { users, upgradeCoin });
};

module.exports.setAdmin = async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndUpdate(id, { ...req.body });
  user.save();
  req.flash("success", `successfully set ${req.body.identity.toUpperCase()} `);
  res.redirect(`/users/user/${id}`);
};

module.exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate("reviews").populate("posts");
  if (user.posts.length !== 0 || user.reviews.length !== 0) {
    console.log(user);
    req.flash("error", ` ${user.username} is not an empty user`);
    return res.redirect(`/admins`);
  }

  await User.findByIdAndDelete(id);
  req.flash("error", `${user.username.toUpperCase()} is DELETED`);
  res.redirect("/admins");
};

module.exports.refreshAll = async (req, res) => {
  const users = await User.find();
  for (let user of users) {
    if (user.coin > 1200) {
      user.grade = "5**";
      user.level = 7;
    } else if (user.coin > 500) {
      user.grade = "5*";
      user.level = 6;
    } else if (user.coin > 250) {
      user.grade = 5;
      user.level = 5;
    } else if (user.coin > 100) {
      user.grade = 4;
      user.level = 4;
    } else if (user.coin > 36) {
      user.grade = 3;
      user.level = 3;
    } else if (user.coin > 10) {
      user.grade = 2;
      user.level = 2;
    } else if (user.coin > 0) {
      user.grade = 1;
      user.level = 1;
    }
    user.save();
  }
  res.redirect("/admins");
};
