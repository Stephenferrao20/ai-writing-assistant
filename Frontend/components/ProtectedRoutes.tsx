'use client'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data, isLoading, isError } = useCurrentUser()
  const router = useRouter()
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    if (!isLoading && isError) {
      router.replace('/auth') // 🔁 Use replace to avoid back button to protected route
    } else if (!isLoading && data) {
      setShouldRender(true) // ✅ Render only after auth success
    }
  }, [isLoading, isError, data, router])

  if (isLoading || !shouldRender) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        <span className="ml-4">Loading...</span>
      </div>
    )
  }

  return <>{children}</>
}
