var express = require('express')
var router = express.Router()
var isAuthenticated = require('../middlewares/isAuthenticated')
var User = require('../db/models/user.js')

router.get('/signup', function(req, res) {
  res.render('signup')
})

router.post('/signup', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  var u = new User({ username: username, password: password, comments: [], 
    following: [], trucks: []})
  u.save(function(err) {
    if (err) {
      next(err)
    }
    if (!err) {
      res.redirect('/account/login')
    }
  })
})

router.get('/login', function(_, res) {
  res.render('login')
})

router.post('/login', function(req, res, next) {
  var username = req.body.username
  var password = req.body.password
  User.findOne({ username: username, password: password }, function(
    err,
    result
  ) {
    if (!err && result != null) {
      req.session.user = username
      res.redirect('/')
    } else {
      next(new Error('invalid credentials'))
    }
  })
})

router.get('/logout', isAuthenticated, function(req, res) {
  req.session.user = ''
  res.redirect('/')
})
module.exports = router
