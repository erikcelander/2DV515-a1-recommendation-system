import { User, Movie } from './types';

export async function fetchData(): Promise<{ users: User[], movies: Movie[] }> {
  const url = process.env.NODE_ENV === 'development' ? 'http://localhost:3000/api/data' : `https://${process.env.VERCEL_URL}/api/data`;
  const results = await fetch(url);
  const data = await results.json();
  return data as { users: User[], movies: Movie[] };
}