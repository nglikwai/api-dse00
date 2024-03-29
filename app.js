if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const adminRoutes = require("./routes/admins");
const pastpaperRoutes = require("./routes/pastpapers");
const userRoutes = require("./routes/users");
const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const cutoffRoutes = require("./routes/cutoffs");
const apiRoutes = require("./routes/apis");
const tutorRoutes = require("./routes/tutors");
const jupasRoutes = require("./routes/jupas");
const familyRoutes = require("./routes/familys");

const cors = require("cors");
const bodyParser = require("body-parser")

const MongoDBStore = require("connect-mongo");
const { required } = require("joi");

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/dse00";

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});


const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/files', express.static('images'));
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

app.use(
    mongoSanitize({
        replaceWith: "_",
    })
);

const secret = process.env.SECRET || "thisshouldbeabettersecret!";

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60,
});

store.on("error", function (e) {
    console.log("SESSION STORE ERROR", e);
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.replyReview = 0;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


app.use("/admins", adminRoutes);
app.use("/apis", apiRoutes);
app.use("/posts", campgroundRoutes);
app.use("/tutors", tutorRoutes);
app.use("/cutoffs", cutoffRoutes);
app.use("/users", userRoutes);
app.use("/resources", pastpaperRoutes);
app.use("/jupas", jupasRoutes)
app.get("/", (req, res) => res.render('campgrounds'));
app.use("/reviews", reviewRoutes);
app.use("/familys", familyRoutes);



app.all("*", (req, res, next) => {
    next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).render("error", { err });
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});