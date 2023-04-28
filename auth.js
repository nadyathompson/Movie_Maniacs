const jwtSecret = 'your_jwt_secret';

const jwt = require('jsonwebtoken'), 
    passport = require('passport');
    express = require('express');

require('./passport');

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, //username to encode
        expiresIn: '7d', //token expires in 7 days
        algorithm: 'HS256' //algorithm used to encode
    });
}

//post login endpoint
module.exports = (router) => {
    router.post('/login', (req, res) => {
       passport.authenticate('local', {session: false}, (error, user, info) => 
       {
        if(error || !user) {
            return res.status(400).json({
                message: 'Something is not right.',
                user: user
            });
        }
        req.login(user, {session: false}, (error) => {
            if(error) {
                res.send(error);
            }
            let token = generateJWTToken(user.toJSON());
            return res.json({user, token});
        });
       }) (req, res);
    });
}