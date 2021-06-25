const { body } = require('express-validator')
const db = require('./models')
const User = db.Account
module.exports = {
  newPost: [
    body('title')
      .isLength({ min: 1})
      .withMessage('Post title is required'),
    body('address')
      .isLength({ min: 1})
      .withMessage('Address is required')
  ],

  registerUser: [
    body('username').custom(value => {
      return User.findOne({ where: { username: value }}).then(user => {
        if (user) {
          throw new Error('The username already exists')
        }
        return true
      });
    }),
    body('email')
      .isEmail()
      .withMessage('Please provide a valid email'),
    body('password')
      .custom(value => {
        const regex = /^\S{8,12}$/
        const result = value.match(regex)
        if (!result) {
          throw new Error('Password length must be between 8-12')
        }
        return true
      }),
    body('password_confirm')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password does not matched')
        }
        return true
      })
  ]
}