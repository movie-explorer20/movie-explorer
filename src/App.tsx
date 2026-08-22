import {
  HashRouter,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'

import Navbar from './components/Navbar/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

import HeroMovie from './components/HeroMovie/HeroMovie'
import TrendingMovies from './components/TrendingMovies/TrendingMovies'
import MovieDetails from './components/MovieDetails/MovieDetails'

import SearchMovies from './components/SearchMovies/SearchMovies'
import Movies from './components/Movies/Movies'
import Genres from './components/Genres/Genres'
import Watchlist from './components/Watchlist/Watchlist'
import Favorites from './components/Favorites/Favorites'

import Login from './components/Login/Login'
import Register from './components/Register/Register'

function Home() {
  return (
    <>
      <HeroMovie />
      <TrendingMovies />
    </>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          {/* HOME */}

          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
          />

          {/* MOVIES */}

          <Route
            path="/movies"
            element={
              <>
                <Navbar />
                <Movies />
              </>
            }
          />

          {/* GENRES */}

          <Route
            path="/genres"
            element={
              <>
                <Navbar />
                <Genres />
              </>
            }
          />

          {/* WATCHLIST */}

          <Route
            path="/watchlist"
            element={
              <>
                <Navbar />
                <Watchlist />
              </>
            }
          />

          {/* FAVORITES */}

          <Route
            path="/favorites"
            element={
              <>
                <Navbar />
                <Favorites />
              </>
            }
          />

          {/* SEARCH */}

          <Route
            path="/search"
            element={
              <>
                <Navbar />
                <SearchMovies />
              </>
            }
          />

          {/* MOVIE DETAILS */}

          <Route
            path="/movie/:id"
            element={
              <>
                <Navbar />
                <MovieDetails />
              </>
            }
          />

        </Route>

        {/* =================================================
            UNKNOWN ROUTE
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </HashRouter>
  )
}

export default App