import { useEffect } from 'react'
import { useRouter } from 'next/router'

export const AccountRedirectListener = () => {
  const router = useRouter()

  useEffect(() => {
    const handleNoAccount = () => {
      router.push('/')
    }

    window.addEventListener('noAccountDetected', handleNoAccount)

    return () => {
      window.removeEventListener('noAccountDetected', handleNoAccount)
    }
  }, [router])

  return null
}
