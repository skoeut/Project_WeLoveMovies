const service = require("./movies.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function movieExists(req, res, next) {
    const {movieId} = req.params
    const movie = await service.read(movieId)
    if(movie) {
        res.locals.movie = movie
        return next()
    }
    return next({status: 404, message: 'Cannot find movie'})
}

function read(req, res) {
  res.json({data: res.locals.movie})
}

async function readTheaters(req, res) {
  const {movieId} = req.params
  const data = await service.readTheaters(movieId)
  res.json({data})
}

async function readReviews(req, res) {
  const {movieId} = req.params
  const data = await service.readReviews(movieId)
  res.json({data})
}

async function list(req, res){
    const {is_showing} = req.query
    if (is_showing) {
        const data = await service.listIsShowing()
        res.json({data})
    } else {
        const data = await service.list()
        res.json({data})
    }
}

module.exports = {
    readReviews: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readReviews)], 
    readTheaters: [asyncErrorBoundary(movieExists), asyncErrorBoundary(readTheaters)],
    read: [asyncErrorBoundary(movieExists), read],
    list
}