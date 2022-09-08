const express = require('express')
const bodyParser = require('body-parser')
// const { response } = require('express')
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
const port = 3000


let globalFirstName = null
let globalLastName = null

// function to check for empty array
const isEmpty = (arr) => {
    return arr.length === 0
}

app.get('/', (req, res) => {
    const myName = 'Phil Chaplin';
    const today = new Date()
    res.send(myName + " " + today)
})

// movie CRUD

const favoriteMovieList = [
    {
        "title" : "Star Wars",
        "starRating" : 1, 
        "isRecommended" : false,
        "createdAt" : new Date(),
        "lastModified" : new Date()
    },
    {
        "title" : "Avengers",
        "starRating" : 4, 
        "isRecommended" : true,
        "createdAt" : new Date(),
        "lastModified" : new Date()
    },
    {
        "title" : "A Good Year",
        "starRating" : 4.5, 
        "isRecommended" : true,
        "createdAt" : new Date(),
        "lastModified" : new Date()
    },
]


// Create

app.post('/new-movie', (req, res) => {
    console.log("POST to /new-movie")

    if (req.body.title === undefined && req.body.title !== "") {
        res.json({
            success : false,
            message : "Title is a required field"
        })
        return;
    }
    if (req.body.starRating === undefined) {
        res.json({
            success : false,
            message : "Star Rating is a required field"
        })
        return;
    }
    if (req.body.isRecommended === undefined) {
        res.json({
            success : false,
            message : "Is Recommended is a required field"
        })
        return;
    }

    const newMovie = {
        "title" : req.body.title,
        "starRating" : req.body.starRating,
        "isRecommended" : req.body.isRecommended,
        "createdAt" : new Date(),
        "lastModified" : new Date()
    }

    favoriteMovieList.push(newMovie)
    res.json(favoriteMovieList)
})

// Read Movies
app.get("/all-movies/:minStarRating?", (req, res)=> {
    console.log("GET to /all-movies")

    // check route params for minStarRating
    if (req.params.minStarRating) {
        console.log('params')

        // initialize filtered movie list
        const filteredMovieList = []

        // filter through favorite movie list looking for movies gte min star rating in params
        favoriteMovieList.filter((movie)=>{

            // push matching filter to filter list
            if (movie.starRating >= req.params.minStarRating) {
                filteredMovieList.push(movie)
            }
   
        })
        
        // check filtered list to see if its empty and return message if it is
        if (isEmpty(filteredMovieList)) {
            res.json({
                success: false,
                message: 'No movies found with that star rating and above'
            });
            return
        }
        res.json({
            success : true,
            filteredMovieList
        })
        return
    }

    // if no route params, return all movies
    else {
        res.json({
            success : true,
            favoriteMovieList
        })
        return
    }
})

app.get("/single-movie/:titleToFind", (req, res)=> {
    // get title from route params
    const movieToFind = req.params.titleToFind
    console.log(movieToFind)

    // find the index of requested movie
    const indexOfMovie = favoriteMovieList.findIndex((movie)=> {
        return movie.title === movieToFind
    })

    // check to see if the requested movie is in the list
    // if it isnt, return error message
    if (indexOfMovie < 0) {
        res.json({
            success: false,    
            message: "Movie not found"
        });
        return;
    }

    // if the movie is found, return the requested movie
    const movie = favoriteMovieList[indexOfMovie]
        res.json({
            success: true,    
            movie
        });
        return;
})


// Update

app.put("/update-movie/:titleToUpdate", (req, res) => {
    console.log("PUT to /update-movie")
    
    //find movie and update title
    const titleToUpdate = req.params.titleToUpdate
    console.log(titleToUpdate)

    // find index of movie to update in array
    const indexOfMovie = favoriteMovieList.findIndex( (movie) => {
        return movie.title === titleToUpdate
    })

    // if movie not found, idx = -1 and return error
    if (indexOfMovie < 0) {
        res.json({
            success: false,
            message: "Movie not found"
        })
        return;
    }

    // set variable of requested movie
    const originalMovie = favoriteMovieList[indexOfMovie]

    // check for starRating from req.body and update starRating
    if (req.body.starRating) {
        originalMovie.starRating = req.body.starRating
    }

    // check for isRecommended from req.body and update isRecommended
    if (req.body.isRecommended) {
        originalMovie.isRecommended = req.body.isRecommended
    }
    
    // check for title from req.body and update title
    if (req.body.title) {
        originalMovie.title = req.body.title
    }

    // create variable for created at
    const targetCreatedAt = favoriteMovieList[indexOfMovie].createdAt
    
    // keep created at the same as original creation.  only needed since no db
    originalMovie.createdAt = targetCreatedAt

    // set lastModified to current date and time
    originalMovie.lastModified = new Date()

    res.json({
        success: true,
        favoriteMovieList
    })
})

// Delete

app.delete("/delete-movie/:titleToDelete", (req, res) => {
    console.log("DELETE to /delete-movie")

    // get movie to delete from route parameter
    const movieToDelete = req.params.titleToDelete

    // find the index of the movie in the movie list
    const indexOfMovie = favoriteMovieList.findIndex( (movie) => {
        return movie.title === movieToDelete
    })

    // check to see if the target movie is in the favorite movie list
    // if not in movie list, return movie not found and return
    if (indexOfMovie < 0) {
        res.json({
            success: false,
            message: "Movie not found"
        })
        return
    }

    // remove the target movie from the movie list
    favoriteMovieList.splice(indexOfMovie, 1)

    // send json response back 
    res.json({
        "success": true,
        favoriteMovieList
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