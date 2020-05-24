const express = require("express");
const router = express.Router();
const isEmail = require('validator/lib/isEmail');
const normalizeEmail = require('validator/lib/normalizeEmail');
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");

const auth = require("../../middleware/auth");
const ContestModel = require("../../models/Contest");
const User = require("../../models/User");

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post("/register", function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!isEmail(normalizedEmail)) throw new Error('The email you entered is invalid');
    if (!password || !name) throw new Error('Missing field(s)');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (password !== password2) throw new Error('Passwords do not match');
    User.findOne({ email }).then(user => {
      if (user) {
        return res.status(400).json({ message: "Email already exists" });
      } 
      else {
        const newUser = new User({
          name,
          email,
          email_normalized: normalizedEmail,
          password
        });
    
        // Hash password before saving in database
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                jwt.sign(
                  { id: user.id },
                  config.get('jwtSecret'),
                  { expiresIn: 3600 },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      message: 'Registration success',
                      token,
                      user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    });
                  }
                )
              })
              .catch(err => console.log(err));
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

// @route   GET api/user/contests/
// @desc    Get all contests owned by a user
// @access  Public
router.get("/contests", (req, res) => {
  const { user_id } = req.query;

  ContestModel.find({ user_id })
    .sort({ deadline_date: -1 })
    .then((contests) => res.json({ contests }))
    .catch((err) => {
      res.status(500).json({
        message: err.message,
      });
    });
});

module.exports = router;