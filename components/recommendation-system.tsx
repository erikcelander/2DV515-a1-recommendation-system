"use client"
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from '@/components/ui/separator'
import { User, Movie, Rating } from "@/lib/types"

type EuclideanScore = {
  id: number
  score: number
}

type UserSimilarity = {
  user: User
  similarity: number
}

type MovieScore = {
  [MovieId: number]: {
    sum: number
    count: number
  }
}

type RecommendedMovieScore = {
  movie: Movie
  score: number
}

export function RecommendationSystem({  users, movies, ratings }: {  users: User[], movies: Movie[], ratings: Rating[]}) {
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedResults, setSelectedResults] = useState<number>(NaN)
  const [footerContent, setFooterContent] = useState<React.ReactNode>(null)

  const resultsOptions = Array.from({ length: 10 }, (_, i) => i + 1)



  const handleFindUsersClick = () => {
    const selectedUser = users.find((user) => user.Name === selectedName)
    if (!selectedUser) return
    const scores = users.map((user) => ({
      id: user.UserId,
      score: calculateEuclideanDistance(selectedUser, user),
    }))
    scores.sort((a, b) => a.score - b.score)
    setFooterContent(renderUserTable(scores.slice(0, selectedResults)))
  }

  const calculateEuclideanDistance = (userA: User, userB: User): number => {
    const ratingsA = ratings.filter((rating) => rating.UserId === userA.UserId)
    const ratingsB = ratings.filter((rating) => rating.UserId === userB.UserId)

    const commonMovies = ratingsA.map(ra => ra.MovieId).filter(movieId => ratingsB.some(rb => rb.MovieId === movieId))

    let sumSquares = 0
    for (const movieId of commonMovies) {
      const ratingA = ratingsA.find((r) => r.MovieId === movieId)?.Rating
      const ratingB = ratingsB.find((r) => r.MovieId === movieId)?.Rating
      if (ratingA !== undefined && ratingB !== undefined) {
        sumSquares += (ratingA - ratingB) ** 2
      }
    }

    return commonMovies.length > 0 ? 1 / (1 + Math.sqrt(sumSquares)) : 0
  }

  const renderUserTable = (scores: EuclideanScore[]) => (
    <>
      <Separator className='m-4' />
      <Table>
        <TableCaption>Similar users</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {scores.map((score) => (
            <TableRow key={score.id}>
              <TableCell>{score.id}</TableCell>
              <TableCell>{users.find((u) => u.UserId === score.id)?.Name}</TableCell>
              <TableCell>{score.score.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )

  const findRecommendedMovies = (selectedUser: User, numberOfResults: number, users: User[], ratings: Rating[], movies: Movie[]): RecommendedMovieScore[] => {
    console.log('Starting recommendation process for user:', selectedUser.Name);
    console.log(numberOfResults)
    console.log('Available movies:', movies);
    const scores: UserSimilarity[] = users
      .filter(user => user.UserId !== selectedUser.UserId)
      .map(user => {
        const similarity = calculateEuclideanDistance(selectedUser, user);
        console.log(`Similarity between ${selectedUser.Name} and ${user.Name}:`, similarity);
        return { user, similarity };
      })
      .sort((a, b) => b.similarity - a.similarity);
  
    let movieScores: MovieScore = {};
  
    console.log('Users sorted by similarity:', scores.map(s => ({ UserId: s.user.UserId, Similarity: s.similarity })));
  
    scores.forEach(({ user, similarity }) => {
      ratings
        .filter(rating => rating.UserId === user.UserId)
        .forEach(({ MovieId, Rating }) => {
          console.log(`Processing rating by user ${user.Name} for movie ID ${MovieId} with rating ${Rating}`);
          if (!movieScores[MovieId]) {
            movieScores[MovieId] = { sum: 0, count: 0 };
            console.log(`Initialising score for movie ID ${MovieId}`);
          }
          if (!ratings.some(r => r.UserId === selectedUser.UserId && r.MovieId === MovieId)) {
            movieScores[MovieId].sum += Rating * similarity;
            movieScores[MovieId].count += similarity;
            console.log(`Updated movie score for ID ${MovieId}:`, movieScores[MovieId]);
          }
        });
    });
  
    console.log('Movie scores before mapping:', movieScores)
    const recommendedMovieScores = Object.keys(movieScores)
    .map(movieIdStr => {
      const movieId = parseInt(movieIdStr);
      console.log(movieId)
      const movieScore = movieScores[movieId];
      if (movieScore.count === 0) {
        console.log(`Skipping movie ID ${movieId} due to zero count`);
        return null; // Avoid division by zero
      }
      const score = movieScore.sum / movieScore.count;
      const movie = movies.find(m => m.MovieId === movieId);
      console.log(`Calculated score for movie ID ${movieId}:`, score);
      console.log(`Movie found for ID ${movieId}:`, movie); // This will log the movie object if found

      return movie ? { movie, score } : null;
    })
    .filter((item): item is RecommendedMovieScore => item !== null);

  // Log the full list of recommended scores before slicing
  console.log('Recommended movie scores before slicing:', recommendedMovieScores);

  // Ensure numberOfResults is a positive integer
  console.log('Number of results requested:', numberOfResults);

  // Slice the array to get the top N results
  const topRecommendedMovieScores = recommendedMovieScores
    .sort((a, b) => b.score - a.score)
    .slice(0, numberOfResults);

  // Log the final recommended movies
  console.log('Final recommended movies:', topRecommendedMovieScores);

  return topRecommendedMovieScores;
  };
  
  const handleFindRecommendedMoviesClick = () => {
    const selectedUser = users.find(user => user.Name === selectedName);
    if (!selectedUser || isNaN(selectedResults)) return;
  
    const recommendedMovieScores = findRecommendedMovies(selectedUser, selectedResults, users, ratings, movies);
    setFooterContent(renderMovieTable(recommendedMovieScores));
  };
  
  const renderMovieTable = (movieScores: RecommendedMovieScore[]) => (
    <>
      <Separator className='m-4' />
      <Table>
        <TableCaption>Recommended Movies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Score</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movieScores.map(({ movie, score }) => (
            <TableRow key={movie.MovieId}>
              <TableCell>{movie.MovieId}</TableCell>
              <TableCell>{movie.Title}</TableCell>
              <TableCell>{score.toFixed(4)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )

  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Recommendation system</CardTitle>
        <CardDescription>Find recommended movies and similar users.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Select onValueChange={setSelectedName}>
              <SelectTrigger id="name">
                <SelectValue placeholder="Select Name" />
              </SelectTrigger>
              <SelectContent position="popper">
                {users.map((user) => (
                  <SelectItem key={user.UserId} value={user.Name}>{user.Name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="results">Results</Label>
            <Select onValueChange={(value) => setSelectedResults(Number(value))}>
              <SelectTrigger id="results">
                <SelectValue placeholder="Select amount of results" />
              </SelectTrigger>
              <SelectContent position="popper">
                {resultsOptions.map((number) => (
                  <SelectItem key={number} value={String(number)}>{number}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>

      <div className="flex justify-around">
        <Button variant="outline" className='ml-3' onClick={handleFindUsersClick}>
          Find top matching users
        </Button>
        <Button className='mr-3' onClick={handleFindRecommendedMoviesClick}>
          Find recommended movies
        </Button>
      </div>

      <CardFooter className='flex flex-col'>
        {footerContent}
      </CardFooter>
    </Card>
  )
}
