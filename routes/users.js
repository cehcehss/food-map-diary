var express = require('express');
var router = express.Router();
const passport = require('passport')
const { isAuthenticated } = require('../middlewares/auth')
const userController = require('../controllers/user')
// Include server-side validation
const validation = require('../express-validator')

// 登入頁面
router.get('/login', userController.getLogin)

// 登入檢查
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login'
}))

// 註冊頁面
router.get('/register', userController.getRegister)

// 註冊檢查
router.post('/register', validation.registerUser, userController.postRegister)

// 登出
router.get('/logout', isAuthenticated, userController.getLogout)

// 我的帳戶頁面
router.get('/user', isAuthenticated, userController.getMemberPage)
router.get('/getMemberData/:id', isAuthenticated, userController.getMemberData)

module.exports = router;
