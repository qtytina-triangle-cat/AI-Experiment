import React from 'react';

interface AvatarProps {
  initials?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'teal' | 'blue' | 'purple';
  className?: string;
  alt?: string;
}

export default function Avatar({ 
  initials, 
  src, 
  size = 'md', 
  variant = 'teal',
  className = '',
  alt = 'Avatar'
}: AvatarProps) {
  
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base'
  };

  const variantClasses = {
    teal: 'bg-gradient-to-r from-teal-400 to-cyan-500',
    blue: 'bg-gradient-to-r from-blue-400 to-blue-500',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-500'
  };

  // Base classes include ring-2 ring-white for stacking effect
  const baseClasses = `rounded-full flex items-center justify-center font-medium text-white shadow-sm ring-2 ring-white ${sizeClasses[size]} ${className}`;

  if (src) {
    return (
      <img 
        src={src} 
        alt={alt} 
        className={`${baseClasses} object-cover`} 
      />
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]}`}>
      {initials}
    </div>
  );
}
