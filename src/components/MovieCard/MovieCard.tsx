import { Link } from 'react-router-dom'
import type { TMDBMovie } from '../../services/tmdb/movies'
import './MovieCard.css'

type MovieCardProps = {
  movie: TMDBMovie
}

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500'

function MovieCard({ movie }: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `${IMAGE_BASE_URL}${movie.poster_path}`
    : '/placeholder-movie.png'

  const year = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'N/A'

  const rating = Number.isFinite(movie.vote_average)
    ? movie.vote_average.toFixed(1)
    : 'N/A'

  return (
    <article className="movie-card">

      {/* =========================
          POSTER
      ========================= */}

      <Link
        to={`/movie/${movie.id}`}
        className="movie-poster"
      >
        <img
          src={posterUrl}
          alt={movie.title}
          loading="lazy"
        />
      </Link>

      {/* =========================
          INFORMATION
      ========================= */}

      <div className="movie-card-info">

        <div className="movie-title-row">

          <h3 title={movie.title}>
            {movie.title}
          </h3>

          <span className="movie-rating">
            ⭐ {rating}
          </span>

        </div>

        <div className="movie-year">
          {year}
        </div>

        {/* =========================
            ONLY ONE DETAILS BUTTON
        ========================= */}

        <div className="movie-actions">

          <Link
            to={`/movie/${movie.id}`}
            className="details-btn"
          >
            View Details
          </Link>

        </div>

      </div>

    </article>
  )
}

export default MovieCard