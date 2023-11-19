import fs from 'fs'
import { parse } from 'csv-parse/sync'
import { Movie, User, Rating } from '@/lib//types'

// API route handler
export async function GET() {

  const rawMovies = readAndParseCSV('data/movies_large/movies.csv')
  const rawUsers = readAndParseCSV('data/movies_large/users.csv')
  const rawRatings = readAndParseCSV('data/movies_large/ratings.csv')

  // Convert the raw data to typed data
  const { movies, users, ratings } = convertDataToTypes(rawMovies, rawUsers, rawRatings)

  // Prepare the data to be returned
  const data = { movies, users, ratings }

  // Return the response
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  })

}

function readAndParseCSV(filePath: string): any[] {
  console.log(`Reading file from: ${filePath}`)
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' })

  const data = parse(content, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';'
  })
  return data
}


function convertDataToTypes(rawMovies: any[], rawUsers: any[], rawRatings: any[]): { movies: Movie[], users: User[], ratings: Rating[] } {
  const movies: Movie[] = rawMovies.map((rawMovie) => ({
    MovieId: parseInt(rawMovie.MovieId),
    Title: rawMovie.Title,
    Year: parseInt(rawMovie.Year),
  }))

  const users: User[] = rawUsers.map((rawUser) => ({
    UserId: parseInt(rawUser.UserId),
    Name: rawUser.Name,
  }))

  const ratings: Rating[] = rawRatings.map((rawRating) => ({
    UserId: parseInt(rawRating.UserId),
    MovieId: parseInt(rawRating.MovieId),
    Rating: parseFloat(rawRating.Rating),
  }))

  return { movies, users, ratings }
}
  
