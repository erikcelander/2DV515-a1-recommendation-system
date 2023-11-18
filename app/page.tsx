import { RecommendationSystem } from '@/components/recommendation-system'

export default async function Home() {
  'use server'
  const results = await fetch('http://localhost:3000/api')
  const { users, movies, ratings } = await results.json()


  return (
    <main className="flex flex-col items-center justify-between p-24">
      <RecommendationSystem users={users} movies={movies} ratings={ratings}/>
    </main>
  )
}
