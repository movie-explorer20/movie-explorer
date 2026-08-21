import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { TMDBMovie } from '../../services/tmdb/movies'
import './Favorites.css'

const FAVORITES_KEY = 'movie-explorer-favorites'
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

function Favorites() {
  const [favorites, setFavorites] = useState<TMDBMovie[]>([])

  const loadFavorites = () => {
    try {
      const saved = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      )

      setFavorites(Array.isArray(saved) ? saved : [])
    } catch {
      setFavorites([])
    }
  }

  useEffect(() => {
    loadFavorites()

    window.addEventListener('favoritesUpdated', loadFavorites)

    window.addEventListener('storage', loadFavorites)

    return () => {
      window.removeEventListener(
        'favoritesUpdated',
        loadFavorites
      )

      window.removeEventListener(
        'storage',
        loadFavorites
      )
    }
  }, [])

  const removeFavorite = (movieId: number) => {
    const updatedFavorites = favorites.filter(
      (movie) => movie.id !== movieId
    )

    localStorage.setItem(
      FAVORITES_KEY,
      JSON.stringify(updatedFavorites)
    )

    setFavorites(updatedFavorites)

    window.dispatchEvent(
      new Event('favoritesUpdated')
    )
  }

  return (
    <main className="favorites-page">

      <section className="favorites-header">
        <div>
          <span className="favorites-label">
            YOUR COLLECTION
          </span>

          <h1>Favorites</h1>

          <p>
            Your favorite movies are saved here.
          </p>
        </div>

        <div className="favorites-total">
          {favorites.length} Movies
        </div>
      </section>

      {favorites.length === 0 ? (
        <section className="favorites-empty">
          <div className="empty-icon">♥</div>

          <h2>No Favorites Yet</h2>

          <p>
            Add movies to your favorites and they
            will appear here.
          </p>

          <Link to="/movies" className="browse-button">
            Browse Movies
          </Link>
        </section>
      ) : (
        <section className="favorites-grid">
          {favorites.map((movie) => {
            const posterUrl = movie.poster_path
              ? `${IMAGE_BASE_URL}${movie.poster_path}`
              : '/placeholder-movie.png'

            const year = movie.release_date
              ? movie.release_date.slice(0, 4)
              : 'N/A'

            return (
              <article
                className="favorite-card"
                key={movie.id}
              >
                <Link
                  to={`/movie/${movie.id}`}
                  className="favorite-poster"
                >
                  <img
                    src={posterUrl}
                    alt={movie.title}
                  />

                  <div className="favorite-overlay">
                    <span>View Details</span>
                  </div>
                </Link>

                <div className="favorite-info">
                  <div>
                    <h3>{movie.title}</h3>

                    <span className="favorite-year">
                      {year}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="remove-favorite"
                    onClick={() => removeFavorite(movie.id)}
                    title="Remove from favorites"
                  >
                    ♥
                  </button>
                </div>
              </article>
            )
          })}
        </section>
      )}

    </main>
  )
}

export default Favorites