exports.onlyAuthUser = function (req, res, next) {
  if (req.body.isAuthenticated) {
    return next()
  }
  
  return res.status(401).send({errors: {auth: 'Not Authenticated!'}})
}