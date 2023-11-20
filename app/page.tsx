import { RecommendationSystem } from '@/components/recommendation-system'

export default async function Home() {
  const results = await fetch('http://localhost:3000/api')
  const { users, movies } = await results.json()


  return (
    <main className="flex flex-col items-center justify-between p-8">
      <RecommendationSystem users={users} movies={movies} />
    </main>
  )
}
/*, { cache: 'force-cache' }*/