import { React, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

import { Helmet } from 'react-helmet'

import './movie.css'

const GET_MOVIE = gql`
  query Movie($id: ID!) {
    movies(where:{
      movieId: $id
    }) {
      title,
      poster,
      genres{
        name
      },
      runtime
      imdbRating,
      languages,
      plot,
      actors{
        name
      },
      similar{
        movieId,
        title,
        poster
      }
	   }
}
`;


const Movie = () => {
  const [movie, setMovie] = useState(null)
  const [recommendedMovies, setRecommendedMovies] = useState(null)
  const [movieId, setMovieId] = useState(window.location.pathname.substring(1+window.location.pathname.lastIndexOf('/')))
  const { loading, error, data } = useQuery(GET_MOVIE, {
    variables: { id: movieId}
  })

  useEffect(() => {
    if (data) {
      setMovie(data.movies[0])
      setRecommendedMovies(data.movies[0].similar)
    }
    console.log("id trenutnog filma ",movieId)
  }, [data, movieId])

  const changeId = (id) => {
    setMovieId(id)
  }

  if (loading) return 'Loading...'
  if (error) return <pre>{error.message}</pre>
  return (
    <div className="movie-container">
      <Helmet>
        <title>Movie - Movie recommendation app</title>
        <meta property="og:title" content="Movie - Movie booking app" />
      </Helmet>
      <div className="movie-header">
        <nav data-role="Header" className="movie-logo-and-menu">
          <div className="movie-container1">
          <Link to={'/'}>
            <h1 className="movies-logo">
              Movie recommendation app
              <span
                dangerouslySetInnerHTML={{
                  __html: ' ',
                }}
              />
            </h1>
            </Link>
          </div>
        </nav>
      </div>
      {movie && (
        <div key={movie.movieId} className="movie-film-prikaz">
          <div className="movie-podaci-o-filmu">
            <div className="movie-slika-i-naziv">
              <h1 className="movie-naziv-filma">{movie.title}</h1>
              <img alt="image" src={movie.poster} className="movie-slika" />
            </div>
            <div className="movie-ostale-informacije">
              <span className="movie-trajanje">
                <span>Duration: {movie.runtime} minutes</span>
                <span className="movie-text07"></span>
              </span>
              <span className="movie-jezik">
                <span>Languages: {movie.languages.join(',')}</span>
              </span>
              <span className="movie-jezik">
                <span>Actors: {[movie.actors[0].name,movie.actors[1].name].join(', ')}</span>
              </span>
              <span className="movie-trajanje">
                <span>Imdb rating: {movie.imdbRating}/10</span>
              </span>
              <span className="movie-jezik">Genres:</span>
                  <div className="movie-generes" style={{width:movie.genres.length*100+'px'}}>
                    {movie.genres && movie.genres.map((genre) =>(
                    <button key={genre} className='genre-button'>
                      <span>{genre.name}</span>
                    </button> ))}
                  </div>
              <span className="movie-opis">
                <span>
                  Movie plot:
                  <span
                    dangerouslySetInnerHTML={{
                      __html: ' ',
                    }}
                  />
                </span>
                <span>{movie.plot}</span>
              </span>
              </div>
            </div>
          </div>
      )}
      <div className="movie-preporuceni">
        <div className="movie-container2">
          <span className="movie-text15">Recommended movies</span>
        </div>
        <div className="movie-filmovi">
          {recommendedMovies &&
            recommendedMovies.map((recommendedMovie) => (
              <div key={recommendedMovie.movieId} className="movies-film3">
                <Link onClick={()=>(changeId(recommendedMovie.movieId))} to={'/movie/' + recommendedMovie.movieId}>
                  <img alt="image" src={recommendedMovie.poster} className="movies-image" />
                </Link>
                <div className="movies-container2">
                  <span className="movies-text16">{recommendedMovie.title}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Movie
