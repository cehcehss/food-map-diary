var express = require('express');
var router = express.Router();
const passport = require('passport')
const { isAuthenticated } = require('../middlewares/auth')
const validation = require('../express-validator')
var postController = require('../controllers/posts')
/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

// router.get('/', isAuthenticated, groupController.getViewAllGroup)
// router.get('/', postController.getAllPosts)
// 顯示新增貼文頁面
router.get('/new', postController.getNewPostPage)
// 送出一則新貼文
router.post('/new', postController.postNewPost)

module.exports = router;
