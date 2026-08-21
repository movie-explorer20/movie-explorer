import { tmdbFetch } from './client'

/* =====================================================
   MOVIE
===================================================== */

export type TMDBMovie = {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  original_language: string
}

/* =====================================================
   TV SHOW
===================================================== */

export type TMDBTV = {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  original_language: string
}

/* =====================================================
   GENRE
===================================================== */

export type TMDBGenre = {
  id: number
  name: string
}

/* =====================================================
   PRODUCTION COMPANY
===================================================== */

export type TMDBProductionCompany = {
  id: number
  name: string
  logo_path: string | null
}

/* =====================================================
   MOVIE DETAILS
===================================================== */

export type TMDBMovieDetails = TMDBMovie & {
  tagline: string
  runtime: number | null
  genres: TMDBGenre[]
  budget: number
  revenue: number
  production_companies: TMDBProductionCompany[]
}

/* =====================================================
   CAST
===================================================== */

export type TMDBCastMember = {
  id: number
  name: string
  character: string
  profile_path: string | null
}

/* =====================================================
   VIDEO
===================================================== */

export type TMDBVideo = {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

/* =====================================================
   API RESPONSES
===================================================== */

type MovieResponse = {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

type TVResponse = {
  page: number
  results: TMDBTV[]
  total_pages: number
  total_results: number
}

type CreditsResponse = {
  id: number
  cast: TMDBCastMember[]
}

type VideosResponse = {
  id: number
  results: TMDBVideo[]
}

/* =====================================================
   POPULAR MOVIES
===================================================== */

export function getPopularMovies(
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    '/movie/popular',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   TRENDING MOVIES
===================================================== */

export function getTrendingMovies(
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    '/trending/movie/week',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   HOT / NOW PLAYING MOVIES
===================================================== */

export function getHotMovies(
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    '/movie/now_playing',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   TOP RATED MOVIES
===================================================== */

export function getTopRatedMovies(
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    '/movie/top_rated',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   UPCOMING MOVIES
===================================================== */

export function getUpcomingMovies(
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    '/movie/upcoming',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   POPULAR TV SHOWS
===================================================== */

export function getPopularTVShows(
  page = 1
) {
  return tmdbFetch<TVResponse>(
    '/tv/popular',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   TRENDING TV SHOWS
===================================================== */

export function getTrendingTVShows(
  page = 1
) {
  return tmdbFetch<TVResponse>(
    '/trending/tv/week',
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

/* =====================================================
   MOVIE DETAILS
===================================================== */

export function getMovieDetails(
  id: number | string
) {
  return tmdbFetch<TMDBMovieDetails>(
    `/movie/${id}`,
    {
      language: 'en-US',
    }
  )
}

/* =====================================================
   MOVIE CREDITS / CAST
===================================================== */

export function getMovieCredits(
  id: number | string
) {
  return tmdbFetch<CreditsResponse>(
    `/movie/${id}/credits`,
    {
      language: 'en-US',
    }
  )
}

/* =====================================================
   MOVIE VIDEOS / TRAILERS
===================================================== */

export function getMovieVideos(
  id: number | string
) {
  return tmdbFetch<VideosResponse>(
    `/movie/${id}/videos`,
    {
      language: 'en-US',
    }
  )
}

/* =====================================================
   SIMILAR MOVIES
===================================================== */

export function getSimilarMovies(
  id: number | string,
  page = 1
) {
  return tmdbFetch<MovieResponse>(
    `/movie/${id}/similar`,
    {
      language: 'en-US',
      page: String(page),
    }
  )
}

