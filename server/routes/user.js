const express = require('express');
const router = express.Router();


const UserCtrl = require('../controllers/user')
const AuthCtrl = require('../controllers/auth')

router.get('', UserCtrl.getUsers)
router.post('/me', AuthCtrl.onlyAuthUser, UserCtrl.getCurrentUser)
router.post('/login', UserCtrl.userLogin)
router.post('/register', UserCtrl.userRegister)
router.post('/logout', UserCtrl.userLogout)
module.exports = router;