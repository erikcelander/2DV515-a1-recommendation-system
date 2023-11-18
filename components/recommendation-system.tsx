"use client"
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Separator } from '@/components/ui/separator'

import { User, Movie, Rating } from "@/types/types"

type EuclideanScore = {
  id: number
  score: number
}

export function RecommendationSystem({ users, movies, ratings }: { users: User[], movies: Movie[], ratings: Rating[] }) {
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedMovie, setSelectedMovie] = useState<string>('')
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
        <TableCaption>Similar Users</TableCaption>
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
  return (
    <Card className="w-[450px]">
      <CardHeader>
        <CardTitle>Movie finder</CardTitle>
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
            <Label htmlFor="movie">Movie</Label>
            <Select onValueChange={setSelectedMovie}>
              <SelectTrigger id="movie">
                <SelectValue placeholder="Select Movie" />
              </SelectTrigger>
              <SelectContent position="popper">
                {movies.map((movie) => (
                  <SelectItem key={movie.MovieId} value={movie.Title}>{movie.Title}</SelectItem>
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
        <Button variant="outline" className='ml-3 p-2 h-8' onClick={handleFindUsersClick}>
          Find top matching users
        </Button>
        <Button className='mr-3  p-2 h-8' onClick={() => console.log('test')}>
          Find recommended movies
        </Button>
      </div>

      <CardFooter className='flex flex-col'>
        {footerContent}


      </CardFooter>
    </Card>
  )
}
