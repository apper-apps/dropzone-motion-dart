import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import { useEffect } from 'react';

function PreviewModal({ file, isOpen, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-gray-900 truncate">
                    {file.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatFileSize(file.size)} • {file.type}
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {file.url && (
                    <Button
                      variant="outline"
                      size="sm"
                      icon="Download"
                      onClick={() => window.open(file.url, '_blank')}
                    >
                      Download
                    </Button>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={onClose}
                    className="w-8 h-8 p-0"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6 max-h-[calc(90vh-8rem)] overflow-auto">
                {file.type.startsWith('image/') ? (
                  <div className="text-center">
                    <img
                      src={file.url || file.thumbnailUrl}
                      alt={file.name}
                      className="max-w-full max-h-[60vh] mx-auto rounded-lg shadow-lg"
                      onError={(e) => {
                        e.target.src = '/placeholder-image.png';
                      }}
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <ApperIcon name="File" size={32} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-4">
                      Preview not available for this file type
                    </p>
                    {file.url && (
                      <Button
                        variant="primary"
                        icon="ExternalLink"
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        Open File
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Footer with metadata */}
              {file.url && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">File URL:</span>
                      <code className="ml-2 px-2 py-1 bg-gray-200 rounded text-xs break-all">
                        {file.url}
                      </code>
                    </div>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Copy"
                      onClick={() => {
                        navigator.clipboard.writeText(file.url);
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default PreviewModal;