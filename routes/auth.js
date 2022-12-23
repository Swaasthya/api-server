const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');

router.get('/', (req, res) => {
  res.send("HELLO");
});

router.post('/signup', (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    // code 422 - server has understood the request but couldn't process the same
    return res.status(422).json({ error: "Please add all the fields" });
  }
  // res.json({ message: "Successfully Posted" });

  User.findOne({ email: email })
    .then((savedUser) => {
      if (savedUser) {
        return res.status(422).json({ error: "User with that email already exists." });
      }

      bcrypt.hash(password, 16)
        .then((hashedPassword) => {
          const user = new User({
            name: name, // if key and value are both same then we can condense it to just name, email, etc.
            email: email,
            password: hashedPassword
          });

          user.save()
            .then((user) => {
              res.json({ message: "User Created Successfully!" });
            })
            .catch((err) => {
              console.log(`Error saving user - ${err}`);
            })
        });
    })
    .catch((err) => {
      console.log(`Error in email findOne - ${err}`);
    });
});

router.post('/signin', (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(422).json({ error: "Please enter email or password" });
  }

  User.findOne({ email: email })
    .then((savedUser) => {
      if (!savedUser) {
        return res.status(422).json({ error: "Invalid email or password" });
      }
      bcrypt.compare(password, savedUser.password)
        .then((doMatch) => { // doMatch is a boolean value
          if (doMatch) {
            // res.json({ message: "Successfully Signed In" });
            const { _id, name, email } = savedUser
            const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET);
            res.json({ token: token, user: {_id, name, email} });
          }
          else {
            return res.status(422).json({ error: "Invalid email or password" });
          }
        })
        .catch((err) => {
          console.log(err);
        })
    })
})

module.exports = router;