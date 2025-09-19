import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useSearch() {
    const [searchQuery, setSearchQuery] = useState('')
    const [isSearching, setIsSearching] = useState(false)
    const router = useRouter()

    const handleSearch = useCallback(async (query: string = searchQuery) => {
        if (!query.trim()) return

        setIsSearching(true)

        try {
            // Option 1: Navigate to search results page
            router.push(`/search?q=${encodeURIComponent(query.trim())}`)

            // Option 2: If you want to handle search results in-place
            // const results = await searchProducts(query)
            // setSearchResults(results)

        } catch (error) {
            console.error('Search failed:', error)
        } finally {
            setIsSearching(false)
        }
    }, [searchQuery, router])

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSearch()
        }
    }, [handleSearch])

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    }, [])

    return {
        searchQuery,
        isSearching,
        handleSearch,
        handleKeyPress,
        handleInputChange,
        setSearchQuery
    }
}