import { User, Movie, MovieScore, RecommendedMovieScore } from './types'

export function findRecommendedMovies(selectedUser: User, numberOfResults: number, users: User[], movies: Movie[], selectedSimilarity: string): RecommendedMovieScore[] {
  const scores = users
    .filter(user => user.UserId !== selectedUser.UserId)
    .map(user => ({
      user: user,
      similarity: calculateSimilarity(selectedUser, user, selectedSimilarity)
    }))
    .filter(({ similarity }) => selectedSimilarity !== 'Pearson' || similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)

  let movieScores: MovieScore = {}

  scores.forEach(({ user, similarity }) => {
    user.Ratings.forEach(rating => {
      const movie = movies.find(m => m.Title === rating.Title)
      if (movie && !selectedUser.Ratings.some(r => r.Title === rating.Title)) {
        if (!movieScores[movie.MovieId]) {
          movieScores[movie.MovieId] = { sum: 0, count: 0 }
        }
        movieScores[movie.MovieId].sum += rating.Rating * similarity
        movieScores[movie.MovieId].count += similarity
      }
    })
  })

  return Object.entries(movieScores)
    .map(([movieIdStr, scoreData]) => {
      const movieId = parseInt(movieIdStr)
      const movie = movies.find(m => m.MovieId === movieId)
      return movie ? { movie: movie, score: scoreData.sum / scoreData.count } : null
    })
    .filter((item): item is RecommendedMovieScore => item !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, numberOfResults)
}

export function calculateSimilarity(userA: User, userB: User, method: string): number {
  if (method === 'Euclidean') {
    return calculateEuclideanDistance(userA, userB)
  } else if (method === 'Pearson') {
    return calculatePearsonCorrelation(userA, userB)
  } else {
    return 0
  }
}

function calculateEuclideanDistance(userA: User, userB: User): number {
  const commonMovies = userA.Ratings.filter(ratingA =>
    userB.Ratings.some(ratingB => ratingB.Title === ratingA.Title))

  let sumSquares = 0
  for (const ratingA of commonMovies) {
    const ratingB = userB.Ratings.find(r => r.Title === ratingA.Title)
    if (ratingB !== undefined) {
      sumSquares += (ratingA.Rating - ratingB.Rating) ** 2
    }
  }

  return commonMovies.length > 0 ? 1 / (1 + sumSquares) : 0
}


function calculatePearsonCorrelation(userA: User, userB: User): number {
  const ratingsAMap = new Map(userA.Ratings.map(rating => [rating.Title, rating.Rating]))
  const ratingsBMap = new Map(userB.Ratings.map(rating => [rating.Title, rating.Rating]))

  let ratingsACommon: number[] = []
  let ratingsBCommon: number[] = []

  for (const [title, rating] of Array.from(ratingsAMap)) {
    if (ratingsBMap.has(title)) {
      ratingsACommon.push(rating)
      ratingsBCommon.push(ratingsBMap.get(title)!)
    }
  }

  const n = ratingsACommon.length
  if (n === 0) {
    return 0 // no ratings in common
  }

  let sum1 = 0, sum2 = 0, sum1Sq = 0, sum2Sq = 0, pSum = 0

  for (let i = 0; i < n; i++) {
    sum1 += ratingsACommon[i]
    sum2 += ratingsBCommon[i]
    sum1Sq += ratingsACommon[i] ** 2
    sum2Sq += ratingsBCommon[i] ** 2
    pSum += ratingsACommon[i] * ratingsBCommon[i]
  }

  // calc pearson score
  const num = pSum - (sum1 * sum2 / n)
  const den = Math.sqrt((sum1Sq - sum1 ** 2 / n) * (sum2Sq - sum2 ** 2 / n))

  if (den === 0) {
    return 0 // avoid division by 0
  }

  return num / den
}
