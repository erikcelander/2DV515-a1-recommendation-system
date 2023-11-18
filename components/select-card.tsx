"use client";
import * as React from "react";
import { useState } from 'react';

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { User, Movie } from "@/types/types";

export function SelectCard({ users, movies }: { users: User[], movies: Movie[] }) {
  const [selectedName, setSelectedName] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');
  const [selectedResults, setSelectedResults] = useState('');

  const resultsOptions = Array.from({ length: 10 }, (_, i) => i + 1);

  const handleFindUsersClick = () => {
    console.log({
      name: selectedName,
      movie: selectedMovie,
      results: selectedResults,
    });
  };

  const handleFindMoviesClick = () => {
    console.log({
      name: selectedName,
      movie: selectedMovie,
      results: selectedResults,
    });
  };

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
            <Select onValueChange={setSelectedResults}>
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
      <CardFooter className="flex justify-around">
        <Button variant="outline" onClick={handleFindUsersClick}>
          Find top matching users
        </Button>
        <Button onClick={handleFindMoviesClick}>
          Find recommended movies
        </Button>
      </CardFooter>
    </Card>
  );
}
