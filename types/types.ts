export type Movie = {
  MovieId: number;
  Title: string;
  Year: number;
}

export type User = {
  UserId: number;
  Name: string;
}

export type Rating = {
  UserId: number;
  MovieId: number;
  Rating: number;
}