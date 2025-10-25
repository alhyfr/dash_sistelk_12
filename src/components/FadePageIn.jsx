'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function FadePageIn({ children }) {
    const [isVisible, setIsVisible] = useState(false)
    const pathname = usePathname()
    
    useEffect(() => {
        // Reset visibility saat pathname berubah
        setIsVisible(false)
        
        // Setelah sedikit delay, tampilkan content dengan fade in
        const timeout = setTimeout(() => {
            setIsVisible(true)
        }, 50) // Delay kecil untuk memastikan reset terlebih dahulu
        
        return () => clearTimeout(timeout)
    }, [pathname])
    
    return (
        <div
            className={`transition-all duration-500 ease-in-out ${
                isVisible 
                    ? 'opacity-100 translate-y-0' 
                    : 'opacity-0 translate-y-4'
            }`}
        >
            {children}
        </div>
    )
}


