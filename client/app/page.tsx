'use client'

import {useQuery} from "@tanstack/react-query";
import {apiClient} from "@/lib/apiClient";

export default function Home() {
  const {data, isLoading, isError} = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => apiClient('/dashboard/stats')
  })

  return (
      <main>
        {isLoading && (
            <div>Loading statistics...</div>
        )}
        {isError && (
            <div>Error while loading</div>
        )}
        <div>
          {JSON.stringify(data)}
        </div>
      </main>
  )
}
