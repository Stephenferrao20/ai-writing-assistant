'use client'

declare global {
  interface Window {
    google: unknown;
  }
}

import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { toast } from 'sonner';

export default function GoogleLogin() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
      const id_token = response.credential
      setIsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/google_auth`, {
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
        toast.error('Google login failed: ' + (error instanceof Error ? error.message : String(error)));
      } finally {
        setIsLoading(false);
      }
    }, [router]);

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
          const google = window.google as {
            accounts: {
              id: {
                initialize: (...args: unknown[]) => void;
                renderButton: (...args: unknown[]) => void;
              };
            };
          };
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
            callback: handleCredentialResponse
          });
          google.accounts.id.renderButton(
            document.getElementById('google-signin')!,
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
            }
          );
        }
      }
    }, [handleCredentialResponse]);

  return (
    <div className="relative">
      <div id="google-signin" style={{ opacity: isLoading ? 0.5 : 1, pointerEvents: isLoading ? 'none' : 'auto' }} />
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded">
          <svg className="animate-spin h-6 w-6 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
        </div>
      )}
    </div>
  );
}
