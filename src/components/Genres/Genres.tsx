import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tmdbFetch } from "../../services/tmdb/client";
import "./Genres.css";

interface Genre {
  id: number;
  name: string;
  image?: string;
}

interface GenreResponse {
  genres: {
    id: number;
    name: string;
  }[];
}

interface Movie {
  id: number;
  backdrop_path: string | null;
  poster_path: string | null;
  popularity: number;
  vote_count: number;
}

interface DiscoverResponse {
  results: Movie[];
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w780";

function Genres() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        setError("");

        const genreData = await tmdbFetch<GenreResponse>(
          "/genre/movie/list",
          {
            language: "en-US",
          }
        );

        const usedImages = new Set<string>();

        const genresWithImages = await Promise.all(
          genreData.genres.map(async (genre) => {
            try {
              const movieData =
                await tmdbFetch<DiscoverResponse>(
                  "/discover/movie",
                  {
                    with_genres: String(genre.id),
                    sort_by: "popularity.desc",
                    language: "en-US",
                    include_adult: "false",
                    page: "1",
                  }
                );

              const movies = movieData.results.filter(
                (movie) =>
                  movie.backdrop_path ||
                  movie.poster_path
              );

              let selectedMovie: Movie | undefined;

              for (const movie of movies) {
                const imagePath =
                  movie.backdrop_path ||
                  movie.poster_path;

                if (!imagePath) continue;

                if (!usedImages.has(imagePath)) {
                  selectedMovie = movie;
                  usedImages.add(imagePath);
                  break;
                }
              }

              if (!selectedMovie) {
                selectedMovie = movies[0];

                const fallbackImage =
                  selectedMovie?.backdrop_path ||
                  selectedMovie?.poster_path;

                if (fallbackImage) {
                  usedImages.add(fallbackImage);
                }
              }

              const imagePath =
                selectedMovie?.backdrop_path ||
                selectedMovie?.poster_path;

              return {
                ...genre,
                image: imagePath
                  ? `${IMAGE_BASE_URL}${imagePath}`
                  : undefined,
              };
            } catch (err) {
              console.error(
                `Genre image error: ${genre.name}`,
                err
              );

              return {
                ...genre,
                image: undefined,
              };
            }
          })
        );

        setGenres(genresWithImages);
      } catch (err) {
        console.error(err);
        setError("Unable to load genres.");
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, []);

  if (loading) {
    return (
      <main className="genres-page">
        <div className="genres-container">
          <div className="genres-header">
            <span className="genres-label">
              EXPLORE
            </span>

            <h1>Movie Genres</h1>

            <p>
              Loading your favorite genres...
            </p>
          </div>

          <div className="genres-grid">
            {Array.from({ length: 18 }).map(
              (_, index) => (
                <div
                  className="genre-skeleton"
                  key={index}
                />
              )
            )}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="genres-page">
        <div className="genres-container">
          <h1>Movie Genres</h1>

          <p className="genres-error">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="genres-page">
      <div className="genres-container">

        <div className="genres-header">
          <span className="genres-label">
            EXPLORE
          </span>

          <h1>Movie Genres</h1>

          <p>
            Explore movies from your favorite genres
            and discover something new to watch.
          </p>
        </div>

        <div className="genres-grid">
          {genres.map((genre) => (
            <Link
              key={genre.id}
              to={`/movies?genre=${genre.id}`}
              className="genre-card"
              style={
                genre.image
                  ? {
                      backgroundImage:
                        `url("${genre.image}")`,
                    }
                  : undefined
              }
            >
              <div className="genre-overlay" />

              <div className="genre-content">

                <span className="genre-number">
                  {String(genre.id).padStart(2, "0")}
                </span>

                <span className="genre-name">
                  {genre.name}
                </span>

                <span className="genre-arrow">
                  →
                </span>

              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}

export default Genres;