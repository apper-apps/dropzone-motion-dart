import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

function DropZone({ onFilesSelect, disabled = false, className = '' }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragCounter(prev => prev + 1);
    
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setDragCounter(prev => prev - 1);
    
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (disabled) return;
    
    setIsDragOver(false);
    setDragCounter(0);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0 && onFilesSelect) {
      onFilesSelect(files);
    }
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0 && onFilesSelect) {
      onFilesSelect(files);
    }
    // Reset input value to allow selecting same file again
    e.target.value = '';
  };

  const openFileDialog = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`relative ${className}`}>
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={openFileDialog}
        whileHover={!disabled ? { scale: 1.02 } : {}}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer
          transition-all duration-200 overflow-hidden
          ${isDragOver && !disabled
            ? 'border-primary bg-primary/5 scale-105' 
            : 'border-gray-300 hover:border-gray-400'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        {/* Gradient border effect when dragging */}
        <AnimatePresence>
          {isDragOver && !disabled && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 gradient-border rounded-xl"
            />
          )}
        </AnimatePresence>

        {/* Ripple effect */}
        <AnimatePresence>
          {isDragOver && !disabled && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 4, opacity: 0 }}
              className="absolute inset-0 bg-primary/20 rounded-full"
              style={{ 
                left: '50%', 
                top: '50%', 
                transform: 'translate(-50%, -50%)' 
              }}
            />
          )}
        </AnimatePresence>

        <div className="relative z-10">
          <motion.div
            animate={isDragOver && !disabled ? { y: [0, -10, 0] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ApperIcon 
              name="Upload" 
              className={`w-16 h-16 mx-auto mb-4 transition-colors duration-200 ${
                isDragOver && !disabled ? 'text-primary' : 'text-gray-400'
              }`}
            />
          </motion.div>
          
          <h3 className="text-xl font-heading font-semibold mb-2 text-gray-900">
            {isDragOver && !disabled ? 'Drop files here' : 'Upload your files'}
          </h3>
          
          <p className="text-gray-500 mb-6">
            Drag and drop files here, or click to browse
          </p>
          
          <Button
            variant="primary"
            size="lg"
            icon="FolderOpen"
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              openFileDialog();
            }}
          >
            Choose Files
          </Button>
          
          <p className="text-sm text-gray-400 mt-4">
            Supports: Images, Videos, Documents, Archives (Max 100MB)
          </p>
        </div>
      </motion.div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInput}
        className="hidden"
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip"
      />
    </div>
  );
}

export default DropZone;