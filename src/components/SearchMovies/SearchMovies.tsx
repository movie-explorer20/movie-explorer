import { useState } from 'react'
import { tmdbFetch } from '../../services/tmdb/client'
import type { TMDBMovie } from '../../services/tmdb/movies'
import MovieCard from '../MovieCard/MovieCard'
import './SearchMovies.css'

function SearchMovies() {
  const [query, setQuery] = useState('')
  const [movies, setMovies] = useState<TMDBMovie[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch() {
    if (!query.trim()) {
      setMovies([])
      return
    }

    try {
      setLoading(true)
      setError('')

      const data = await tmdbFetch<{
        results: TMDBMovie[]
      }>('/search/movie', {
        query: query.trim(),
        language: 'en-US',
        page: '1',
      })

      setMovies(data.results)
    } catch (error) {
      console.error(error)
      setError('We could not load the search results.')
      setMovies([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="search-page">
      <div className="search-container">

        {/* HEADER */}

        <header className="search-header">

          <span className="search-label">
            MOVIE EXPLORER
          </span>

          <h1>
            Search <span>Movies</span>
          </h1>

          <p className="search-description">
            Find your favorite movies and discover
            something new to watch.
          </p>

        </header>

        {/* SEARCH BOX */}

        <div className="search-box">

          <div className="search-input-wrapper">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search for a movie..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSearch()
                }
              }}
              aria-label="Search movies"
            />

            {query && (
              <button
                type="button"
                className="clear-search"
                onClick={() => {
                  setQuery('')
                  setMovies([])
                  setError('')
                }}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

          <button
            type="button"
            className="search-button"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="search-button-spinner" />
                Searching
              </>
            ) : (
              <>
                <span>Search</span>
                <span className="search-arrow">
                  →
                </span>
              </>
            )}
          </button>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="search-status">

            <span className="status-spinner" />

            <span>
              Searching for movies...
            </span>

          </div>
        )}

        {/* ERROR */}

        {error && !loading && (
          <div className="search-error">

            <div className="error-icon">
              !
            </div>

            <div>
              <strong>
                Search failed
              </strong>

              <p>
                {error}
              </p>
            </div>

          </div>
        )}

        {/* RESULTS */}

        {!loading &&
          !error &&
          movies.length > 0 && (
            <section className="search-results">

              <div className="results-header">

                <div>
                  <span className="results-label">
                    RESULTS
                  </span>

                  <h2>
                    Search Results
                  </h2>
                </div>

                <span className="results-count">
                  {movies.length}{' '}
                  {movies.length === 1
                    ? 'Movie'
                    : 'Movies'}
                </span>

              </div>

              <div className="search-grid">
                {movies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                  />
                ))}
              </div>

            </section>
          )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          query.trim() &&
          movies.length === 0 && (
            <div className="empty-search">

              <div className="empty-search-icon">
                🔎
              </div>

              <h2>
                No movies found
              </h2>

              <p>
                We couldn't find anything for
                <strong> "{query}"</strong>.
                Try another title.
              </p>

              <button
                type="button"
                onClick={() => {
                  setQuery('')
                  setMovies([])
                }}
              >
                Clear Search
              </button>

            </div>
          )}

        {/* INITIAL STATE */}

        {!loading &&
          !error &&
          !query.trim() &&
          movies.length === 0 && (
            <div className="search-welcome">

              <div className="welcome-icon">
                ✦
              </div>

              <h2>
                What do you want to watch?
              </h2>

              <p>
                Search for a movie title above
                to explore the collection.
              </p>

            </div>
          )}

      </div>
    </main>
  )
}

export default SearchMovies