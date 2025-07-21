'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useGenerateContent } from '@/hooks/useGenerateContent';
import { toast } from 'sonner';

export default function TopicModal({ onSubmit, setShowTopicModal }: { onSubmit: (content: string, title: string) => void; setShowTopicModal: (show: boolean) => void }) {
  const [topic, setTopic] = useState('');
  

  const { mutate: generateContent, isPending } = useGenerateContent();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Don't close the modal yet; wait for response
    generateContent({ topic }, {
      onSuccess: (data) => {
        console.log('Generated:', data.generated);
        toast.success('Content generated!');
        onSubmit(data.generated, data.title);
        setShowTopicModal(false); 
      },
      onError: (err) => {
        console.error('Generation failed:', err.message);
        toast.error('Generation failed: ' + (err?.message || err));
      }
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-white/10 rounded-xl p-6 w-[90%] max-w-md text-white relative">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-white"
          onClick={() => setShowTopicModal(false)}
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-4">Enter Topic</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Future of AI in Healthcare"
            className="w-full px-4 py-2 rounded-lg bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isPending}
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 transition text-white py-2 rounded-3xl font-medium"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center justify-center"><svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>Generating...</span>
            ) : (
              'Generate Content'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
