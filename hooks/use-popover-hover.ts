import {useCallback, useRef, useState} from "react";
import {useIsMobile} from "@/hooks/use-mobile";

export default function usePopoverWithHover(initialState = false, delay = 150) {
    const [isOpen, setIsOpen] = useState(initialState)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMobile = useIsMobile()

    const clearExistingTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
            timeoutRef.current = null
        }
    }, [])

    const handleMouseEnter = useCallback(() => {
        clearExistingTimeout()
        if (!isMobile && !isOpen) {
            setIsOpen(true)
        }
    }, [clearExistingTimeout, isMobile, isOpen])

    const handleMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, delay)
    }, [delay])

    const handleClick = useCallback(() => {
        setIsOpen(prev => !prev)
    }, [])

    const handleOpenChange = useCallback((open: boolean) => {
        clearExistingTimeout()
        setIsOpen(open)
    }, [clearExistingTimeout])

    const handlePopoverMouseEnter = useCallback(() => {
        clearExistingTimeout()
    }, [clearExistingTimeout])

    const handlePopoverMouseLeave = useCallback(() => {
        timeoutRef.current = setTimeout(() => {
            setIsOpen(false)
        }, delay)
    }, [delay])

    return {
        isOpen,
        handlers: {
            onMouseEnter: handleMouseEnter,
            onMouseLeave: handleMouseLeave,
            onClick: handleClick,
            onOpenChange: handleOpenChange,
            onPopoverMouseEnter: handlePopoverMouseEnter,
            onPopoverMouseLeave: handlePopoverMouseLeave,
        }
    }
}