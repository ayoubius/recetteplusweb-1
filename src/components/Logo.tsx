
import React from 'react';
import { ChefHat } from 'lucide-react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        {/* Vous pouvez remplacer cette icône par votre logo */}
        <ChefHat className={`${sizeClasses[size]} text-orange-500`} />
      </div>
      {showText && (
        <span className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
          Recette+
        </span>
      )}
    </div>
  );
};

export default Logo;
