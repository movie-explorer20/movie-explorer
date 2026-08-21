import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getTrendingMovies,
  type TMDBMovie,
} from '../../services/tmdb/movies'
import './HeroMovie.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'

function HeroMovie() {
  const [movie, setMovie] = useState<TMDBMovie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFeaturedMovie() {
      try {
        setLoading(true)

        const data = await getTrendingMovies()

        if (data.results.length > 0) {
          // First trending movie becomes featured movie
          setMovie(data.results[0])
        }
      } catch (error) {
        console.error(
          'Featured movie error:',
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedMovie()
  }, [])

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <section className="hero">
        <div className="hero-background hero-loading-bg" />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-label">
            FEATURED MOVIE
          </p>

          <h1>Loading...</h1>

          <p className="hero-description">
            Finding a movie for you...
          </p>
        </div>
      </section>
    )
  }

  /* =========================================
     FALLBACK
  ========================================= */

  if (!movie) {
    return (
      <section className="hero">
        <div className="hero-background" />

        <div className="hero-overlay" />

        <div className="hero-content">
          <p className="hero-label">
            FEATURED MOVIE
          </p>

          <h1>Movie Explorer</h1>

          <p className="hero-description">
            Discover popular movies and explore
            something new.
          </p>

          <div className="hero-actions">
            <Link
              to="/movies"
              className="primary-button"
            >
              ▶ Browse Movies
            </Link>
          </div>
        </div>
      </section>
    )
  }

  /* =========================================
     MOVIE DATA
  ========================================= */

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}${movie.backdrop_path}`
    : movie.poster_path
      ? `${IMAGE_BASE_URL}${movie.poster_path}`
      : ''

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'N/A'

  const rating = Number.isFinite(movie.vote_average)
    ? movie.vote_average.toFixed(1)
    : 'N/A'

  return (
    <section className="hero">

      {/* BACKGROUND */}

      <div
        className="hero-background"
        style={{
          backgroundImage: `
            linear-gradient(
              90deg,
              #080808 0%,
              rgba(8, 8, 8, 0.94) 24%,
              rgba(8, 8, 8, 0.60) 52%,
              rgba(8, 8, 8, 0.18) 100%
            ),
            url("${backdropUrl}")
          `,
        }}
      />

      {/* OVERLAY */}

      <div className="hero-overlay" />

      {/* CONTENT */}

      <div className="hero-content">

        <p className="hero-label">
          FEATURED MOVIE
        </p>

        <h1>
          {movie.title}
        </h1>

        {/* META */}

        <div className="hero-meta">

          <span>
            ⭐ {rating}
          </span>

          <span>
            {year}
          </span>

          <span>
            Movie
          </span>

        </div>

        {/* DESCRIPTION */}

        <p className="hero-description">
          {movie.overview ||
            'Discover this popular movie and explore more details.'}
        </p>

        {/* ACTIONS */}

        <div className="hero-actions">

          <Link
            to={`/movie/${movie.id}`}
            className="primary-button"
          >
            ▶ View Details
          </Link>

          <Link
            to="/movies"
            className="secondary-button"
          >
            Browse Movies
          </Link>

        </div>

      </div>

    </section>
  )
}

export default HeroMovie