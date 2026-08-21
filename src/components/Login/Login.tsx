
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'

const USER_KEY = 'movie-explorer-user'
const REMEMBER_KEY = 'movie-explorer-remember'

function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] =
    useState(false)
  const [rememberMe, setRememberMe] =
    useState(false)
  const [isLoading, setIsLoading] =
    useState(false)

  /* =====================================================
     NORMAL LOGIN
  ===================================================== */

  const handleLogin = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const cleanEmail = email.trim()

    if (!cleanEmail || !password) {
      alert(
        'Please enter your email and password.'
      )
      return
    }

    if (!cleanEmail.includes('@')) {
      alert(
        'Please enter a valid email address.'
      )
      return
    }

    setIsLoading(true)

    /*
      Temporary local authentication.

      Later this can be replaced with
      your real backend authentication.
    */

    const user = {
      email: cleanEmail,
      loggedIn: true,
      loginMethod: 'email',
    }

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(user)
    )

    if (rememberMe) {
      localStorage.setItem(
        REMEMBER_KEY,
        'true'
      )
    } else {
      localStorage.removeItem(
        REMEMBER_KEY
      )
    }

    setTimeout(() => {
      setIsLoading(false)
      navigate('/')
    }, 500)
  }

  /* =====================================================
     GOOGLE LOGIN
  ===================================================== */

  const handleGoogleLogin = () => {
    /*
      This is currently a demo login.

      Real Google OAuth will be connected later
      with Firebase or Google Identity Services.
    */

    const googleUser = {
      email: 'google-user@movieexplorer.local',
      loggedIn: true,
      loginMethod: 'google',
    }

    localStorage.setItem(
      USER_KEY,
      JSON.stringify(googleUser)
    )

    localStorage.setItem(
      'movie-explorer-google-login',
      'true'
    )

    navigate('/')
  }

  /* =====================================================
     FORGOT PASSWORD
  ===================================================== */

  const handleForgotPassword = () => {
    if (!email.trim()) {
      alert(
        'Please enter your email address first.'
      )
      return
    }

    alert(
      `Password reset for ${email.trim()} will be available when the backend authentication is connected.`
    )
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="login-page">

      {/* BACKGROUND */}

      <div className="login-background">
        <div className="login-glow login-glow-one" />
        <div className="login-glow login-glow-two" />
      </div>

      {/* LOGIN CARD */}

      <section className="login-card">

        {/* HEADER */}

        <div className="login-header">

          <Link
            to="/"
            className="login-logo"
          >
            MOVIE
            <span>EXPLORER</span>
          </Link>

          <p className="login-eyebrow">
            WELCOME BACK
          </p>

          <h1>
            Sign in to continue
          </h1>

          <p className="login-subtitle">
            Discover movies, save favorites,
            and keep your watchlist organized.
          </p>

        </div>

        {/* =================================================
            GOOGLE LOGIN
        ================================================= */}

        <button
          type="button"
          className="google-login-btn"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <span
            className="google-icon"
            aria-hidden="true"
          >
            G
          </span>

          <span>
            Continue with Google
          </span>
        </button>

        {/* DIVIDER */}

        <div className="login-divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        {/* =================================================
            LOGIN FORM
        ================================================= */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* EMAIL */}

          <div className="form-group">

            <label htmlFor="email">
              Email address
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              autoComplete="email"
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="form-group">

            <div className="password-label-row">

              <label htmlFor="password">
                Password
              </label>

              <button
                type="button"
                className="forgot-password"
                onClick={
                  handleForgotPassword
                }
              >
                Forgot password?
              </button>

            </div>

            <div className="password-input">

              <input
                id="password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Enter your password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                className="show-password"
                onClick={() =>
                  setShowPassword(
                    (current) => !current
                  )
                }
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword
                  ? '◉'
                  : '◌'}
              </button>

            </div>

          </div>

          {/* REMEMBER ME */}

          <label className="remember-me">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) =>
                setRememberMe(
                  event.target.checked
                )
              }
            />

            <span>
              Remember me
            </span>

          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            className="login-submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Signing in...'
              : 'Sign In'}
          </button>

        </form>

        {/* =================================================
            REGISTER
        ================================================= */}

        <div className="login-register">

          <span>
            Don't have an account?
          </span>

          <Link to="/register">
            Create account
          </Link>

        </div>

        {/* BACK HOME */}

        <Link
          to="/"
          className="back-home"
        >
          ← Back to Movie Explorer
        </Link>

      </section>
    </main>
  )
}

export default Login

