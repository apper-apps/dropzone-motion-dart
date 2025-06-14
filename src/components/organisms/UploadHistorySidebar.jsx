import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { fileService } from '@/services';
import ApperIcon from '@/components/ApperIcon';
import FileIcon from '@/components/atoms/FileIcon';
import Button from '@/components/atoms/Button';

function UploadHistorySidebar({ isOpen, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const historyData = await fileService.getHistory();
      setHistory(historyData);
    } catch (err) {
      setError('Failed to load upload history');
      toast.error('Failed to load upload history');
    } finally {
      setLoading(false);
    }
  };

  const handleReShare = async (file) => {
    try {
      const newShareLink = await fileService.regenerateShareableLink(file.id);
      
      // Copy to clipboard
      await navigator.clipboard.writeText(newShareLink);
      toast.success(`New share link copied to clipboard for ${file.name}`);
    } catch (err) {
      if (err.message === 'Cannot share incomplete file') {
        toast.error('Cannot share incomplete file');
      } else {
        toast.error('Failed to generate share link');
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 z-50 flex flex-col shadow-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ApperIcon name="History" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Upload History
                </h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-1"
              >
                <ApperIcon name="X" className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : error ? (
                <div className="p-4">
                  <div className="text-center py-8">
                    <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                    <Button onClick={loadHistory} size="sm">
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : history.length === 0 ? (
                <div className="p-4">
                  <div className="text-center py-8">
                    <ApperIcon name="FileText" className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      No upload history yet
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {history.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-start gap-3">
                        <FileIcon type={file.type} className="w-8 h-8 flex-shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {file.name}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatFileSize(file.size)} • {formatDate(file.createdAt)}
                          </p>
                          
                          <div className="mt-2 flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="xs"
                              onClick={() => handleReShare(file)}
                              className="flex items-center gap-1"
                            >
                              <ApperIcon name="Share2" className="w-3 h-3" />
                              Re-share
                            </Button>
                            
                            {file.url && (
                              <Button
                                variant="ghost"
                                size="xs"
                                onClick={() => window.open(file.url, '_blank')}
                                className="flex items-center gap-1"
                              >
                                <ApperIcon name="ExternalLink" className="w-3 h-3" />
                                Open
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={loadHistory}
                className="w-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                <ApperIcon name="RefreshCw" className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh History
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default UploadHistorySidebar;