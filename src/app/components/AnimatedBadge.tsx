'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBadgeProps {
  text: string;
  className?: string;
}

const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({ text, className = '' }) => {
  return (
    <motion.div
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        duration: 1
      }}
      className={`inline-flex items-center px-4 py-2 bg-blue-500 rounded-full relative overflow-hidden ${className}`}
    >
      {/* Background pulse effect */}
      <motion.span
        animate={{ 
          backgroundColor: ["#3B82F6", "#2563EB", "#3B82F6"]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute inset-0 rounded-full opacity-50"
      />
      
      {/* Shine effect */}
      <motion.span
        animate={{
          x: ["0%", "200%"]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
          repeatDelay: 0.75
        }}
        className="absolute inset-y-0 w-32 -skew-x-12 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
      />
      
      {/* Additional sparkle effects */}
      <motion.span
        animate={{
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          times: [0, 0.5, 1]
        }}
        className="absolute top-1 right-4 w-1 h-1 bg-white rounded-full"
      />
      <motion.span
        animate={{
          opacity: [0, 1, 0],
          scale: [0.8, 1.2, 0.8]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
          times: [0, 0.5, 1]
        }}
        className="absolute bottom-1 left-4 w-1 h-1 bg-white rounded-full"
      />
      
      <span className="text-sm font-medium text-white relative">
        {text}
      </span>
    </motion.div>
  );
};

export default AnimatedBadge; 