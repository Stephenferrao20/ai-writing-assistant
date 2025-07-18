import { getCurrentUser } from '@/lib/api_handler'
import { useQuery } from '@tanstack/react-query'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    staleTime: 60 * 60 * 1000 
  })
}
