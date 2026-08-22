import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

const USER_KEY = 'movie-explorer-user'
const ACCOUNT_KEY = 'movie-explorer-account'

type RegisteredUser = {
  name: string
  email: string
  loggedIn: boolean
  loginMethod: string
}

function Register() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] =
    useState('')

  const [showPassword, setShowPassword] =
    useState(false)

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false)

  const [agreeTerms, setAgreeTerms] =
    useState(false)

  const [error, setError] = useState('')
  const [isLoading, setIsLoading] =
    useState(false)

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    setError('')

    const cleanName = name.trim()
    const cleanEmail = email.trim()

    /* NAME */

    if (!cleanName) {
      setError(
        'Please enter your name.'
      )
      return
    }

    /* EMAIL */

    if (!cleanEmail) {
      setError(
        'Please enter your email address.'
      )
      return
    }

    if (!cleanEmail.includes('@')) {
      setError(
        'Please enter a valid email address.'
      )
      return
    }

    /* PASSWORD */

    if (!password) {
      setError(
        'Please enter a password.'
      )
      return
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      )
      return
    }

    /* CONFIRM PASSWORD */

    if (!confirmPassword) {
      setError(
        'Please confirm your password.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      )
      return
    }

    /* TERMS */

    if (!agreeTerms) {
      setError(
        'Please agree to the terms and conditions.'
      )
      return
    }

    setIsLoading(true)

    try {

      /*
        Demo local registration.

        Real authentication will later
        be connected with Firebase.
      */

      const user: RegisteredUser = {
        name: cleanName,
        email: cleanEmail,
        loggedIn: true,
        loginMethod: 'email',
      }

      /* Save logged-in user */

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(user)
      )

      /* Save account information */

      localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify({
          name: cleanName,
          email: cleanEmail,
        })
      )

      /* Notify Navbar */

      window.dispatchEvent(
        new Event('userUpdated')
      )

      /*
        Navigate after successful registration.
      */

      setTimeout(() => {
        setIsLoading(false)

        navigate('/', {
          replace: true,
        })
      }, 500)

    } catch (error) {

      console.error(
        'Registration error:',
        error
      )

      setIsLoading(false)

      setError(
        'Something went wrong. Please try again.'
      )
    }
  }

  /* =====================================================
     GOOGLE REGISTER
  ===================================================== */

  const handleGoogleRegister = () => {
    setError('')
    setIsLoading(true)

    /*
      Demo Google registration.

      Real Google OAuth will later be connected
      with Firebase.
    */

    const googleUser: RegisteredUser = {
      name: 'Google User',
      email: 'google-user@movieexplorer.local',
      loggedIn: true,
      loginMethod: 'google',
    }

    try {

      localStorage.setItem(
        USER_KEY,
        JSON.stringify(googleUser)
      )

      localStorage.setItem(
        ACCOUNT_KEY,
        JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
        })
      )

      localStorage.setItem(
        'movie-explorer-google-login',
        'true'
      )

      /* Notify Navbar */

      window.dispatchEvent(
        new Event('userUpdated')
      )

      setTimeout(() => {
        setIsLoading(false)

        navigate('/', {
          replace: true,
        })
      }, 500)

    } catch (error) {

      console.error(
        'Google registration error:',
        error
      )

      setIsLoading(false)

      setError(
        'Google registration failed. Please try again.'
      )
    }
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <main className="register-page">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="register-background">

        <div className="register-glow register-glow-one" />

        <div className="register-glow register-glow-two" />

        <div className="register-grid" />

      </div>

      {/* =================================================
          REGISTER CARD
      ================================================= */}

      <section className="register-card">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="register-header">

          <Link
            to="/register"
            className="register-logo"
          >
            MOVIE
            <span>
              EXPLORER
            </span>
          </Link>

          <p className="register-eyebrow">
            JOIN MOVIE EXPLORER
          </p>

          <h1>
            Create your account
          </h1>

          <p className="register-subtitle">
            Build your personal movie collection,
            save favorites, and discover something
            new to watch.
          </p>

        </div>

        {/* =================================================
            ERROR
        ================================================= */}

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* =================================================
            GOOGLE
        ================================================= */}

        <button
          type="button"
          className="google-register-btn"
          onClick={handleGoogleRegister}
          disabled={isLoading}
        >

          <span className="google-icon">
            G
          </span>

          <span>
            {isLoading
              ? 'Creating account...'
              : 'Continue with Google'}
          </span>

        </button>

        {/* =================================================
            DIVIDER
        ================================================= */}

        <div className="register-divider">

          <span />

          <p>
            OR
          </p>

          <span />

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="register-form"
          onSubmit={handleRegister}
        >

          {/* NAME */}

          <div className="register-form-group">

            <label htmlFor="name">
              Full name
            </label>

            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value
                )
              }
              autoComplete="name"
              disabled={isLoading}
              required
            />

          </div>

          {/* EMAIL */}

          <div className="register-form-group">

            <label htmlFor="register-email">
              Email address
            </label>

            <input
              id="register-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) =>
                setEmail(
                  event.target.value
                )
              }
              autoComplete="email"
              disabled={isLoading}
              required
            />

          </div>

          {/* PASSWORD */}

          <div className="register-form-group">

            <label htmlFor="register-password">
              Password
            </label>

            <div className="register-password-input">

              <input
                id="register-password"
                type={
                  showPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Create a password"
                value={password}
                onChange={(event) =>
                  setPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={isLoading}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={isLoading}
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

            <small>
              Use at least 6 characters.
            </small>

          </div>

          {/* CONFIRM PASSWORD */}

          <div className="register-form-group">

            <label htmlFor="confirm-password">
              Confirm password
            </label>

            <div className="register-password-input">

              <input
                id="confirm-password"
                type={
                  showConfirmPassword
                    ? 'text'
                    : 'password'
                }
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(
                    event.target.value
                  )
                }
                autoComplete="new-password"
                disabled={isLoading}
                required
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    (current) =>
                      !current
                  )
                }
                disabled={isLoading}
                aria-label={
                  showConfirmPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showConfirmPassword
                  ? '◉'
                  : '◌'}
              </button>

            </div>

          </div>

          {/* =================================================
              TERMS
          ================================================= */}

          <label className="register-terms">

            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) =>
                setAgreeTerms(
                  event.target.checked
                )
              }
              disabled={isLoading}
            />

            <span>
              I agree to the terms and
              conditions.
            </span>

          </label>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <button
            type="submit"
            className="register-submit"
            disabled={isLoading}
          >
            {isLoading
              ? 'Creating account...'
              : 'Create Account'}
          </button>

        </form>

        {/* =================================================
            LOGIN
        ================================================= */}

        <div className="register-login">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>

        </div>

        {/* =================================================
            BACK HOME
        ================================================= */}

        <Link
          to="/login"
          className="register-back-home"
        >
          ← Back to Movie Explorer
        </Link>

      </section>

    </main>
  )
}

export default Register