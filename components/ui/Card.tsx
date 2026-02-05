
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noPadding?: boolean;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({ children, className = '', onClick, noPadding = false, style }) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-xl border border-gray-200 shadow-sm ${noPadding ? '' : 'p-6'} ${className} ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};
