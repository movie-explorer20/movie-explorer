
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Register.css'

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

  const handleRegister = (
    event: React.FormEvent
  ) => {
    event.preventDefault()

    setError('')

    if (!name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!password) {
      setError('Please enter a password.')
      return
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      )
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!agreeTerms) {
      setError(
        'Please agree to the terms and conditions.'
      )
      return
    }

    try {
      const user = {
        name: name.trim(),
        email: email.trim(),
        loggedIn: true,
      }

      localStorage.setItem(
        'movie-explorer-user',
        JSON.stringify(user)
      )

      localStorage.setItem(
        'movie-explorer-account',
        JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        })
      )

      navigate('/')
    } catch (err) {
      console.error(
        'Registration error:',
        err
      )

      setError(
        'Something went wrong. Please try again.'
      )
    }
  }

  const handleGoogleRegister = () => {
    alert(
      'Google registration will be connected with Google OAuth next.'
    )
  }

  return (
    <main className="register-page">

      {/* BACKGROUND */}

      <div className="register-background">
        <div className="register-glow register-glow-one" />
        <div className="register-glow register-glow-two" />
        <div className="register-grid" />
      </div>

      {/* REGISTER CARD */}

      <section className="register-card">

        {/* HEADER */}

        <div className="register-header">

          <Link
            to="/"
            className="register-logo"
          >
            MOVIE
            <span>EXPLORER</span>
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

        {/* GOOGLE */}

        <button
          type="button"
          className="google-register-btn"
          onClick={handleGoogleRegister}
        >
          <span className="google-icon">
            G
          </span>

          <span>
            Continue with Google
          </span>
        </button>

        {/* DIVIDER */}

        <div className="register-divider">
          <span />
          <p>OR</p>
          <span />
        </div>

        {/* ERROR */}

        {error && (
          <div className="register-error">
            {error}
          </div>
        )}

        {/* FORM */}

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
                setName(event.target.value)
              }
              autoComplete="name"
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
                setEmail(event.target.value)
              }
              autoComplete="email"
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
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
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
              />

              <button
                type="button"
                className="register-password-toggle"
                onClick={() =>
                  setShowConfirmPassword(
                    !showConfirmPassword
                  )
                }
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

          {/* TERMS */}

          <label className="register-terms">

            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) =>
                setAgreeTerms(
                  event.target.checked
                )
              }
            />

            <span>
              I agree to the terms and
              conditions.
            </span>

          </label>

          {/* SUBMIT */}

          <button
            type="submit"
            className="register-submit"
          >
            Create Account
          </button>

        </form>

        {/* LOGIN */}

        <div className="register-login">

          <span>
            Already have an account?
          </span>

          <Link to="/login">
            Sign in
          </Link>

        </div>

        {/* BACK HOME */}

        <Link
          to="/"
          className="register-back-home"
        >
          ← Back to Movie Explorer
        </Link>

      </section>

    </main>
  )
}

export default Register
