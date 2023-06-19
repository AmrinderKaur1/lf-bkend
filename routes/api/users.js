// authentictaion 

const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs'); // in order to encrpyt the pssword
const jwt = require('jsonwebtoken');

// users modal (db table) 
const User = require('../../modals/Users')

const keys = require('../../config/keys');
const passport = require('passport');

// @route POST api/users/register
// @desc register user
// @access public
router.post('/register', (req, res) => {
    User.findOne({email: req.body.email}).then((user) => {
        // user already exists
        if (user) {
            return res.status(400).json({
                email: 'Email already exists!'
            })
        } else {
            // create new user 
            // add into db 
            const newUser = new User({
                mobileNum: req.body.mobileNum,
                email: req.body.email,
                password: req.body.password,
            })

            bcrypt.genSalt(10, (err, salt) => {
                if (err) throw err;
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw(err);
                    newUser.password = hash;
                    newUser.save().then((user) => res.json(user)).catch((err) => console.log(err))
                })
            })
        }
    })
})


// @route POST api/users/login
// @desc login user  / returning JWT token
// @access public
router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    // find if the email exists in the table User model or not
    User.findOne({email: email})
    .then((user) => {
        if (!user) {
            res.status(404).json({email: 'User not Found'})
        }

        // user exists, check for passwrd
        bcrypt.compare(password, user?.password)
            .then((isMatch) => {
                if (isMatch) {

                    // create jwt payload
                    const jwtPayload = {
                        id: user.id,
                        email: user.email,
                    }

                    jwt.sign(jwtPayload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                        res.json({
                            success: true,
                            token: `Bearer ${token}`,
                        })
                    })
                } else {
                    return res.status(400).json({password: 'Password Incorrect!'})
                }
            })
    })
})

// protected route to test jwt auntentication bearer and all 
// @route GET /current
// @desc return current user -> whoever the token belongs to 
// @access private
router.get("/current", passport.authenticate('jwt', {session: false}), (req, res) => {
    res.json(req.user)
})


module.exports = router;