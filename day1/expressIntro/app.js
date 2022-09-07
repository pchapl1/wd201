const express = require('express')
const bodyParser = require('body-parser')
const { response } = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const port = 3000


let globalFirstName = null
let globalLastName = null
const favoriteMovieList = ['The Matrix', 'The Other Guys', 'The Shawshank Redemption']

app.get('/', (req, res) => {
    const myName = 'Phil Chaplin';
    const today = new Date()
    res.send(myName + " " + today)
})

app.get('/list-movies', (req, res) => {
    let movieString = favoriteMovieList.join(',')
    res.send(movieString)
})

app.get('/single-movie/:movieName', (req, res)=>{
    const foundMovie = favoriteMovieList.find((movie)=> {
        return movieName === req.params.movieName
    })
    if (foundMovie) {
        res.send(foundMovie)
    } else {
        res.send('no movie found')
    }
})

app.post('/save-user-info', (req, res) => {
    const queryParamFirstName = req.body.firstName
    const queryParamLastName = req.body.lastName
    res.send("user Info = Name:" + queryParamFirstName + " " + queryParamLastName)
})

app.get('/show-user-info', (req, res) => {
    res.send()
})

app.get('/add-movie', (req, res) => {
    let newMovie = req.query.newMovie
    favoriteMovieList.push(newMovie)
    console.log(favoriteMovieList)
})

app.listen(port, ()=> {
    console.log('listening on port: ' + port)
})