const express = require("express");
const router = express.Router();

const isEmail = require('validator/lib/isEmail');
const normalizeEmail = require('validator/lib/normalizeEmail');
const bcrypt = require('bcryptjs');

router.get("/", function(req, res, next) {
  res.status(200).send({ message: "Test Register" });
});

router.post("/", function(req, res, next) {
  const { name, email, password, password2 } = req.body;
  try {
    const normalizedEmail = normalizeEmail(email);
    if (!isEmail(normalizedEmail)) throw new Error('The email you entered is invalid');
    if (!password || !name) throw new Error('Missing field(s)');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');
    if (password !== password2) throw new Error('Passwords do not match');
    //if ((req.db.collection('users').countDocuments({ email })) > 0) throw new Error('The email has already been used.');
    const hashedPassword = bcrypt.hash(password, 10);
    const date = new Date();
    // const user = req.db
    //   .collection('users')
    //   .insertOne({ name, email, email_normalized: normalizedEmail, password: hashedPassword, date })
    //   .then(({ ops }) => ops[0]);
    req.logIn(user, (err) => {
      if (err) throw err;

      res.status(201).json({
        message: 'Signed up successfully',
      });
    });
  } catch (err) {
    res.status(400).json({
      message: err.toString(),
    });
  }
});

module.exports = router;
