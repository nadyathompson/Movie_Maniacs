const express = require('express');
const passport = require('passport');
    mongoose = require('mongoose');
    Models = require('./models.js');
    Movies = Models.Movie;
    Users = Models.User;
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');
    bodyParser = require('body-parser');
    uuid = require('uuid');
    app = express();

const { check, validationResult } = require('express-validator');
const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
require("./passport");

app.use(morgan('common'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect( process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true });

//add user
app.post('/users', 
    [
    check('Username', 'Username is required').isLength({min: 5}),
    check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail()
    ],
    (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username})
    .then((user) => {
        if(user) {
            return res.status(400).send(req.body.Username + ' already exists.');
        } else {
            Users
                .create({
                    Username: req.body.Username,
                    Password: hashedPassword,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                .then((user) => {res.status(201).json(user)})
            .catch((error) => {
                console.error(error);
                res.status(500).send('Error: ' + error);
            })
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//update user info
app.put('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{$set: {
				Username: req.body.Username,
				Password: req.body.Password,
				Email: req.body.Email,
				Birthday: req.body.Birthday,
			},
		},
		{ new: true }
	)
    .then((user) => {
        if (!user) {
            return res.status(400).send('User not found');
        } else {
            res.json(user);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//add movies to user's favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{$addToSet: { FavoriteMovies: req.params.MovieID },},
		{ new: true }
	)
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(400).send('Error: User was not found');
        } else {
            res.json(updatedUser);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//delete movies from user's favorites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', {session: false}), (req, res) => {
	Users.findOneAndUpdate(
		{ Username: req.params.Username },
		{$pull: { FavoriteMovies: req.params.MovieID },},
		{ new: true }
	)
    .then((updatedUser) => {
        if (!updatedUser) {
            return res.status(400).send('User not found');
        } else {
            res.json(updatedUser);
        }
    })
    .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
    });
});

//delete user
app.delete('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOneAndRemove({Username: req.params.Username})
        .then((user) => {
            if(!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err)
        });
});

//homepage
app.get('/', (req, res) => {
    res.send('Welcome to Movie Maniacs!')
});

//get all movies
app.get('/movies', (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
});

//get specific movies
app.get('/movies/:Title', passport.authenticate('jwt', {session: false}), (req, res) => {
     Movies.findOne({Title: req.params.Title})
        .then((movie) => {
            if (!movie) {
                return res.status(400).send('Error: ' + req.params.Title + ' was not found.');
            } else {
                res.json(movie);
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//get genre by name
app.get('/movies/genres/:genreName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName})
    .then((movie) => {
        if(!movie){
            res.status(400).send(req.params.genreName + ' was not found.');
        } else {
            res.json(movie.Genre);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});

//get all users
app.get('/users', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.find()
        .then((users) => {
            res.status(201).json(users);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

//get a user by username
app.get('/users/:Username', passport.authenticate('jwt', {session: false}), (req, res) => {
    Users.findOne({ Username: req.params.Username })
        .then((user) => {
            res.json(user);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});
  
//get director by name
app.get('/movies/directors/:directorName', passport.authenticate('jwt', {session: false}), (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName})
    .then((movie) => {
        if(!movie){
            res.status(400).send(req.params.directorName + ' was not found.');
        } else {
            res.json(movie.Director);
        }
    })
    .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
    });
});
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong :(')
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});