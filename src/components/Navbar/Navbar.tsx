import {
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  NavLink,
  Link,
  useNavigate,
} from 'react-router-dom'

import './Navbar.css'

const USER_KEY =
  'movie-explorer-user'

const WATCHLIST_KEY =
  'movie-explorer-watchlist'

type StoredUser = {
  name?: string
  email?: string
  loggedIn?: boolean
  loginMethod?: string
  photoURL?: string
}

function Navbar() {
  const navigate = useNavigate()

  const [user, setUser] =
    useState<StoredUser | null>(null)

  const [
    watchlistCount,
    setWatchlistCount,
  ] = useState(0)

  const [
    profileOpen,
    setProfileOpen,
  ] = useState(false)

  const profileRef =
    useRef<HTMLDivElement>(null)

  /* =====================================================
     LOAD USER
  ===================================================== */

  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser =
          localStorage.getItem(USER_KEY)

        if (!savedUser) {
          setUser(null)
          return
        }

        const parsedUser =
          JSON.parse(
            savedUser
          ) as StoredUser

        if (
          parsedUser?.loggedIn === true
        ) {
          setUser(parsedUser)
        } else {
          setUser(null)
        }
      } catch (error) {
        console.error(
          'User loading error:',
          error
        )

        setUser(null)
      }
    }

    loadUser()

    window.addEventListener(
      'userUpdated',
      loadUser
    )

    window.addEventListener(
      'storage',
      loadUser
    )

    return () => {
      window.removeEventListener(
        'userUpdated',
        loadUser
      )

      window.removeEventListener(
        'storage',
        loadUser
      )
    }
  }, [])

  /* =====================================================
     WATCHLIST COUNT
  ===================================================== */

  useEffect(() => {
    const updateWatchlistCount =
      () => {
        try {
          const saved =
            localStorage.getItem(
              WATCHLIST_KEY
            )

          if (!saved) {
            setWatchlistCount(0)
            return
          }

          const movies =
            JSON.parse(saved)

          if (
            Array.isArray(movies)
          ) {
            setWatchlistCount(
              movies.length
            )
          } else {
            setWatchlistCount(0)
          }
        } catch (error) {
          console.error(
            'Watchlist count error:',
            error
          )

          setWatchlistCount(0)
        }
      }

    updateWatchlistCount()

    window.addEventListener(
      'watchlistUpdated',
      updateWatchlistCount
    )

    window.addEventListener(
      'storage',
      updateWatchlistCount
    )

    return () => {
      window.removeEventListener(
        'watchlistUpdated',
        updateWatchlistCount
      )

      window.removeEventListener(
        'storage',
        updateWatchlistCount
      )
    }
  }, [])

  /* =====================================================
     CLOSE PROFILE WHEN CLICKING OUTSIDE
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick = (
      event: MouseEvent
    ) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleOutsideClick
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleOutsideClick
      )
    }
  }, [])

  /* =====================================================
     CLOSE PROFILE WITH ESC
  ===================================================== */

  useEffect(() => {
    const handleEscape = (
      event: KeyboardEvent
    ) => {
      if (event.key === 'Escape') {
        setProfileOpen(false)
      }
    }

    document.addEventListener(
      'keydown',
      handleEscape
    )

    return () => {
      document.removeEventListener(
        'keydown',
        handleEscape
      )
    }
  }, [])

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    localStorage.removeItem(
      USER_KEY
    )

    localStorage.removeItem(
      'movie-explorer-google-login'
    )

    setUser(null)
    setProfileOpen(false)

    window.dispatchEvent(
      new Event('userUpdated')
    )

    navigate('/login', {
      replace: true,
    })
  }

  /* =====================================================
     USER INFORMATION
  ===================================================== */

  const displayName =
    user?.name?.trim() ||
    user?.email
      ?.split('@')[0] ||
    'User'

  const displayEmail =
    user?.email ||
    ''

  const firstLetter =
    displayName
      .charAt(0)
      .toUpperCase() || 'U'

  /* =====================================================
     NAVIGATION ITEMS
  ===================================================== */

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
      icon: '♡',
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
          onClick={() =>
            setProfileOpen(false)
          }
        >

          <span className="logo-icon">
            🎬
          </span>

          <span className="logo-content">

            <strong>
              MOVIE
            </strong>

            <small>
              EXPLORER
            </small>

          </span>

        </Link>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <nav className="movie-nav">

          {navItems.map(
            (item) => (

              <NavLink
                key={item.path}
                to={item.path}
                end={
                  item.path === '/'
                }
                className={({
                  isActive,
                }) =>
                  isActive
                    ? 'nav-item active'
                    : 'nav-item'
                }
                onClick={() =>
                  setProfileOpen(false)
                }
              >

                <span className="nav-icon">
                  {item.icon}
                </span>

                <span className="nav-text">
                  {item.name}
                </span>

                {item.name ===
                  'Watchlist' &&
                  watchlistCount > 0 && (

                    <span className="watchlist-count">

                      {watchlistCount >
                      99
                        ? '99+'
                        : watchlistCount}

                    </span>

                  )}

              </NavLink>

            )
          )}

        </nav>

        {/* =================================================
            NAVBAR ACTIONS
        ================================================= */}

        <div className="navbar-actions">

          {/* =================================================
              SEARCH
          ================================================= */}

          <NavLink
            to="/search"
            className={({ isActive }) =>
              isActive
                ? 'search-link active'
                : 'search-link'
            }
            onClick={() =>
              setProfileOpen(false)
            }
          >

            <span className="search-icon">
              🔍
            </span>

            <span className="search-text">
              Search
            </span>

          </NavLink>

          {/* =================================================
              PROFILE
          ================================================= */}

          {user && (

            <div
              className="profile-wrapper"
              ref={profileRef}
            >

              {/* PROFILE BUTTON */}

              <button
                type="button"
                className="profile-button"
                onClick={() =>
                  setProfileOpen(
                    (current) =>
                      !current
                  )
                }
                aria-label="Open profile menu"
                aria-expanded={
                  profileOpen
                }
              >

                {user.photoURL ? (

                  <img
                    src={user.photoURL}
                    alt={displayName}
                    className="profile-avatar"
                    style={{
                      objectFit: 'cover',
                    }}
                  />

                ) : (

                  <span className="profile-avatar">
                    {firstLetter}
                  </span>

                )}

                <span className="profile-arrow">
                  ▼
                </span>

              </button>

              {/* =================================================
                  PROFILE DROPDOWN
              ================================================= */}

              {profileOpen && (

                <div className="profile-dropdown">

                  {/* USER HEADER */}

                  <div className="profile-header">

                    {user.photoURL ? (

                      <img
                        src={user.photoURL}
                        alt={displayName}
                        className="profile-avatar large"
                        style={{
                          objectFit: 'cover',
                        }}
                      />

                    ) : (

                      <span className="profile-avatar large">
                        {firstLetter}
                      </span>

                    )}

                    <div className="profile-user-info">

                      <strong>
                        {displayName}
                      </strong>

                      <span>
                        {displayEmail}
                      </span>

                    </div>

                  </div>

                  <div className="profile-divider" />

                  {/* ACCOUNT */}

                  <button
                    type="button"
                    className="profile-menu-item"
                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }
                  >

                    <span>
                      👤
                    </span>

                    <span>
                      My Account
                    </span>

                  </button>

                  {/* WATCHLIST */}

                  <Link
                    to="/watchlist"
                    className="profile-menu-item"
                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }
                  >

                    <span>
                      ♡
                    </span>

                    <span>
                      My Watchlist
                    </span>

                  </Link>

                  {/* FAVORITES */}

                  <Link
                    to="/favorites"
                    className="profile-menu-item"
                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }
                  >

                    <span>
                      ⭐
                    </span>

                    <span>
                      My Favorites
                    </span>

                  </Link>

                  <div className="profile-divider" />

                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="logout-button"
                    onClick={
                      handleLogout
                    }
                  >

                    <span>
                      ↪
                    </span>

                    <span>
                      Logout
                    </span>

                  </button>

                </div>

              )}

            </div>

          )}

        </div>

      </div>

    </header>
  )
}

export default Navbar