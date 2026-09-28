import React from 'react';

interface VerifiedBadgeProps {
  className?: string;
  size?: number;
}

export const VerifiedBadge: React.FC<VerifiedBadgeProps> = ({ 
  className = "w-4 h-4", 
  size = 16 
}) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 ${className}`}
      aria-label="Verified Official"
    >
      <title>Verified Official</title>
      {/* Blue Ribbon / Starburst Badge Background */}
      <path 
        d="M9.6 2.45L12 1L14.4 2.45L17.15 2.15L18.45 4.65L21.1 5.65L20.85 8.45L22.65 10.65L21.1 13L21.95 15.65L19.65 17.25L19.15 20.05L16.4 20.35L14.7 22.55L12 21.85L9.3 22.55L7.6 20.35L4.85 20.05L4.35 17.25L2.05 15.65L2.9 13L1.35 10.65L3.15 8.45L2.9 5.65L5.55 4.65L6.85 2.15L9.6 2.45Z" 
        fill="#1D9BF0" 
      />
      {/* Pure White Sharp Checkmark */}
      <path 
        d="M7.5 12.2L10.5 15.2L16.5 9.2" 
        stroke="white" 
        strokeWidth="2.4" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
    </svg>
  );
};
