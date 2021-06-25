const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator')

// Include user model
const db = require('../models')
const User = db.Account
const Post = db.Post
const Tag = db.Tag
const Post_Tag = db.Post_Tag;
const { QueryTypes } = require('sequelize');

module.exports = {
  getLogin: (req, res) => {
    res.render('login', { userCSS: true, formValidation: true })
  },
  getRegister: (req, res) => {
    res.render('register', { userCSS: true, formValidation: true })
  },
  postRegister: (req, res) => {
    const { username, password, password_confirm,email,firstName,lastName,birth,gender} = req.body    // retrieve error message from req
    const errors = validationResult(req)
    // validation failed
    if (!errors.isEmpty()) {
      console.log(errors.array());
      return res.status(422).render('register', {
        userCSS: true,
        formValidation: true,
        warnings: errors.array(),
        registerData: { username, password, password_confirm,email,firstName,lastName,birth,gender}
      })
    }
    // validation passed
    User.findOne({ where: { username: username }})
      .then(async (user) => {
        if (user) {
          // var msg = "The username already exists";
          return res.render('register');
        } else {
          try {
            //create hashed password
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)

            // create new user
            const newUser = new User({
              username,
              password: hash,
              email,
              gender,
              isAdmin:0,
              firstName,
              lastName,
              birth
            })
            newUser
              .save()
              .then(user => res.redirect('/users/login'))
              .catch(err => console.log(err))
          } catch (error) {
            console.log(error)
          }
        }
      })
  },
  getLogout: (req, res) => {
    req.logout()
    req.flash('success', 'Log out successfully, see you next time :)')
    res.redirect('/')
  },
  getMemberPage:(req,res) =>{
    res.render('member-page');
  },
  getMemberData:(req,res)=>{
    // if(req.user.id != req.params.id) return res.status(400);
    let uid = req.user.id;
    const asyncFindUserPosts = async()=>{
      let  posts = await db.sequelize.query(`SELECT *, DATE_FORMAT(Posts.createdAt, '%Y-%m-%d %H:%i') AS createdAtFormat FROM Posts WHERE authorId = ${uid}`, { type: QueryTypes.SELECT })
      return posts;
    }
    const asyncGetTags = async()=>{
      let tags = await db.sequelize.query(`SELECT postId, tagId, tagName FROM Post_Tags, Posts, Tags 
                                              Where Posts.authorId = ${uid}
                                              AND Posts.id = Post_Tags.postId 
                                              AND Tags.id = Post_Tags.tagId;`, { type: QueryTypes.SELECT })
      return tags;
  }
    Promise.all([asyncFindUserPosts(),asyncGetTags()]).then(values => {
      let posts = values[0];

      let tags = values[1];
      var tagDict = {};
      tags.forEach(function(v){
          if(tagDict[v.postId]!== undefined){
              tagDict[v.postId].push(v.tagName);
          }else{
              tagDict[v.postId] = [];
              tagDict[v.postId].push(v.tagName);
          }
      })
      posts.forEach(function(post){
          if(tagDict[post.id]!=undefined){
            post['tags'] = tagDict[post.id];
        }
      })
      res.json({posts:posts});
    });
  }
}
