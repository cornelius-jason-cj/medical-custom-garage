const User = require('../models/user');
const passport = require('passport');


exports.getUsers = function(req, res) {
  User.find({})
    .exec((errors, users) => {
      if(errors) {
        return res.status(422).send({errors});
      }

      return res.json(users);
    })
}

exports.getCurrentUser = function (req, res, next) {
  const user = req.body;

  if(!user) {
    return res.sendStatus(422);
  }

  return res.json(user);
}

exports.userRegister = function(req, res) {

  if (!req.body.username) {
    return res.status(422).json({
      errors: {
        username: 'is required'
      }
    })
  }

  if (!req.body.password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  const data = new User({
    username: req.body.username,
    password: req.body.password
  })

  data.save((err) => {
    if (err) return console.error(err);

    return res.status(201).send('Create Success');
  })

}

exports.userLogin = function(req, res, next) {
  
  const { username, password } = req.body
  if (!username) {
    return res.status(422).json({
      errors: {
        username: 'is required'
      }
    })
  }

  if (!password) {
    return res.status(422).json({
      errors: {
        password: 'is required'
      }
    })
  }

  return passport.authenticate('local', (err, passportUser) => {
    if (err) {
      return next(err)
    }

    if (passportUser) {
      req.login(passportUser, function (err) {
        if (err) { next(err); }

        return res.json(passportUser)
      })
    }else {
      return res.status(422).send({errors: {
        'authentication': 'Ooopps, something went wrong!'
      }})
    }
  })(req, res, next)
}

exports.userLogout = function(req, res) {
  req.logout()
  return res.json({status: 'Session destroyed'})
}