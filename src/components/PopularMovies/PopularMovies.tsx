import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import {
  getPopularMovies,
  type TMDBMovie,
} from '../../services/tmdb/movies'

import './PopularMovies.css'

const IMAGE_BASE_URL =
  'https://image.tmdb.org/t/p/w500'

function PopularMovies() {
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadPopularMovies() {
      try {
        setLoading(true)
        setError('')

        const data = await getPopularMovies(1)

        setMovies(
          data.results
            .filter((movie) => movie.poster_path)
            .slice(0, 12)
        )
      } catch (err) {
        console.error(
          'Popular movies error:',
          err
        )

        setError(
          'Popular movies could not be loaded.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadPopularMovies()
  }, [])

  if (loading) {
    return (
      <section className="popular-movies-section">
        <div className="popular-container">

          <div className="popular-heading">
            <div>
              <span className="popular-eyebrow">
                DISCOVER
              </span>

              <h2>Popular Movies</h2>
            </div>
          </div>

          <div className="popular-loading">
            <div className="popular-spinner" />
            <p>Loading popular movies...</p>
          </div>

        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="popular-movies-section">
        <div className="popular-container">

          <div className="popular-heading">
            <div>
              <span className="popular-eyebrow">
                DISCOVER
              </span>

              <h2>Popular Movies</h2>
            </div>
          </div>

          <div className="popular-error">
            <p>{error}</p>
          </div>

        </div>
      </section>
    )
  }

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="popular-movies-section">
      <div className="popular-container">

        {/* SECTION HEADER */}
        <div className="popular-heading">

          <div>
            <span className="popular-eyebrow">
              DISCOVER
            </span>

            <h2>Popular Movies</h2>

            <p>
              The movies everyone is watching right now.
            </p>
          </div>

          <Link
            to="/movies"
            className="popular-view-all"
          >
            View All
            <span>→</span>
          </Link>

        </div>

        {/* MOVIE GRID */}
        <div className="popular-grid">

          {movies.map((movie) => {
            const rating =
              Number.isFinite(movie.vote_average)
                ? movie.vote_average.toFixed(1)
                : 'N/A'

            const year =
              movie.release_date
                ? movie.release_date.slice(0, 4)
                : 'N/A'

            return (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="popular-card"
              >

                <div className="popular-poster-wrapper">

                  <img
                    src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                    alt={`${movie.title} poster`}
                    className="popular-poster"
                    loading="lazy"
                  />

                  <div className="popular-card-overlay">
                    <span className="popular-play">
                      ▶
                    </span>
                  </div>

                  <span className="popular-rating">
                    ⭐ {rating}
                  </span>

                </div>

                <div className="popular-card-info">

                  <h3>
                    {movie.title}
                  </h3>

                  <div className="popular-card-meta">
                    <span>{year}</span>
                    <span>Movie</span>
                  </div>

                </div>

              </Link>
            )
          })}

        </div>

      </div>
    </section>
  )
}

export default PopularMovies