import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { Movie, User, MovieRating } from '@/lib//types'

export async function GET() {
  const path = 'data/movies_large'
  const rawMovies = readAndParseCSV(`${path}/movies.csv`)
  const rawUsers = readAndParseCSV(`${path}/users.csv`)
  const rawRatings = readAndParseCSV(`${path}/ratings.csv`)

  const { movies, users } = convertDataToTypes(rawMovies, rawUsers, rawRatings)

  const data = { movies, users }

  return Response.json(data)
}

function readAndParseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

  const data = parse(content, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';'
  })
  return data
}



function convertDataToTypes(rawMovies: any[], rawUsers: any[], rawRatings: any[]): { users: User[], movies: Movie[] } {
  const movies: Movie[] = []
  const moviesMap = new Map<number, string>()

  rawMovies.forEach((rawMovie) => {
    const movieId = parseInt(rawMovie.MovieId)
    const movie = {
      MovieId: movieId,
      Title: rawMovie.Title,
      Year: parseInt(rawMovie.Year),
    }
    movies.push(movie)
    moviesMap.set(movieId, rawMovie.Title)
  })

  const ratingsGroupedByUser: { [key: number]: MovieRating[] } = {}
  rawRatings.forEach((rawRating) => {
    const userId = parseInt(rawRating.UserId)
    const movieId = parseInt(rawRating.MovieId)
    const movieTitle = moviesMap.get(movieId)

    const rating: MovieRating = {
      Title: movieTitle || 'Unknown Title',
      Rating: parseFloat(rawRating.Rating),
    }

    if (!ratingsGroupedByUser[userId]) {
      ratingsGroupedByUser[userId] = []
    }

    ratingsGroupedByUser[userId].push(rating)
  })

  const users: User[] = rawUsers.map((rawUser) => ({
    UserId: parseInt(rawUser.UserId),
    Name: rawUser.Name,
    Ratings: ratingsGroupedByUser[parseInt(rawUser.UserId)] || [],
  }))

  return { users, movies }
}
