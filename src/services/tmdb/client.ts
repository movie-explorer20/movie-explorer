const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const BASE_URL = 'https://api.themoviedb.org/3'

export async function tmdbFetch<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const url = new URL(`${BASE_URL}${endpoint}`)

  url.searchParams.set('api_key', API_KEY)

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`)
  }

  return response.json()
}