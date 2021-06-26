var express = require('express');
var router = express.Router();
const passport = require('passport')
const { isAuthenticated } = require('../middlewares/auth')
const validation = require('../express-validator')
var postController = require('../controllers/posts')
router.get('/', function(req, res) {
  res.send('respond with a resource');
});
// 新增頁面
router.get('/new', isAuthenticated, postController.getNewPostPage)
router.post('/new', isAuthenticated, postController.postNewPost)
// 搜尋tag
router.get('/tag/:tag', postController.getPostsByTag)
//編輯頁面
router.get('/edit-page/:postId', postController.getEditPage)
router.get('/edit/:postId', postController.getEditData)
router.post('/edit/:postId', postController.UpdateData)
//刪除
router.delete('/delete/:postId',postController.deleteData);

module.exports = router;
