
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import './Navbar.css'

const WATCHLIST_KEY = 'movie-explorer-watchlist'

function Navbar() {
  const location = useLocation()

  const [watchlistCount, setWatchlistCount] =
    useState(0)

  const updateWatchlistCount = () => {
    try {
      const savedMovies = JSON.parse(
        localStorage.getItem(WATCHLIST_KEY) || '[]'
      )

      setWatchlistCount(
        Array.isArray(savedMovies)
          ? savedMovies.length
          : 0
      )
    } catch (error) {
      console.error(
        'Watchlist count error:',
        error
      )

      setWatchlistCount(0)
    }
  }

  useEffect(() => {
    updateWatchlistCount()

    // Other tabs / windows
    window.addEventListener(
      'storage',
      updateWatchlistCount
    )

    // Same tab
    window.addEventListener(
      'watchlistUpdated',
      updateWatchlistCount
    )

    return () => {
      window.removeEventListener(
        'storage',
        updateWatchlistCount
      )

      window.removeEventListener(
        'watchlistUpdated',
        updateWatchlistCount
      )
    }
  }, [])

  const navItems = [
    {
      name: 'Home',
      path: '/',
      icon: '⌂',
    },
    {
      name: 'Movies',
      path: '/movies',
      icon: '🎬',
    },
    {
      name: 'Genres',
      path: '/genres',
      icon: '▦',
    },
    {
      name: 'Watchlist',
      path: '/watchlist',
      icon: '🔖',
    },
    {
      name: 'Favorites',
      path: '/favorites',
      icon: '♥',
    },
  ]

  return (
    <header className="movie-navbar">
      <div className="navbar-shell">

        {/* =================================================
            LOGO
        ================================================= */}

        <Link
          to="/"
          className="movie-logo"
        >
          <span className="logo-icon">
            ▶
          </span>

          <span className="logo-content">
            <strong>MOVIE</strong>
            <small>EXPLORER</small>
          </span>
        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="movie-nav">
          {navItems.map((item) => {
            const isActive =
              location.pathname === item.path

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`nav-item ${
                  isActive ? 'active' : ''
                }`}
              >
                <span className="nav-icon">
                  {item.icon}
                </span>

                <span className="nav-text">
                  {item.name}

                  {/* WATCHLIST COUNT */}
                  {item.name === 'Watchlist' &&
                    watchlistCount > 0 && (
                      <span className="watchlist-count">
                        {watchlistCount}
                      </span>
                    )}
                </span>
              </Link>
            )
          })}
        </nav>

        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="navbar-actions">

          {/* SEARCH */}

          <Link
            to="/search"
            className={`search-link ${
              location.pathname === '/search'
                ? 'active'
                : ''
            }`}
          >
            <span className="search-icon">
              ⌕
            </span>

            <span className="search-text">
              Search
            </span>
          </Link>

          {/* LOGIN */}

          <Link
            to="/login"
            className={`login-nav-btn ${
              location.pathname === '/login'
                ? 'active'
                : ''
            }`}
          >
            <span className="login-nav-icon">
              ◉
            </span>

            <span>
              Login
            </span>
          </Link>

        </div>

      </div>
    </header>
  )
}

export default Navbar

