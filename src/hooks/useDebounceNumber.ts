import { useEffect, useState } from 'react'

export function useDebounceNumber(value: number[], delay = 1000): number[] {
    const [debounced, setDebounced] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => setDebounced(value), delay)
        return () => clearTimeout(handler)
    }, [value, delay])

    return debounced
}