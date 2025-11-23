'use client'
import { useState, useRef, useEffect } from 'react'
import { EllipsisVertical } from 'lucide-react'
import { createPortal } from 'react-dom'

export default function BtnDrop({ items = [] }) {
    const [isOpen, setIsOpen] = useState(false)
    const [position, setPosition] = useState({ top: 0, left: 0 })
    const buttonRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (buttonRef.current && !buttonRef.current.contains(event.target)) {
                // Check if click is inside the dropdown menu (which is in a portal)
                const dropdownMenu = document.getElementById('btn-drop-menu')
                if (dropdownMenu && dropdownMenu.contains(event.target)) {
                    return
                }
                setIsOpen(false)
            }
        }

        function handleScroll() {
            if (isOpen) setIsOpen(false)
        }

        document.addEventListener("mousedown", handleClickOutside)
        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", handleScroll)

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", handleScroll)
        }
    }, [isOpen])

    const toggleDropdown = (e) => {
        e.stopPropagation()
        if (!isOpen) {
            const rect = buttonRef.current.getBoundingClientRect()
            // Calculate position: align right edge of dropdown with right edge of button
            // We'll set left position such that it ends at rect.right
            // Assuming dropdown width is roughly 192px (w-48)
            // Or we can just position it relative to the button
            setPosition({
                top: rect.bottom + window.scrollY + 4, // 4px gap
                left: rect.right + window.scrollX - 192 // Align right, assuming w-48 (12rem = 192px)
            })
        }
        setIsOpen(!isOpen)
    }

    return (
        <>
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                className="p-1 transition-colors text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100"
            >
                <EllipsisVertical className="w-4 h-4" />
            </button>

            {isOpen && createPortal(
                <div
                    id="btn-drop-menu"
                    className="fixed w-48 bg-white rounded-md shadow-lg z-[9999] border border-gray-100 py-1"
                    style={{
                        top: `${position.top - window.scrollY}px`,
                        left: `${position.left - window.scrollX}px`
                    }}
                >
                    {items.map((item, index) => (
                        <button
                            key={index}
                            onClick={(e) => {
                                e.stopPropagation()
                                item.onClick()
                                setIsOpen(false)
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 capitalize"
                        >
                            {item.label}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </>
    )
}
