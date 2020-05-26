const express = require("express");
const router = express.Router();
const isEmail = require('validator/lib/isEmail');
const normalizeEmail = require('validator/lib/normalizeEmail');
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const auth = require('../../middleware/auth');

const User = require("../../models/User");

// @route   POST api/auth
// @desc    Auth user
// @access  Public
router.post("/", function(req, res, next) {
  const { email, password } = req.body;
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!isEmail(normalizedEmail)) throw new Error('The email you entered is invalid');
    if (!password || !email) throw new Error('Missing field(s)');
    User.findOne({ email }).then(user => {
      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      } 
      
      // Validate password
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

          jwt.sign(
            { id: user.id },
            config.get('jwtSecret'),
            { expiresIn: 86400 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                message: "Successfully signed in",
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email,
                  profile_image_url: user.profile_image_url
                }
              });
            }
          )
        })
    });
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

// @route   GET api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, (req, res) => {
  const { user } = req;
  User.findById(user.id)
    .select('-password')
    .select('-email_normalized')
    .then(user => res.json(user));
});

module.exports = router;