var express = require('express');
var router = express.Router();
const passport = require('passport')
const { isAuthenticated } = require('../middlewares/auth')
const validation = require('../express-validator')
var postController = require('../controllers/posts')
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/new', isAuthenticated, postController.getNewPostPage)
router.post('/new', isAuthenticated, postController.postNewPost)

module.exports = router;
