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
    console.log(req.body);
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
    User.findOne({ where: { username: username } })
      .then(async (user) => {
        if (user) {
          console.log('Username already exists')
          res.render('register', { registerData: { username, password, password_confirm,email,firstName,lastName,birth,gender}})
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
    if(req.user.id != req.params.id) return res.status(400);
    let uid = req.params.id;
    const asyncFindUserPosts = async()=>{
      let  posts = await db.sequelize.query(`SELECT * FROM Posts WHERE authorId = ${uid}`, { type: QueryTypes.SELECT })
      return posts;
    }
    Promise.all([asyncFindUserPosts()]).then(values => {
      let posts = values[0];
      res.json({posts:posts});
    });
  }
}
