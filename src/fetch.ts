let fetchCounter = 0
export const appFetch = async (url: string, options: RequestInit = {}) => {
  fetchCounter++
  console.log(`Fetching [${fetchCounter}] ${url}...`)
  return fetch(url, options)
}
