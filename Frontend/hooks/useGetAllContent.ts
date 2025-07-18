import { getAllContent } from '@/lib/api_handler'
import { useQuery } from '@tanstack/react-query'

export const useGetAllContent = () => {
  return useQuery({
    queryKey: ['content'],
    queryFn: getAllContent,
  })
}