import { useMutation } from '@tanstack/react-query';
import { createContent, updateContent } from '@/lib/api_handler';

export const useCreateContent = () => {
  return useMutation({
    mutationFn: createContent,
  });
};

export const useUpdateContent = () => {
  return useMutation({
    mutationFn: updateContent,
  });
};
