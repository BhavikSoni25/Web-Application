const express = require('express');

const { check, body } = require('express-validator/check'); 

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');


router.get('/login', authController.getLogin);

router.post('/login', authController.postLogin);

router.post('/logout', 
[body('email')
.isEmail()
.withMessage('The E-mail is invalid')
.normalizeEmail(), //this is to sanitize
body('password', 'Enter only alphabets and numbers and atleast 5 characters')
.isLength({min: 5})
.isAlphanumeric()
.trim() 
], 
authController.postLogout);

router.get('/signup', authController.getSignup);

router.post('/signup', 
[
check('email')
.isEmail()
.withMessage('Invalid E-mail')
.custom((value, {req}) => {
    // if (value === 'test@test.com') {
    //     throw new Error('this email is forbidden');
    // }
    // return true;
    return User.findOne({email: value}) 
    .then(userDoc => {
        if(userDoc) {
            Promise.reject('E-mail already exists. Please pick a different one'); 
        }
    });
})
.normalizeEmail(), 
body('password', 'Enter only alphabets and numbers and atleast 5 characters') 
.isLength({min: 5})
.isAlphanumeric()
.trim(),
body('confirmPassword')
.trim()
.custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
    }
    return true;
})
],
authController.postSignup); 

router.get('/reset', authController.getReset);

router.post('/reset', authController.postReset);

router.get('/reset/:token', authController.getNewPassword); 

router.post('/new-password', authController.postNewPassword);


module.exports = router;