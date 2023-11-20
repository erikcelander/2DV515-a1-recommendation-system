import { RecommendationSystem } from '@/components/recommendation-system'
import { fetchData } from '@/lib/data-fetching'

export default async function Home() {
  const { users, movies } = await fetchData()

  return (
    <main className="flex flex-col items-center justify-between p-8">
      <RecommendationSystem users={users} movies={movies} />
    </main>
  )
}
