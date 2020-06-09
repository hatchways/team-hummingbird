const express = require("express");
const router = express.Router();
const isEmail = require("validator/lib/isEmail");
const normalizeEmail = require("validator/lib/normalizeEmail");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const STRIPE_KEY = require("../../config/default.json").stripeKey;
const STRIPE_SECRET = require("../../config/default.json").stripe_secret;
const stripe = require("stripe")(STRIPE_SECRET);

const auth = require("../../middleware/auth");
const Contest = require("../../models/Contest");
const Submission = require("../../models/submission");
const User = require("../../models/User");

const createStripeCustomer = async () => {
  //create Stripe customer
  const customer = await stripe.customers.create();
  //use customer id to create a future payment intent
  const customer_id = customer["id"];
  const intent = await stripe.setupIntents.create({
    customer: customer_id,
  });
  console.log(intent);
  return intent;
};

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", async function (req, res, next) {
  const { name, email, password, password2 } = req.body;
  const stripeCustomer = await createStripeCustomer();
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!isEmail(normalizedEmail))
      throw new Error("The email you entered is invalid");
    if (!password || !name) throw new Error("Missing field(s)");
    if (password.length < 6)
      throw new Error("Password must be at least 6 characters");
    if (password !== password2) throw new Error("Passwords do not match");
    User.findOne({ email }).then((user) => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      } else {
        const newUser = new User({
          name,
          email,
          email_normalized: normalizedEmail,
          password,
          stripe_customer_id: stripeCustomer.customer,
          stripe_client_secret: stripeCustomer.client_secret,
        });

        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                jwt.sign(
                  { id: user.id },
                  config.get("jwtSecret"),
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      message: "Registration success",
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                      },
                    });
                  }
                );
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

// @route   PUT api/users/
// @desc    Update a user profile
// @access  Private
router.put("/", auth, (req, res) => {
  const { user_id, url, payment } = req.body;
  let updateQuery = {};
  if (payment) {
    updateQuery = {
      hasPayment: true,
      payment,
    };
  } else {
    updateQuery = {
      profile_image_url: url,
    };
  }
  if (user_id === req.user.id) {
    User.findByIdAndUpdate(req.user.id, updateQuery, (err, result) => {
      if (err) {
        res.status(500).json({
          message: err.message,
        });
      }
      res.json({
        message: "Profile updated successfully",
      });
    });
  } else {
    res.status(401).json({
      message: "Unauthorized to update this profile",
    });
  }
});

// @route   GET api/user/:id
// @desc    Get a user's name by their ID.
// @access  Public
router.get("/name/:id", (req, res) => {
  const user_id = req.params.id;
  User.findById(user_id)
    .select("name")
    .then((user) => res.json(user))
    .catch((err) => res.status(404));
});

// @route   GET api/user/contests/
// @desc    Get all contests owned by a user
// @access  Public
router.get("/contests", (req, res) => {
  const { user_id } = req.query;

  Contest.find({ user_id })
    .sort({ deadline_date: -1 })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// @route   GET api/users/submissions/
// @desc    Get all contests that a user submitted to
// @access  Private
router.get("/submissions", auth, (req, res) => {
  const { user_id } = req.query;
  let result = {};

  Submission.find({ user_id })
    .then((submissions) => {
      let contestIds = [];
      submissions.forEach((submission) =>
        contestIds.push(submission.contest_id)
      );
      result.submissions = submissions;
      Contest.find({
        _id: { $in: contestIds },
      })
        .sort({ deadline_date: -1 })
        .then((contests) => {
          result.contests = contests;
          res.json(result);
        })
        .catch((err) => {
          res.status(500).json({
            message: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

// @route   GET api/users/
// @desc    Get users with given name
// @access  Private

router.get("/", auth, (req, res) => {
  const { username } = req.query;
  User.find({
    name: { $regex: new RegExp("^.*" + username.toLowerCase() + ".*$", "i") },
    _id: { $ne: req.user.id },
  })
    .then((users) => {
      const matchedUser = [];
      users.map((user) => {
        matchedUser.push({
          id: user._id,
          name: user.name,
        });
      });
      res.json({ users: matchedUser });
    })
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;
