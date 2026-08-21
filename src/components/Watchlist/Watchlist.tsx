
import { useEffect, useState } from 'react'
import type { TMDBMovie } from '../../services/tmdb/movies'
import MovieCard from '../MovieCard/MovieCard'
import './Watchlist.css'

const WATCHLIST_KEY = 'movie-explorer-watchlist'

function Watchlist() {
  const [movies, setMovies] = useState<TMDBMovie[]>([])

  const loadWatchlist = () => {
    try {
      const saved = localStorage.getItem(WATCHLIST_KEY)

      if (!saved) {
        setMovies([])
        return
      }

      setMovies(JSON.parse(saved) as TMDBMovie[])
    } catch (error) {
      console.error('Watchlist error:', error)
      setMovies([])
    }
  }

  useEffect(() => {
    loadWatchlist()

    const handleUpdate = () => {
      loadWatchlist()
    }

    window.addEventListener(
      'watchlistUpdated',
      handleUpdate
    )

    return () => {
      window.removeEventListener(
        'watchlistUpdated',
        handleUpdate
      )
    }
  }, [])

  return (
    <main className="watchlist-page">

      <div className="watchlist-container">

        <header className="watchlist-header">
          <span>YOUR COLLECTION</span>

          <h1>My Watchlist</h1>

          <p>
            Movies you've saved to watch later.
          </p>
        </header>

        {movies.length === 0 ? (
          <section className="watchlist-empty">
            <div className="empty-icon">＋</div>

            <h2>Your watchlist is empty</h2>

            <p>
              Start exploring movies and add
              something you want to watch later.
            </p>
          </section>
        ) : (
          <>
            <div className="watchlist-count">
              {movies.length}{' '}
              {movies.length === 1
                ? 'movie'
                : 'movies'}{' '}
              saved
            </div>

            <div className="watchlist-grid">
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                />
              ))}
            </div>
          </>
        )}

      </div>

    </main>
  )
}

export default Watchlist

