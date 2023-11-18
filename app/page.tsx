import { SelectCard } from '@/components/select-card'

export default function Home() {
  const sampleUsers = [
    { UserId: 1, Name: 'Alice Smith' },
    { UserId: 2, Name: 'Bob Johnson' },
    { UserId: 3, Name: 'Charlie Brown' },
  ];

  const sampleMovies = [
    { MovieId: 1, Title: 'Inception', Year: 2010 },
    { MovieId: 2, Title: 'The Matrix', Year: 1999 },
    { MovieId: 3, Title: 'Interstellar', Year: 2014 },
  ];

  // Pass the sample data as props to SelectCard
  return (
    <main className="flex flex-col items-center justify-between p-24">
      <SelectCard users={sampleUsers} movies={sampleMovies} />
    </main>
  );
}
