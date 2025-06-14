import { motion } from 'framer-motion';

function ProgressBar({ 
  progress = 0, 
  variant = 'primary',
  size = 'md',
  showLabel = true,
  label,
  className = '',
  animate = true
}) {
  const variants = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-success',
    warning: 'from-warning to-warning',
    error: 'from-error to-error'
  };
  
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const progressValue = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || 'Progress'}
          </span>
          <span className="text-sm text-gray-500">
            {Math.round(progressValue)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <motion.div
          className={`${sizes[size]} bg-gradient-to-r ${variants[variant]} rounded-full transition-all duration-300`}
          initial={animate ? { width: 0 } : { width: `${progressValue}%` }}
          animate={{ width: `${progressValue}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;