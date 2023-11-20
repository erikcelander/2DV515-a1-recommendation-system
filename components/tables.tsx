import * as React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { SimilarityScore, RecommendedMovieScore } from '@/lib/types'

type UserTableProps = {
  scores: SimilarityScore[]
}

export const UserTable: React.FC<UserTableProps> = ({ scores }) => (
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
        {scores.map(score => (
          <TableRow key={score.id}>
            <TableCell>{score.id}</TableCell>
            <TableCell>{score.name}</TableCell>
            <TableCell>{score.score.toFixed(4)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
)

type MovieTableProps = {
  movieScores: RecommendedMovieScore[]
}

export const MovieTable: React.FC<MovieTableProps> = ({ movieScores }) => (
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
