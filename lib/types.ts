export type Movie = {
  MovieId: number
  Title: string
  Year: number
}

export type MovieRating = {
  Title: string
  Rating: number
}

export type User = {
  UserId: number
  Name: string
  Ratings: MovieRating[]
}

export type SimilarityScore = {
  id: number
  name: string
  score: number
}

export type MovieScore = {
  [MovieId: number]: {
    sum: number
    count: number
  }
}

export type RecommendedMovieScore = {
  movie: Movie
  score: number
  id: number
}

type FooterContentType = 'user' | 'movie'

export type FooterContent = {
  type: FooterContentType
  data: SimilarityScore[] | RecommendedMovieScore[]
}