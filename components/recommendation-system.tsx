'use client'
import * as React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UserTable, MovieTable } from '@/components/tables'
import { User, Movie, SimilarityScore, RecommendedMovieScore, FooterContent } from "@/lib/types"
import { findRecommendedMovies, calculateSimilarity } from '@/lib/calculations'

export function RecommendationSystem({ users, movies }: { users: User[], movies: Movie[] }) {
  const [selectedName, setSelectedName] = useState<string>('')
  const [selectedSimilarity, setSelectedSimilarity] = useState<string>('')
  const [selectedResults, setSelectedResults] = useState<number>(NaN)

  const [footerContent, setFooterContent] = useState<FooterContent | null>(null)

  const resultsOptions = Array.from({ length: 10 }, (_, i) => i + 1)
  const similarities = ['Euclidean', 'Pearson']


  const handleFindUsersClick = () => {
    const selectedUser = users.find((user) => user.Name === selectedName)
    if (!selectedUser) return

    const scores: SimilarityScore[] = users
      .filter((user) => user.UserId !== selectedUser.UserId)
      .map((user) => ({
        id: user.UserId,
        name: user.Name,
        score: calculateSimilarity(selectedUser, user, selectedSimilarity),
      }))
      .sort((a, b) => b.score - a.score)

    setFooterContent({
      type: 'user',
      data: scores.slice(0, selectedResults)
    })
  }

  const handleFindRecommendedMoviesClick = () => {
    const selectedUser = users.find(user => user.Name === selectedName)
    if (!selectedUser || isNaN(selectedResults) || selectedResults === 0) return

    const recommendedMovieScores = findRecommendedMovies(selectedUser, selectedResults, users, movies, selectedSimilarity)

    setFooterContent({
      type: 'movie',
      data: recommendedMovieScores
    })
  }

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
            <Label htmlFor="results">Similarity</Label>
            <Select onValueChange={(value) => setSelectedSimilarity(value)}>
              <SelectTrigger id="similarity">
                <SelectValue placeholder="Select similarity" />
              </SelectTrigger>
              <SelectContent position="popper">
                {similarities.map((similarity) => (
                  <SelectItem key={similarity} value={similarity}>{similarity}</SelectItem>
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
        {footerContent && footerContent.type === 'user' && (
          <UserTable scores={footerContent.data as SimilarityScore[]} />
        )}
        {footerContent && footerContent.type === 'movie' && (
          <MovieTable movieScores={footerContent.data as RecommendedMovieScore[]} />
        )}
      </CardFooter>
    </Card>
  )
}

