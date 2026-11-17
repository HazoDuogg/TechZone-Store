import { useEffect, useState } from 'react'

export function useDebounce<T>(giaTri: T, doTreMs: number) {
  const [giaTriTre, setGiaTriTre] = useState(giaTri)

  useEffect(() => {
    const hen = setTimeout(() => setGiaTriTre(giaTri), doTreMs)
    return () => clearTimeout(hen)
  }, [giaTri, doTreMs])

  return giaTriTre
}
