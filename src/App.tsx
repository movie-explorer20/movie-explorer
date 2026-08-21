
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

/* =====================================================
   HOME PAGE
===================================================== */

function Home() {
  return (
    <>
      <HeroMovie />

      <TrendingMovies />

      <RecentlyViewed />
    </>
  )
}

/* =====================================================
   APP
===================================================== */

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* NAVBAR */}
        <Navbar />

        {/* ROUTES */}
        <Routes>

          {/* HOME */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* MOVIES */}
          <Route
            path="/movies"
            element={<Movies />}
          />

          {/* GENRES */}
          <Route
            path="/genres"
            element={<Genres />}
          />

          {/* WATCHLIST */}
          <Route
            path="/watchlist"
            element={<Watchlist />}
          />

          {/* FAVORITES */}
          <Route
            path="/favorites"
            element={<Favorites />}
          />

          {/* MOVIE DETAILS */}
          <Route
            path="/movie/:id"
            element={<MovieDetails />}
          />

          {/* SEARCH */}
          <Route
            path="/search"
            element={<SearchMovies />}
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={<Login />}
          />

          {/* REGISTER */}
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

