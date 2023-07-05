import { React, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, gql } from '@apollo/client'

import { Helmet } from 'react-helmet'

import './movies.css'

const Movies = () => {

  const [allMovies, setAllMovies] = useState(null)
  const [requestedMovies, setRequestedMovies] = useState(null)
  const [genre, setGenre] = useState("all")
  const [firstIndex, setFirstIndex] = useState(0)
  const [lastIndex, setLastIndex] = useState(4)
  const { data, loading, error } = useQuery(gql`
    {
      movies(
        options:{
          limit: 256
        }
        where:{
          languages_INCLUDES : "English"
          year_GT : 2000
          title_NOT_CONTAINS : "The"
        })
      {
        movieId,
        title,
        poster,
        genres{
          name
        }
      }
    }
  `)

  useEffect(() => {
    if (data) {
      setAllMovies(data.movies)
      if (genre == "all"){
        setRequestedMovies(data.movies)
      } else{
        setRequestedMovies(allMovies.filter(movie => movie.genres.map(genre => genre.name).includes(genre)))
      }
    }

    console.log(genre)
  }, [data, genre])

  const changeGenre = (newGenre) => {
    setGenre(newGenre)
  }

  const nextMovies = () => {
    if(requestedMovies.length>firstIndex+4){
      setFirstIndex(firstIndex+4)
      setLastIndex(lastIndex+4)
    }else{
      setFirstIndex(0)
      setLastIndex(4)
    }
  }

  const previousMovies = () => {
    if(firstIndex-4>-1){
      setFirstIndex(firstIndex-4)
      setLastIndex(lastIndex-4)
    }else{
      setLastIndex(requestedMovies.length%4===0 ? requestedMovies.length : requestedMovies.length+4-requestedMovies.length%4)
      setFirstIndex(requestedMovies.length%4===0 ? requestedMovies.length-4 : requestedMovies.length-requestedMovies.length%4)
    }
  }

  if (loading) return 'Loading...'
  if (error) return <pre>{error.message}</pre>

  return (
    <div className="movies-container">
      <Helmet>
        <title>Movies - Movie recommendation app</title>
        <meta property="og:title" content="Movies - Movie booking app" />
      </Helmet>
      <div className="movies-header">
        <nav data-role="Header" className="movies-logo-and-menu">
          <div className="movies-container1">
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
      <div className="movies-zanrovi">
        <Link onClick={()=>(changeGenre("all"))} className="movies-svi">
          <span>Svi filmovi</span>
        </Link>
        <Link onClick={()=>(changeGenre("Action"))} className="movies-akcioni">
          <span>Akcija</span>
        </Link>
        <Link onClick={()=>(changeGenre("Thriller"))} className="movies-triler">
          <span>Triler</span>
        </Link>
        <Link onClick={()=>(changeGenre("Mystery"))} className="movies-misterija">
          <span>Misterija</span>
        </Link>
        <Link onClick={()=>(changeGenre("Comedy"))} className="movies-komedija">
          Komedija
        </Link>
        <Link onClick={()=>(changeGenre("Drama"))} className="movies-drama">
          <span>Drama</span>
        </Link>
        <Link onClick={()=>(changeGenre("Horror"))} className="movies-horor">
          <span>Horor</span>
        </Link>
        <Link onClick={()=>(changeGenre("Romance"))} className="movies-romanticni">
          <span>Romanticni</span>
        </Link>
        <Link onClick={()=>(changeGenre("Crime"))} className="movies-kriminalisticki">
          <span>Kriminalisticki</span>
        </Link>
        <Link onClick={()=>(changeGenre("Fantasy"))} className="movies-dokumentarni">
          <span>Fantazija</span>
        </Link>
        <Link onClick={()=>(changeGenre("Sci-Fi"))} className="movies-porodicni">
          <span>Sci-Fi</span>
        </Link>
      </div>
      <div className="movies-filmovi">
        {requestedMovies &&
          requestedMovies.slice(firstIndex, lastIndex).map((movie) => (
            <div key={movie.movieId} className="movies-film3">
              <Link to={'/movie/' + movie.movieId}>
                <img alt="image" src={movie.poster} className="movies-image" />
              </Link>
              <div className="movies-container2">
                <span className="movies-text16">{movie.title}</span>
              </div>
            </div>
          ))}
      </div>
      <img
        alt="image"
        src="/playground_assets/arrow_right.png"
        className="movies-sljedece"
        onClick={() => nextMovies()}
      />
      <img
        alt="image"
        src="/playground_assets/arrow_left.png"
        className="movies-prethodno"
        onClick={() => previousMovies()}
      />
    </div>
  )
}

export default Movies
