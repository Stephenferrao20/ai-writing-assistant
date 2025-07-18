import { getGenerateContent } from '@/lib/api_handler';
import { useMutation } from '@tanstack/react-query';

interface GenerateContentRequest {
  topic: string;
}

interface GenerateContentResponse {
    title: string;
    generated: string;
    saved_content_id: number;
  }
  

export const useGenerateContent = () => {
  return useMutation<GenerateContentResponse ,Error, GenerateContentRequest>({
    mutationFn: getGenerateContent 
  });
};