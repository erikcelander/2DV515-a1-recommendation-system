import { RecommendationSystem } from '@/components/recommendation-system'

export default async function Home() {
  const results = await fetch('http://localhost:3000/api')
  const { users, movies, ratings } = await results.json()
  console.log(users)
  console.log(movies)
  console.log(ratings)


  return (
    <main className="flex flex-col items-center justify-between p-8">
      <RecommendationSystem users={users} movies={movies} ratings={ratings} />
    </main>
  )
}
/*, { cache: 'force-cache' }*/