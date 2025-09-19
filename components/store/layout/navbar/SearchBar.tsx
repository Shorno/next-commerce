import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {useSearch} from "@/hooks/use-search";
import {cn} from "@/lib/utils";

interface SearchBarProps {
    variant?: 'desktop' | 'mobile'
    onFocus?: () => void
    onBlur?: () => void
    className?: string
}

export default function SearchBar({
                                      variant = 'desktop',
                                      onFocus,
                                      onBlur,
                                      className = ""
                                  }: SearchBarProps) {
    const { searchQuery, isSearching, handleSearch, handleKeyPress, handleInputChange } = useSearch()

    const isDesktop = variant === 'desktop'
    const height = isDesktop ? 'h-11' : 'h-10'
    const borderRadius = isDesktop ? 'rounded-xl' : 'rounded-lg'
    const textSize = isDesktop ? 'text-base' : 'text-sm'

    return (
        <div className={cn(`relative flex items-center justify-center w-full`, className)}>
            <Input
                value={searchQuery}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder="Search products..."
                disabled={isSearching}
                className={`${height} ${borderRadius} ${textSize} bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus-visible:border-gray-500 dark:focus-visible:border-gray-400 focus-visible:ring-gray-500/20 dark:focus-visible:ring-gray-400/20 focus-visible:ring-[3px]`}
            />
            <button
                onClick={() => handleSearch()}
                disabled={isSearching}
                className="absolute right-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
                {isSearching ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500 dark:border-gray-400"></div>
                ) : (
                    <Search className="h-4 w-4"/>
                )}
            </button>
        </div>
    )
}
