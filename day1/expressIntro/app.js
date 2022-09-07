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


app.get('/', (req, res) => {
    const myName = 'Phil Chaplin';
    const today = new Date()
    res.send(myName + " " + today)
})

// movie CRUD

const favoriteMovieList = ['The Matrix', 'The Other Guys', 'The Shawshank Redemption']

// Create

app.post('/new-movie', (req, res) => {
    favoriteMovieList.push(req.body.title)
    res.json(favoriteMovieList)
})

// Read Movies
app.get("/all-movies", (req, res)=> {
    res.json(favoriteMovieList)
})


// Update

app.put("/update-movie/:titleToUpdate", (req, res) => {
    //find movie and update title
    const titleToUpdate = req.params.titleToUpdate
    const newTitle = req.body.newTitle

    const indexOfMovie = favoriteMovieList.indexOf(titleToUpdate)

    if (indexOfMovie < 0) {
        res.json('movie not found')
        return;
    }
    
    favoriteMovieList[indexOfMovie] = newTitle
    res.json({
        success: true
    })
})

// Delete

app.delete("/delete-movie/:titleToDelete", (req, res) => {
    const titleToDelete = req.params.titleToDelete
    const indexOfTitle = favoriteMovieList.indexOf(titleToDelete)
    if (indexOfTitle < 0) {
        res.json('movie not found')
        return;
    }
    favoriteMovieList.splice(indexOfTitle, 1)

    res.json({
        "success": true
    })
})

// app.get('/list-movies', (req, res) => {
//     let movieString = favoriteMovieList.join(',')
//     res.send(movieString)
// })

// app.get('/single-movie/:movieName', (req, res)=>{
//     const foundMovie = favoriteMovieList.find((movie)=> {
//         return movieName === req.params.movieName
//     })
//     if (foundMovie) {
//         res.send(foundMovie)
//     } else {
//         res.send('no movie found')
//     }
// })



// app.get('/add-movie', (req, res) => {
//     let newMovie = req.query.newMovie
//     favoriteMovieList.push(newMovie)
//     console.log(favoriteMovieList)
// })

// USER CRUD

app.post('/save-user-info', (req, res) => {
    const queryParamFirstName = req.body.firstName
    const queryParamLastName = req.body.lastName
    res.send("user Info = Name:" + queryParamFirstName + " " + queryParamLastName)
})

app.get('/show-user-info', (req, res) => {
    res.send()
})


app.listen(port, ()=> {
    console.log('listening on port: ' + port)
})