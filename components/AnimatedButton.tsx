'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'cyber' | 'neon';

interface AnimatedButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

export default function AnimatedButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  disabled = false,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'right',
}: AnimatedButtonProps) {
  // Base styling for all buttons
  let baseStyles = `
    relative font-medium rounded-full focus:outline-none
    transition-all duration-300 ease-out overflow-hidden
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
  `;
  
  // Variant specific styling
  const variantStyles = {
    primary: 'py-3 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white',
    secondary: 'py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white',
    outline: 'py-[calc(0.75rem-2px)] px-[calc(1.5rem-2px)] border-2 border-indigo-500 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10',
    cyber: 'py-3 px-6 bg-black text-indigo-400 border border-indigo-500 cyber-border',
    neon: 'py-3 px-6 bg-black text-[#4cc9f0] border border-[#4cc9f0] neon-text',
  };
  
  const getStyles = () => {
    return `${baseStyles} ${variantStyles[variant]} ${className}`;
  };
  
  // Click animation values
  const clickAnimationProps = {
    whileTap: { scale: 0.95 },
    whileHover: { scale: 1.05 },
    transition: {
      type: 'spring',
      stiffness: 500,
      damping: 30,
    },
  };
  
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={getStyles()}
      {...clickAnimationProps}
    >
      {/* Animated background for neon variant */}
      {variant === 'neon' && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 0.15 }}
          style={{
            background: 'linear-gradient(45deg, #4cc9f0 0%, #4361ee 100%)',
          }}
        />
      )}
      
      {/* Shine effect overlay */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-0"
        initial={{ opacity: 0, x: '-100%' }}
        whileHover={{ opacity: 1, x: '100%' }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
        }}
      />
      
      {/* Button content with icon positioning */}
      <span className="relative z-10 flex items-center justify-center gap-2 font-medium">
        {icon && iconPosition === 'left' && <span>{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && <span>{icon}</span>}
      </span>
      
      {/* Animated border for cyber variant */}
      {variant === 'cyber' && (
        <motion.div
          className="absolute inset-0 -z-20 rounded-full opacity-50"
          animate={{
            background: [
              'linear-gradient(0deg, rgba(67, 97, 238, 0.5), rgba(114, 9, 183, 0.5))',
              'linear-gradient(90deg, rgba(67, 97, 238, 0.5), rgba(114, 9, 183, 0.5))',
              'linear-gradient(180deg, rgba(67, 97, 238, 0.5), rgba(114, 9, 183, 0.5))',
              'linear-gradient(270deg, rgba(67, 97, 238, 0.5), rgba(114, 9, 183, 0.5))',
              'linear-gradient(0deg, rgba(67, 97, 238, 0.5), rgba(114, 9, 183, 0.5))',
            ],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  );
} 