
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import {
  getMovieCredits,
  getMovieDetails,
  getMovieVideos,
  getSimilarMovies,
  type TMDBCastMember,
  type TMDBMovie,
  type TMDBMovieDetails,
  type TMDBVideo,
} from '../../services/tmdb/movies'

import './MovieDetails.css'

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p'

const WATCHLIST_KEY = 'movie-explorer-watchlist'
const FAVORITES_KEY = 'movie-explorer-favorites'
const RECENTLY_VIEWED_KEY = 'movie-explorer-recently-viewed'

type MovieState = TMDBMovieDetails

function MovieDetails() {
  const { id } = useParams<{ id: string }>()

  const [movie, setMovie] = useState<MovieState | null>(null)
  const [cast, setCast] = useState<TMDBCastMember[]>([])
  const [similarMovies, setSimilarMovies] = useState<TMDBMovie[]>([])
  const [trailer, setTrailer] = useState<TMDBVideo | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    async function loadMovie() {
      if (!id) return

      try {
        setLoading(true)
        setError('')

        const movieId = Number(id)

        if (!Number.isFinite(movieId)) {
          throw new Error('Invalid movie ID')
        }

        const [
          movieData,
          creditsData,
          videosData,
          similarData,
        ] = await Promise.all([
          getMovieDetails(movieId),
          getMovieCredits(movieId),
          getMovieVideos(movieId),
          getSimilarMovies(movieId),
        ])

        setMovie(movieData)

        setCast(creditsData.cast.slice(0, 12))

        const youtubeTrailer =
          videosData.results.find(
            (video) =>
              video.site === 'YouTube' &&
              video.type === 'Trailer'
          ) ||
          videosData.results.find(
            (video) =>
              video.site === 'YouTube' &&
              video.type === 'Teaser'
          )

        setTrailer(youtubeTrailer || null)

        setSimilarMovies(
          similarData.results
            .filter((similarMovie) => similarMovie.poster_path)
            .slice(0, 12)
        )
      } catch (err) {
        console.error('Movie details error:', err)
        setError('We could not load this movie.')
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id])

  useEffect(() => {
    if (!id) return

    const movieId = Number(id)

    try {
      const watchlist = JSON.parse(
        localStorage.getItem(WATCHLIST_KEY) || '[]'
      ) as TMDBMovie[]

      const favorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      ) as TMDBMovie[]

      setIsInWatchlist(
        Array.isArray(watchlist) &&
          watchlist.some((item) => item.id === movieId)
      )

      setIsFavorite(
        Array.isArray(favorites) &&
          favorites.some((item) => item.id === movieId)
      )
    } catch (err) {
      console.error('Local storage read error:', err)
    }
  }, [id])

  /*
    RECENTLY VIEWED
  */
  useEffect(() => {
    if (!movie) return

    try {
      const saved = JSON.parse(
        localStorage.getItem(RECENTLY_VIEWED_KEY) || '[]'
      ) as TMDBMovie[]

      const movieForStorage: TMDBMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language,
      }

      const savedList = Array.isArray(saved) ? saved : []

      const withoutCurrent = savedList.filter(
        (item) => item.id !== movie.id
      )

      const updated = [
        movieForStorage,
        ...withoutCurrent,
      ].slice(0, 10)

      localStorage.setItem(
        RECENTLY_VIEWED_KEY,
        JSON.stringify(updated)
      )

      window.dispatchEvent(
        new Event('recentlyViewedUpdated')
      )
    } catch (err) {
      console.error('Recently viewed error:', err)
    }
  }, [movie])

  /*
    WATCHLIST
  */
  const toggleWatchlist = () => {
    if (!movie) return

    try {
      const saved = JSON.parse(
        localStorage.getItem(WATCHLIST_KEY) || '[]'
      ) as TMDBMovie[]

      const savedList = Array.isArray(saved) ? saved : []

      const exists = savedList.some(
        (item) => item.id === movie.id
      )

      const movieForStorage: TMDBMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language,
      }

      const updated = exists
        ? savedList.filter(
            (item) => item.id !== movie.id
          )
        : [...savedList, movieForStorage]

      localStorage.setItem(
        WATCHLIST_KEY,
        JSON.stringify(updated)
      )

      setIsInWatchlist(!exists)

      window.dispatchEvent(
        new Event('watchlistUpdated')
      )
    } catch (err) {
      console.error('Watchlist error:', err)
    }
  }

  /*
    FAVORITES
  */
  const toggleFavorite = () => {
    if (!movie) return

    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      ) as TMDBMovie[]

      const savedList = Array.isArray(saved) ? saved : []

      const exists = savedList.some(
        (item) => item.id === movie.id
      )

      const movieForStorage: TMDBMovie = {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        original_language: movie.original_language,
      }

      const updated = exists
        ? savedList.filter(
            (item) => item.id !== movie.id
          )
        : [...savedList, movieForStorage]

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(updated)
      )

      setIsFavorite(!exists)

      window.dispatchEvent(
        new Event('favoritesUpdated')
      )
    } catch (err) {
      console.error('Favorite error:', err)
    }
  }

  if (loading) {
    return (
      <main className="movie-details-loading">
        <div className="loading-spinner" />
        <p>Loading movie...</p>
      </main>
    )
  }

  if (error || !movie) {
    return (
      <main className="movie-details-error">
        <h2>Something went wrong</h2>

        <p>
          {error || 'Movie not found.'}
        </p>

        <Link
          to="/movies"
          className="details-back-btn"
        >
          Browse Movies
        </Link>
      </main>
    )
  }

  const backdropUrl = movie.backdrop_path
    ? `${IMAGE_BASE_URL}/original${movie.backdrop_path}`
    : ''

  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}/w500${movie.poster_path}`
    : ''

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'N/A'

  const rating = Number.isFinite(movie.vote_average)
    ? movie.vote_average.toFixed(1)
    : 'N/A'

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${
        movie.runtime % 60
      }m`
    : 'N/A'

  const formatMoney = (value: number) => {
    if (!value) return 'N/A'

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <main className="movie-details-page">

      <section
        className="movie-hero"
        style={{
          backgroundImage: backdropUrl
            ? `url("${backdropUrl}")`
            : undefined,
        }}
      >
        <div className="movie-hero-overlay" />

        <div className="movie-hero-content">

          {posterUrl && (
            <img
              className="movie-details-poster"
              src={posterUrl}
              alt={`${movie.title} poster`}
            />
          )}

          <div className="movie-info">

            <p className="movie-label">
              MOVIE DETAILS
            </p>

            <h1>{movie.title}</h1>

            {movie.tagline && (
              <p className="movie-tagline">
                {movie.tagline}
              </p>
            )}

            <div className="movie-meta">
              <span className="rating">
                ⭐ {rating}
              </span>

              <span>{year}</span>

              <span>{runtime}</span>
            </div>

            <div className="movie-genres">
              {movie.genres.map((genre) => (
                <span key={genre.id}>
                  {genre.name}
                </span>
              ))}
            </div>

            <p className="movie-overview">
              {movie.overview ||
                'No overview available.'}
            </p>

            <div className="movie-actions">

              <button
                type="button"
                className={
                  isInWatchlist
                    ? 'watchlist-btn added'
                    : 'watchlist-btn'
                }
                onClick={toggleWatchlist}
              >
                {isInWatchlist
                  ? '✓ In Watchlist'
                  : '+ Add to Watchlist'}
              </button>

              <button
                type="button"
                className={
                  isFavorite
                    ? 'favorite-btn active'
                    : 'favorite-btn'
                }
                onClick={toggleFavorite}
              >
                <span className="favorite-heart">
                  {isFavorite ? '♥' : '♡'}
                </span>

                <span>
                  {isFavorite
                    ? 'Favorited'
                    : 'Favorite'}
                </span>
              </button>

            </div>

          </div>
        </div>
      </section>

      <section className="movie-extra-section">

        <div className="movie-extra-container">

          <div className="movie-stats">

            <div className="movie-stat">
              <span>Rating</span>
              <strong>⭐ {rating}</strong>
            </div>

            <div className="movie-stat">
              <span>Release</span>
              <strong>
                {movie.release_date || 'N/A'}
              </strong>
            </div>

            <div className="movie-stat">
              <span>Runtime</span>
              <strong>{runtime}</strong>
            </div>

            <div className="movie-stat">
              <span>Budget</span>
              <strong>
                {formatMoney(movie.budget)}
              </strong>
            </div>

            <div className="movie-stat">
              <span>Revenue</span>
              <strong>
                {formatMoney(movie.revenue)}
              </strong>
            </div>

          </div>

          {movie.production_companies.length > 0 && (
            <div className="movie-production">

              <h2>Production Companies</h2>

              <div className="production-list">

                {movie.production_companies
                  .slice(0, 6)
                  .map((company) => (
                    <div
                      className="production-company"
                      key={company.id}
                    >
                      {company.logo_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w200${company.logo_path}`}
                          alt={company.name}
                        />
                      ) : (
                        <span>{company.name}</span>
                      )}
                    </div>
                  ))}

              </div>
            </div>
          )}

          {trailer && (
            <section className="movie-trailer">

              <div className="section-heading">
                <p>WATCH</p>
                <h2>Official Trailer</h2>
              </div>

              <div className="trailer-wrapper">

                <iframe
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} trailer`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />

              </div>

            </section>
          )}

          {cast.length > 0 && (
            <section className="movie-cast">

              <div className="section-heading">
                <p>CAST</p>
                <h2>Top Cast</h2>
              </div>

              <div className="cast-grid">

                {cast.map((actor) => (
                  <article
                    className="cast-card"
                    key={actor.id}
                  >

                    {actor.profile_path ? (
                      <img
                        src={`${IMAGE_BASE_URL}/w185${actor.profile_path}`}
                        alt={actor.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="cast-placeholder">
                        ?
                      </div>
                    )}

                    <div className="cast-info">

                      <h3>{actor.name}</h3>

                      <p>
                        {actor.character ||
                          'Unknown role'}
                      </p>

                    </div>

                  </article>
                ))}

              </div>

            </section>
          )}

          {similarMovies.length > 0 && (
            <section className="similar-movies">

              <div className="section-heading">
                <p>YOU MAY ALSO LIKE</p>
                <h2>Similar Movies</h2>
              </div>

              <div className="similar-grid">

                {similarMovies.map(
                  (similarMovie) => (
                    <Link
                      key={similarMovie.id}
                      to={`/movie/${similarMovie.id}`}
                      className="similar-card"
                    >

                      {similarMovie.poster_path ? (
                        <img
                          src={`${IMAGE_BASE_URL}/w500${similarMovie.poster_path}`}
                          alt={similarMovie.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="similar-placeholder">
                          No Image
                        </div>
                      )}

                      <div className="similar-info">

                        <h3>
                          {similarMovie.title}
                        </h3>

                        <div>

                          <span>
                            ⭐{' '}
                            {Number.isFinite(
                              similarMovie.vote_average
                            )
                              ? similarMovie.vote_average.toFixed(
                                  1
                                )
                              : 'N/A'}
                          </span>

                          <span>
                            {similarMovie.release_date
                              ? similarMovie.release_date.slice(
                                  0,
                                  4
                                )
                              : 'N/A'}
                          </span>

                        </div>

                      </div>

                    </Link>
                  )
                )}

              </div>

            </section>
          )}

        </div>

      </section>

    </main>
  )
}

export default MovieDetails

