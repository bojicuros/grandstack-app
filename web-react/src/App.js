import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './style.css'
import Movie from './views/movie'
import Movies from './views/movies'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Movies />} />
        <Route path="/movie/:id" exact element={<Movie />} />
      </Routes>
    </Router>
  )
}
