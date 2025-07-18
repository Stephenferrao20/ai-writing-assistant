'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner';

export default function GoogleLogin() {
    const router = useRouter();
  useEffect(() => {
    // Inject the Google Identity Services script
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    document.body.appendChild(script)

    // Initialize Google Sign-In
    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
          callback: handleCredentialResponse
        })

        window.google.accounts.id.renderButton(
          document.getElementById('google-signin')!,
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular'
          }
        )
      }
    }
  }, [])

  const handleCredentialResponse = async (response: google.accounts.id.CredentialResponse) => {
    const id_token = response.credential
    

    try {
      const res = await fetch('http://localhost:8000/google_auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token }),
        credentials: 'include'  // 🔐 So cookies (token) are set by FastAPI
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.detail || 'Login failed')
      }

      const data = await res.json()
      console.log('✅ Google login successful:', data)

      router.push("/dashboard")

      
    } catch (error) {
      console.error('Google login failed:', error)
      toast.error('Google login failed: ' + (error?.message || error));
    }
  }

  return <div id="google-signin" />
}
