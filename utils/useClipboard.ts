import { useState } from 'react'

const useClipboard = () => {
  const [isCopied, setIsCopied] = useState(false)
  const [timeoutId, setTimeoutId] = useState(null)

  const copyTextToClipboard = (address: string) => {
    navigator.clipboard
      .writeText(address)
      .then(() => {
        setIsCopied(true)
        if (timeoutId) clearTimeout(timeoutId)
        const newTimeoutId: any = setTimeout(() => setIsCopied(false), 2000)
        setTimeoutId(newTimeoutId)
      })
      .catch(error => {
        console.error('Could not copy text: ', error)
      })
  }

  return { isCopied, copyTextToClipboard }
}

export default useClipboard
