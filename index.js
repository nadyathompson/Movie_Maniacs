const express = require('express');
    morgan = require('morgan');
    fs = require('fs');
    path = require('path');

const app = express();

app.use(morgan('common'));

app.use(express.static('public'));

let topMovies = [
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

app.get('/', (req, res) => {
    res.send('Welcome to Movie Maniacs!')
});

app.get('/movies', (req, res) => {
    res.json(topMovies)
});

/*app.get('/documentation', (req, res) => {

});*/

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong :(')
});

app.listen(8080, () => {
    console.log('Your app is listening on port 8080.')
});