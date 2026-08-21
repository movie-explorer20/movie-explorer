import { useEffect, useRef, useState } from 'react'
import MovieCard from '../MovieCard/MovieCard'

import {
  getHotMovies,
  getTrendingMovies,
  getPopularTVShows,
  type TMDBMovie,
  type TMDBTV,
} from '../../services/tmdb/movies'

import './TrendingMovies.css'

/* =====================================================
   SECTION TYPES
===================================================== */

type MovieSectionProps = {
  title: string
  subtitle: string
  movies: TMDBMovie[]
  loading: boolean
  onLoadMore: () => void
  hasMore: boolean
}

/* =====================================================
   MOVIE SECTION
===================================================== */

function MovieSection({
  title,
  subtitle,
  movies,
  loading,
  onLoadMore,
  hasMore,
}: MovieSectionProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null)

  const handleScroll = () => {
    const element = scrollRef.current

    if (!element || loading || !hasMore) {
      return
    }

    const remaining =
      element.scrollWidth -
      element.scrollLeft -
      element.clientWidth

    if (remaining < 500) {
      onLoadMore()
    }
  }

  return (
    <section className="trend-section">

      {/* HEADER */}

      <div className="trend-section-header">

        <div>
          <span className="trend-section-label">
            MOVIE EXPLORER
          </span>

          <h2>{title}</h2>

          <p>{subtitle}</p>
        </div>

        <div className="scroll-hint">
          ← Scroll →
        </div>

      </div>

      {/* MOVIES */}

      <div
        className="movie-horizontal-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >

        {movies.map((movie) => (
          <div
            className="movie-slide"
            key={movie.id}
          >
            <MovieCard movie={movie} />
          </div>
        ))}

        {/* LOADING MORE */}

        {loading && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                className="movie-slide"
                key={`loading-${item}`}
              >
                <div className="movie-skeleton">
                  <div className="skeleton-shimmer" />
                </div>
              </div>
            ))}
          </>
        )}

      </div>

    </section>
  )
}

/* =====================================================
   TV SECTION
===================================================== */

function TVSection() {
  const [shows, setShows] = useState<TMDBTV[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  const scrollRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    loadShows(1)
  }, [])

  async function loadShows(nextPage: number) {
    if (!hasMore && nextPage !== 1) {
      return
    }

    try {
      setLoading(true)

      const data =
        await getPopularTVShows(nextPage)

      setShows((previous) =>
        nextPage === 1
          ? data.results
          : [...previous, ...data.results]
      )

      setPage(nextPage)

      setHasMore(
        nextPage < data.total_pages
      )
    } catch (error) {
      console.error(
        'TV shows error:',
        error
      )
    } finally {
      setLoading(false)
    }
  }

  const handleScroll = () => {
    const element = scrollRef.current

    if (!element || loading || !hasMore) {
      return
    }

    const remaining =
      element.scrollWidth -
      element.scrollLeft -
      element.clientWidth

    if (remaining < 500) {
      loadShows(page + 1)
    }
  }

  return (
    <section className="trend-section">

      <div className="trend-section-header">

        <div>
          <span className="trend-section-label">
            TV SERIES
          </span>

          <h2>Popular Serials</h2>

          <p>
            Popular TV shows people are watching
          </p>
        </div>

        <div className="scroll-hint">
          ← Scroll →
        </div>

      </div>

      <div
        className="movie-horizontal-scroll"
        ref={scrollRef}
        onScroll={handleScroll}
      >

        {shows.map((show) => (
          <div
            className="movie-slide"
            key={show.id}
          >

            <article className="movie-card tv-card">

              <div className="movie-poster">

                {show.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${show.poster_path}`}
                    alt={show.name}
                    loading="lazy"
                  />
                ) : (
                  <div className="poster-placeholder">
                    No Image
                  </div>
                )}

              </div>

              <div className="movie-card-info">

                <div className="movie-title-row">

                  <h3 title={show.name}>
                    {show.name}
                  </h3>

                  <span className="movie-rating">
                    ⭐{' '}
                    {show.vote_average.toFixed(1)}
                  </span>

                </div>

                <div className="movie-year">
                  {show.first_air_date
                    ? show.first_air_date.slice(0, 4)
                    : 'N/A'}
                </div>

              </div>

            </article>

          </div>
        ))}

        {loading && (
          <>
            {[1, 2, 3].map((item) => (
              <div
                className="movie-slide"
                key={`tv-loading-${item}`}
              >
                <div className="movie-skeleton">
                  <div className="skeleton-shimmer" />
                </div>
              </div>
            ))}
          </>
        )}

      </div>

    </section>
  )
}

/* =====================================================
   MAIN COMPONENT
===================================================== */

function TrendingMovies() {

  /* HOT MOVIES */

  const [hotMovies, setHotMovies] =
    useState<TMDBMovie[]>([])

  const [hotPage, setHotPage] =
    useState(1)

  const [hotLoading, setHotLoading] =
    useState(true)

  const [hotHasMore, setHotHasMore] =
    useState(true)

  /* TRENDING */

  const [trendingMovies, setTrendingMovies] =
    useState<TMDBMovie[]>([])

  const [trendingPage, setTrendingPage] =
    useState(1)

  const [trendingLoading, setTrendingLoading] =
    useState(true)

  const [trendingHasMore, setTrendingHasMore] =
    useState(true)

  /* =====================================================
     INITIAL LOAD
  ===================================================== */

  useEffect(() => {
    loadHotMovies(1)
    loadTrendingMovies(1)
  }, [])

  /* =====================================================
     HOT MOVIES
  ===================================================== */

  async function loadHotMovies(
    nextPage: number
  ) {
    if (!hotHasMore && nextPage !== 1) {
      return
    }

    try {
      setHotLoading(true)

      const data =
        await getHotMovies(nextPage)

      setHotMovies((previous) =>
        nextPage === 1
          ? data.results
          : [...previous, ...data.results]
      )

      setHotPage(nextPage)

      setHotHasMore(
        nextPage < data.total_pages
      )
    } catch (error) {
      console.error(
        'Hot movies error:',
        error
      )
    } finally {
      setHotLoading(false)
    }
  }

  /* =====================================================
     TRENDING MOVIES
  ===================================================== */

  async function loadTrendingMovies(
    nextPage: number
  ) {
    if (
      !trendingHasMore &&
      nextPage !== 1
    ) {
      return
    }

    try {
      setTrendingLoading(true)

      const data =
        await getTrendingMovies(nextPage)

      setTrendingMovies((previous) =>
        nextPage === 1
          ? data.results
          : [...previous, ...data.results]
      )

      setTrendingPage(nextPage)

      setTrendingHasMore(
        nextPage < data.total_pages
      )
    } catch (error) {
      console.error(
        'Trending movies error:',
        error
      )
    } finally {
      setTrendingLoading(false)
    }
  }

  /* =====================================================
     INITIAL LOADING
  ===================================================== */

  if (
    hotLoading &&
    hotMovies.length === 0 &&
    trendingMovies.length === 0
  ) {
    return (
      <section className="trending">

        <div className="trending-page-header">

          <span>
            MOVIE EXPLORER
          </span>

          <h1>
            Discover what to watch
          </h1>

          <p>
            Loading movies and TV shows...
          </p>

        </div>

        <div className="initial-loading">
          <div className="big-spinner" />
        </div>

      </section>
    )
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <section className="trending">

      {/* PAGE HEADER */}

      <div className="trending-page-header">

        <span>
          MOVIE EXPLORER
        </span>

        <h1>
          Discover what to watch
        </h1>

        <p>
          Explore the hottest movies, trending
          titles and popular TV series.
        </p>

      </div>

      {/* HOT MOVIES */}

      <MovieSection
        title="Hot Movies"
        subtitle="Movies currently playing and getting attention"
        movies={hotMovies}
        loading={hotLoading}
        hasMore={hotHasMore}
        onLoadMore={() =>
          loadHotMovies(hotPage + 1)
        }
      />

      {/* TRENDING */}

      <MovieSection
        title="Trending Movies"
        subtitle="Popular movies people are watching this week"
        movies={trendingMovies}
        loading={trendingLoading}
        hasMore={trendingHasMore}
        onLoadMore={() =>
          loadTrendingMovies(
            trendingPage + 1
          )
        }
      />

      {/* TV */}

      <TVSection />

    </section>
  )
}

export default TrendingMovies