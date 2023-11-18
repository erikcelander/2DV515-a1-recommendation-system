import fs from 'fs';
import { parse } from 'csv-parse/sync';

type Movie = {
  MovieId: number;
  Title: string;
  Year: number;
}

type User = {
  UserId: number;
  Name: string;
}

type Rating = {
  UserId: number;
  MovieId: number;
  Rating: number;
}

function readAndParseCSV(filePath: string): any[] {
  const content = fs.readFileSync(filePath, { encoding: 'utf-8' });
  const data = parse(content, {
    columns: true,
    skip_empty_lines: true,
    delimiter: ';' 
  });
  return data;
}

// API route handler
export async function GET() {
  const movies: Movie[] = readAndParseCSV('data/movies.csv');
  const users: User[] = readAndParseCSV('data/users.csv');
  const ratings: Rating[] = readAndParseCSV('data/ratings.csv');

  const data = {
    movies,
    users,
    ratings
  };

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
