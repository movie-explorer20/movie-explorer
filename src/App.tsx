import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import HeroMovie from './components/HeroMovie/HeroMovie'
import TrendingMovies from './components/TrendingMovies/TrendingMovies'
import RecentlyViewed from './components/RecentlyViewed/RecentlyViewed'

import MovieDetails from './components/MovieDetails/MovieDetails'
import SearchMovies from './components/SearchMovies/SearchMovies'
import Movies from './components/Movies/Movies'
import Genres from './components/Genres/Genres'
import Watchlist from './components/Watchlist/Watchlist'
import Favorites from './components/Favorites/Favorites'

import Login from './components/Login/Login'
import Register from './components/Register/Register'

import './App.css'

function Home() {
  return (
    <>
      <HeroMovie />
      <TrendingMovies />
      <RecentlyViewed />
    </>
  )
}

function App() {
  return (
    <BrowserRouter basename="/movie-explorer">
      <div className="app">

        <Navbar />

        <Routes>

          <Route path="/" element={<Home />} />

          <Route path="/movies" element={<Movies />} />

          <Route path="/genres" element={<Genres />} />

          <Route path="/watchlist" element={<Watchlist />} />

          <Route path="/favorites" element={<Favorites />} />

          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />

          <Route
            path="/search"
            element={<SearchMovies />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

        </Routes>

      </div>
    </BrowserRouter>
  )
}

export default App