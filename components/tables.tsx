import * as React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SimilarityScore, RecommendedMovieScore } from '@/lib/types'
import { Separator } from '@/components/ui/separator'

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
          <TableHead className="w-1/6 text-left">ID</TableHead>
          <TableHead className="w-2/3">Name</TableHead>
          <TableHead className="w-1/6 text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {scores.map(score => (
          <TableRow key={score.id}>
            <TableCell className="text-left">{score.id}</TableCell>
            <TableCell>{score.name}</TableCell>
            <TableCell className="text-right">{score.score.toFixed(4)}</TableCell>
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
      <TableCaption>Recommended movies</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-1/6 text-left">ID</TableHead>
          <TableHead className="w-2/3">Name</TableHead>
          <TableHead className="w-1/6 text-right">Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {movieScores.map(({ movie, score }) => (
          <TableRow key={movie.MovieId}>
            <TableCell className="text-left">{movie.MovieId}</TableCell>
            <TableCell>{movie.Title}</TableCell>
            <TableCell className="text-right">{score.toFixed(4)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>
)
