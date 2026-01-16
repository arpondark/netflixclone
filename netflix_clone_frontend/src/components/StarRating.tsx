// Import React and useState hook
import React, { useState } from 'react'

/**
 * Props definition for the StarRating component.
 */
interface StarRatingProps {
  rating: number // The current rating value to display (1-5)
  onRate?: (rating: number) => void // Optional callback function triggered when a star is clicked
  readonly?: boolean // If true, rating cannot be changed by user interaction
  size?: 'sm' | 'md' | 'lg' // Size variant for the stars
}

/**
 * StarRating Component
 * Displays a row of stars that can be interactive or read-only.
 * Used for showing Video ratings and allowing user input.
 */
export default function StarRating({ rating, onRate, readonly = false, size = 'md' }: StarRatingProps) {
  // State to track which star is being hovered over (for UI feedback before clicking)
  const [hoverRating, setHoverRating] = useState<number | null>(null)

  // Array representing the 5 stars
  const stars = [1, 2, 3, 4, 5]

  // CSS classes for different size variants
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  // Handler for mouse entering a star (starts hover effect)
  const handleMouseEnter = (star: number) => {
    if (!readonly) {
      setHoverRating(star)
    }
  }

  // Handler for mouse leaving the star area (resets hover effect)
  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(null)
    }
  }

  // Handler for clicking a star (submits rating)
  const handleClick = (star: number) => {
    if (!readonly && onRate) {
      onRate(star)
    }
  }

  return (
    <div className="flex gap-1">
      {/* Map through the array to render 5 stars */}
      {stars.map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => handleClick(star)} // Trigger click handler
          onMouseEnter={() => handleMouseEnter(star)} // Trigger hover enter
          onMouseLeave={handleMouseLeave} // Trigger hover leave
          disabled={readonly} // Disable button interaction if read-only
          // Dynamic classes: changing cursor based on readonly state
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} focus:outline-none transition-colors duration-200`}
        >
          {/* SVG Star Icon */}
          <svg
            className={`${sizeClasses[size]} ${
              // Conditional styling:
              // If hovering, highlight stars up to hoverRating.
              // If not hovering, highlight stars up to current actual rating.
              (hoverRating !== null ? star <= hoverRating : star <= rating)
                ? 'text-yellow-400 fill-current' // Gold/Yellow for active/filled stars
                : 'text-gray-400' // Gray for inactive/empty stars
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Star shape path */}
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </button>
      ))}
    </div>
  )
}
