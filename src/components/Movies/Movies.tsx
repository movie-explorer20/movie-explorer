
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import {
  Link,
  useSearchParams,
} from 'react-router-dom'

import { tmdbFetch } from '../../services/tmdb/client'

import type {
  TMDBMovie,
} from '../../services/tmdb/movies'

import './Movies.css'

const IMAGE_BASE_URL =
  'https://image.tmdb.org/t/p/w500'

const FAVORITES_KEY =
  'movie-explorer-favorites'

const genres = [
  { id: 0, name: 'All' },
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 27, name: 'Horror' },
  { id: 878, name: 'Sci-Fi' },
  { id: 53, name: 'Thriller' },
  { id: 10749, name: 'Romance' },
]

type MoviesResponse = {
  results: TMDBMovie[]
  page: number
  total_pages: number
  total_results: number
}

function Movies() {
  const [searchParams, setSearchParams] =
    useSearchParams()

  const urlGenre =
    Number(searchParams.get('genre')) || 0

  const [movies, setMovies] =
    useState<TMDBMovie[]>([])

  const [selectedGenre, setSelectedGenre] =
    useState(urlGenre)

  const [loading, setLoading] =
    useState(true)

  const [loadingMore, setLoadingMore] =
    useState(false)

  const [error, setError] =
    useState('')

  const [page, setPage] =
    useState(1)

  const [totalPages, setTotalPages] =
    useState(500)

  const [favorites, setFavorites] =
    useState<number[]>([])

  const loaderRef =
    useRef<HTMLDivElement | null>(null)

  const loadingRef =
    useRef(false)

  useEffect(() => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(
          FAVORITES_KEY
        ) || '[]'
      ) as TMDBMovie[]

      setFavorites(
        Array.isArray(saved)
          ? saved.map(
              (movie) => movie.id
            )
          : []
      )
    } catch (error) {
      console.error(
        'Favorites loading error:',
        error
      )

      setFavorites([])
    }
  }, [])

  const toggleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
    movie: TMDBMovie
  ) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const saved = JSON.parse(
        localStorage.getItem(
          FAVORITES_KEY
        ) || '[]'
      ) as TMDBMovie[]

      const favoritesList =
        Array.isArray(saved)
          ? saved
          : []

      const alreadyFavorite =
        favoritesList.some(
          (item) =>
            item.id === movie.id
        )

      const updatedFavorites =
        alreadyFavorite
          ? favoritesList.filter(
              (item) =>
                item.id !== movie.id
            )
          : [
              ...favoritesList,
              movie,
            ]

      localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(
          updatedFavorites
        )
      )

      setFavorites(
        updatedFavorites.map(
          (item) => item.id
        )
      )

      window.dispatchEvent(
        new Event(
          'favoritesUpdated'
        )
      )
    } catch (error) {
      console.error(
        'Favorite error:',
        error
      )
    }
  }

  useEffect(() => {
    const validGenre =
      genres.some(
        (genre) =>
          genre.id === urlGenre
      )

    setSelectedGenre(
      validGenre
        ? urlGenre
        : 0
    )
  }, [urlGenre])

  const getRandomPage = () =>
    Math.floor(
      Math.random() * 50
    ) + 1

  const loadMovies =
    useCallback(
      async (
        pageNumber: number,
        reset = false
      ) => {
        if (loadingRef.current) {
          return
        }

        loadingRef.current = true

        try {
          if (reset) {
            setLoading(true)
          } else {
            setLoadingMore(true)
          }

          setError('')

          const params: Record<
            string,
            string
          > = {
            language: 'en-US',
            sort_by:
              'popularity.desc',
            page: String(
              pageNumber
            ),
            include_adult: 'false',
          }

          if (
            selectedGenre !== 0
          ) {
            params.with_genres =
              String(
                selectedGenre
              )
          }

          const data =
            await tmdbFetch<MoviesResponse>(
              '/discover/movie',
              params
            )

          setTotalPages(
            Math.min(
              data.total_pages,
              500
            )
          )

          setMovies(
            (previousMovies) => {
              if (reset) {
                return data.results
              }

              const existingIds =
                new Set(
                  previousMovies.map(
                    (movie) =>
                      movie.id
                  )
                )

              const newMovies =
                data.results.filter(
                  (movie) =>
                    !existingIds.has(
                      movie.id
                    )
                )

              return [
                ...previousMovies,
                ...newMovies,
              ]
            }
          )

          setPage(
            pageNumber
          )
        } catch (error) {
          console.error(
            'Movies loading error:',
            error
          )

          if (reset) {
            setError(
              'Unable to load movies. Please try again.'
            )
          }
        } finally {
          loadingRef.current =
            false

          setLoading(false)
          setLoadingMore(false)
        }
      },
      [selectedGenre]
    )

  useEffect(() => {
    const randomPage =
      getRandomPage()

    setMovies([])
    setPage(
      randomPage
    )

    loadMovies(
      randomPage,
      true
    )
  }, [
    selectedGenre,
    loadMovies,
  ])

  useEffect(() => {
    const loader =
      loaderRef.current

    if (!loader) {
      return
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const firstEntry =
            entries[0]

          if (
            !firstEntry?.isIntersecting
          ) {
            return
          }

          if (
            loadingRef.current
          ) {
            return
          }

          if (
            page >= totalPages
          ) {
            return
          }

          loadMovies(
            page + 1,
            false
          )
        },
        {
          rootMargin:
            '700px',
        }
      )

    observer.observe(loader)

    return () => {
      observer.disconnect()
    }
  }, [
    page,
    totalPages,
    loadMovies,
  ])

  const handleGenreChange = (
    genreId: number
  ) => {
    if (genreId === 0) {
      setSearchParams({})
    } else {
      setSearchParams({
        genre: String(
          genreId
        ),
      })
    }
  }

  const selectedGenreName =
    genres.find(
      (genre) =>
        genre.id ===
        selectedGenre
    )?.name || 'All'

  if (loading) {
    return (
      <main className="movies-page">
        <div className="movies-container">

          <header className="movies-header">
            <div>

              <span className="movies-label">
                MOVIE EXPLORER
              </span>

              <h1>
                Explore Movies
              </h1>

              <p>
                Discover popular movies,
                hidden gems and
                unforgettable stories.
              </p>

            </div>
          </header>

          <div className="genre-list">

            {genres.map(
              (genre) => (
                <button
                  key={
                    genre.id
                  }
                  type="button"
                  className={
                    selectedGenre ===
                    genre.id
                      ? 'genre-btn active'
                      : 'genre-btn'
                  }
                  onClick={() =>
                    handleGenreChange(
                      genre.id
                    )
                  }
                >
                  {genre.name}
                </button>
              )
            )}

          </div>

          <section className="movies-grid">

            {Array.from({
              length: 12,
            }).map(
              (_, index) => (
                <div
                  className="movie-skeleton"
                  key={index}
                >
                  <div className="skeleton-poster" />
                  <div className="skeleton-line" />
                  <div className="skeleton-small" />
                </div>
              )
            )}

          </section>

        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="movies-page">

        <div className="movies-message">

          <h2>
            Something went wrong
          </h2>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={() => {
              const randomPage =
                getRandomPage()

              setMovies([])

              loadMovies(
                randomPage,
                true
              )
            }}
          >
            Try Again
          </button>

        </div>

      </main>
    )
  }

  return (
    <main className="movies-page">

      <div className="movies-container">

        <header className="movies-header">

          <div>

            <span className="movies-label">
              MOVIE EXPLORER
            </span>

            <h1>
              {selectedGenreName ===
              'All'
                ? 'Explore Movies'
                : `${selectedGenreName} Movies`}
            </h1>

            <p>
              Discover popular movies,
              hidden gems and
              unforgettable stories.
            </p>

          </div>

        </header>

        <div className="genre-list">

          {genres.map(
            (genre) => (
              <button
                key={
                  genre.id
                }
                type="button"
                className={
                  selectedGenre ===
                  genre.id
                    ? 'genre-btn active'
                    : 'genre-btn'
                }
                onClick={() =>
                  handleGenreChange(
                    genre.id
                  )
                }
              >
                {genre.name}
              </button>
            )
          )}

        </div>

        {movies.length === 0 ? (

          <div className="movies-message">

            <h2>
              No movies found
            </h2>

            <p>
              Try another genre.
            </p>

          </div>

        ) : (

          <>

            <section className="movies-grid">

              {movies.map(
                (movie) => {

                  const poster =
                    movie.poster_path
                      ? `${IMAGE_BASE_URL}${movie.poster_path}`
                      : null

                  const isFavorite =
                    favorites.includes(
                      movie.id
                    )

                  return (
                    <article
                      className="movie-card"
                      key={
                        movie.id
                      }
                    >

                      <div className="movie-poster">

                        <Link
                          to={`/movie/${movie.id}`}
                          className="poster-link"
                        >

                          {poster ? (
                            <img
                              src={poster}
                              alt={
                                movie.title
                              }
                              loading="lazy"
                            />
                          ) : (
                            <div className="no-poster">
                              No Image
                            </div>
                          )}

                          <div className="movie-overlay">

                            <span>
                              View Details
                            </span>

                          </div>

                        </Link>

                        <button
                          type="button"
                          className={
                            isFavorite
                              ? 'movie-favorite active'
                              : 'movie-favorite'
                          }
                          onClick={(
                            event
                          ) =>
                            toggleFavorite(
                              event,
                              movie
                            )
                          }
                          aria-label={
                            isFavorite
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                          title={
                            isFavorite
                              ? 'Remove from favorites'
                              : 'Add to favorites'
                          }
                        >

                          <span>
                            {isFavorite
                              ? '♥'
                              : '♡'}
                          </span>

                        </button>

                      </div>

                      <div className="movie-info">

                        <Link
                          to={`/movie/${movie.id}`}
                          className="movie-title-link"
                        >

                          <h2>
                            {movie.title}
                          </h2>

                        </Link>

                        <div className="movie-meta">

                          <span>
                            ⭐{' '}
                            {movie.vote_average?.toFixed(
                              1
                            ) ||
                              'N/A'}
                          </span>

                          <span>
                            {movie.release_date
                              ? movie.release_date.slice(
                                  0,
                                  4
                                )
                              : 'N/A'}
                          </span>

                        </div>

                      </div>

                    </article>
                  )
                }
              )}

            </section>

            <div
              ref={loaderRef}
              className="infinite-loader"
              aria-hidden="true"
            >

              {loadingMore && (
                <>
                  <span className="loader-spinner" />

                  <span>
                    Loading more movies...
                  </span>
                </>
              )}

            </div>

          </>

        )}

      </div>

    </main>
  )
}

export default Movies
