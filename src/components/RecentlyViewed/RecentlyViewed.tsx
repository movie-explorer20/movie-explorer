import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import './RecentlyViewed.css'

const IMAGE_BASE_URL =
  'https://image.tmdb.org/t/p/w500'

const RECENTLY_VIEWED_KEY =
  'movie-explorer-recently-viewed'

type RecentlyViewedMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
}

function RecentlyViewed() {
  const [movies, setMovies] =
    useState<RecentlyViewedMovie[]>([])

  const loadRecentlyViewed = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          RECENTLY_VIEWED_KEY
        ) || '[]'
      ) as RecentlyViewedMovie[]

      setMovies(saved)
    } catch (error) {
      console.error(
        'Recently viewed read error:',
        error
      )

      setMovies([])
    }
  }

  useEffect(() => {
    loadRecentlyViewed()

    const handleUpdate = () => {
      loadRecentlyViewed()
    }

    window.addEventListener(
      'recentlyViewedUpdated',
      handleUpdate
    )

    window.addEventListener(
      'storage',
      handleUpdate
    )

    return () => {
      window.removeEventListener(
        'recentlyViewedUpdated',
        handleUpdate
      )

      window.removeEventListener(
        'storage',
        handleUpdate
      )
    }
  }, [])

  if (movies.length === 0) {
    return null
  }

  return (
    <section className="recently-viewed-section">

      <div className="recently-viewed-container">

        <div className="recently-viewed-heading">

          <div>
            <p className="recently-viewed-label">
              YOUR ACTIVITY
            </p>

            <h2>
              Recently Viewed
            </h2>

            <p className="recently-viewed-subtitle">
              Continue exploring movies you
              recently checked out.
            </p>
          </div>

          <span className="recently-count">
            {movies.length} movie
            {movies.length !== 1 ? 's' : ''}
          </span>

        </div>

        <div className="recently-viewed-grid">

          {movies.map((movie) => {

            const year =
              movie.release_date
                ? movie.release_date.slice(0, 4)
                : 'N/A'

            const rating =
              Number.isFinite(
                movie.vote_average
              )
                ? movie.vote_average.toFixed(1)
                : 'N/A'

            return (
              <Link
                key={movie.id}
                to={`/movie/${movie.id}`}
                className="recently-movie-card"
              >

                <div className="recently-poster-wrapper">

                  {movie.poster_path ? (
                    <img
                      src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                      alt={`${movie.title} poster`}
                      className="recently-poster"
                      loading="lazy"
                    />
                  ) : (
                    <div className="recently-no-poster">
                      No Image
                    </div>
                  )}

                  <div className="recently-overlay">
                    <span>
                      View Details
                    </span>
                  </div>

                  <div className="recently-rating">
                    ⭐ {rating}
                  </div>

                </div>

                <div className="recently-movie-info">

                  <h3>
                    {movie.title}
                  </h3>

                  <div className="recently-movie-meta">
                    <span>
                      {year}
                    </span>

                    <span>•</span>

                    <span>
                      ⭐ {rating}
                    </span>
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

export default RecentlyViewed