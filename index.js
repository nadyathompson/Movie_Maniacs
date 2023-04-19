const express = require('express');
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');
    bodyParser = require('body-parser');
    uuid = require('uuid');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

app.use(bodyParser.json());

let users = [
    {
        id: 1,
        name: "Jane",
        favoriteMovies: []
    },
    {
        id: 2,
        name: "John",
        favoriteMovies: []
    }
]

let movies = [
    {
        title: 'Everything Everywhere All at Once',
        genre: ['Action', 'Adventure', 'Comedy'],
        director: ['Daniel Kwan', 'Daniel Scheinert']
    },
    {
        title: 'CODA',
        genre: ['Comedy', 'Drama'],
        director: 'Sian Heder'
    },
    {
        title: 'Nomadland',
        genre: 'Drama',
        director: 'Chloe Zhao'
    },
    {
        title: 'Parasite',
        genre: ['Drama', 'Thriller'],
        director: 'Bong Joon Ho'
    },
    {
        title: 'Green Book',
        genre: ['Biography', 'Comedy', 'Drama'],
        director: 'Peter Farrelly'
    },
    {
        title: 'The Shape of Water',
        genre: ['Drama', 'Fantasy', 'Romance'],
        director: 'Guillermo del Toro'
    },
    {
        title: 'Moonlight',
        genre: 'Drama',
        director: 'Barry Jenkins'
    },
    {
        title: 'Spotlight',
        genre: ['Biography', 'Crime', 'Drama'],
        director: 'Tom McCarthy'
    },
    {
        title: 'Birdman',
        genre: ['Comedy', 'Drama'],
        director: 'Alejandro G Inarritu'
    },
    {
        title: '12 Years a Slave',
        genre: ['Biography', 'Drama', 'History'],
        director: 'Steve McQueen'
    },
];

//add user
app.post('/users', (req, res) => {
    const newUser = req.body;
    if (newUser.name) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser)
    } else {
        res.status(400).send('User needs name')
    }
});

//update user info
app.put('/users/:id', (req, res) => {
    const {id} = req.params;
    const updatedUser = req.body;

    let user = users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        res.status(200).json(user)
    } else {
        res.status(400).send('User not found')
    }
});

//add movies
app.post('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to user ${id}'s favorites`);
    } else {
        res.status(400).send('User not found')
    }
});

//delete movies
app.delete('/users/:id/:movieTitle', (req, res) => {
    const {id, movieTitle} = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        user.favoriteMovies = user.favoriteMovies.filter(title => title !== movieTitle);
        res.status(200).send(`${movieTitle} has been removed from user ${id}'s favorites`);
    } else {
        res.status(400).send('User not found')
    }
});

//delete user
app.delete('/users/:id', (req, res) => {
    const {id} = req.params;

    let user = users.find(user => user.id == id);

    if (user) {
        users = users.filter(user => user.id == id);
        res.status(200).send(`User ${id} has been deleted`);
    } else {
        res.status(400).send('User not found')
    }
});

//homepage
app.get('/', (req, res) => {
    res.send('Welcome to Movie Maniacs!')
});

//get movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies)
});

//get specific movies
app.get('/movies/:title', (req, res) => {
     const {title} = req.params;
     const movie = movies.find(movie => movie.title === title);

     if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('Cannot find movie')
    } 
});

// get genre
app.get('/movies/genre/:genreName', (req, res) => {
    const {genreName} = req.params;
    const genre = movies.find( movie => movie.genre === genreName).genre;
  
    if (genre) {
      res.status(201).json(genre);
    } else {
      res.status(400).send('Genre not found')
    } 
  });
  
// get director 
app.get('/movies/directors/:directorName', (req, res) => {
    const {directorName} = req.params;
    const director = movies.find(movie => movie.director === directorName).director;
  
    if (director) {
      res.status(200).json(director);
    } else {
      res.status(400).send('Director not found')
    } 
  });
  
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong :(')
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.')
});