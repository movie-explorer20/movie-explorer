import {
  Navigate,
  Outlet,
  useLocation,
} from 'react-router-dom'

const USER_KEY = 'movie-explorer-user'

function ProtectedRoute() {
  const location = useLocation()

  let isLoggedIn = false

  try {
    const savedUser =
      localStorage.getItem(USER_KEY)

    if (savedUser) {
      const user = JSON.parse(savedUser)

      isLoggedIn =
        user?.loggedIn === true
    }
  } catch (error) {
    console.error(
      'Authentication check error:',
      error
    )

    isLoggedIn = false
  }

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from:
            location.pathname +
            location.search,
        }}
      />
    )
  }

  return <Outlet />
}

export default ProtectedRoute