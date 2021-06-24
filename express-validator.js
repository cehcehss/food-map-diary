const { body } = require('express-validator')
module.exports = {
  newPost: [
    // validate name field
    body('title')
      .isLength({ min: 1})
      .withMessage('Post title is required'),
    // Number of People
    body('address')
      .isLength({ min: 1})
      .withMessage('Address is required')
  ],

  registerUser: [
    // body('Fname')
    //   .isLength({ min: 1, max: 10 })
    //   .withMessage('First Name is required, max 10 letters'),
    // body('Lname')
    //   .isLength({ min: 1, max: 10 })
    //   .withMessage('Last Name is required, max 10 letters'),
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