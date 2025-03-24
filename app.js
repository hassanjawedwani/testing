const mongoose = require("mongoose");
const express = require("express");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./ExpressError");
const listings = require("./routes/listings");
const reviews = require("./routes/reviews");
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const port = 8080;
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/User.js");
const user = require("./routes/user.js");


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Build in middlewares
app.use(express.static(path.join(__dirname, "./public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const dbURL = process.env.MONGO_CONNECT;



const sessionOptions = {
  store: MongoStore.create({
    mongoUrl: dbURL,
    touchAfter: 24 * 3600,
    encrypt: {
      secret: process.env.SESSION_SECRET
    }
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());

passport.deserializeUser(User.deserializeUser());

app.engine("ejs", ejsMate);

// Database Connection

main()
  .then(() => {
    console.log("Database Connected");
  })
  .catch((err) => {
    console.log("Error Database Connection : ", err);
  });



async function main() {
  await mongoose.connect(dbURL)
}
console.log(process.env.MONGO_CONNECT)

// express routes

// app.get("/", (req, res) => {
//   res.send("Hi i'm root");
// });

app.use((req, res, next) => {
  res.locals.flashMessage = req.flash("flashMessage");
  res.locals.flashErrorMessage = req.flash("flashErrorMessage");
  res.locals.user = req.user;
  res.locals.error = req.flash("error");
  next();
});
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found"));
});

// Error Handling Middlewares

app.use((err, req, res, next) => {
  const { status = 500, message = "Some Error occured " } = err;
  console.log(err);
  res.status(status).render("error.ejs", { message });
});

// express server startup

app.listen(port, () => {
  console.log("Server connection established at port: ", port);
});
