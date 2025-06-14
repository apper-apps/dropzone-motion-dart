import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import FileIcon from '@/components/atoms/FileIcon';
import ProgressBar from '@/components/atoms/ProgressBar';
import Button from '@/components/atoms/Button';

function FileCard({ 
  file, 
  onRemove, 
  onPreview, 
  onCancel,
  showActions = true,
  className = ''
}) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-success';
      case 'uploading': return 'text-primary';
      case 'error': return 'text-error';
      case 'cancelled': return 'text-gray-500';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'uploading': return 'Loader2';
      case 'error': return 'AlertCircle';
      case 'cancelled': return 'XCircle';
      default: return 'Clock';
    }
  };

  const canPreview = file.type.startsWith('image/') && (file.thumbnailUrl || file.url);
  const isUploading = file.status === 'uploading';
  const isCompleted = file.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ y: -2 }}
      className={`bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex items-start gap-3">
        {/* File Icon or Thumbnail */}
        <div className="flex-shrink-0">
          {canPreview ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-12 h-12 rounded-lg overflow-hidden cursor-pointer"
              onClick={() => onPreview && onPreview(file)}
            >
              <img
                src={file.thumbnailUrl || file.url}
                alt={file.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center hidden">
                <FileIcon type={file.type} size={20} />
              </div>
            </motion.div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileIcon type={file.type} size={20} />
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate" title={file.name}>
                {file.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm text-gray-500">
                  {formatFileSize(file.size)}
                </span>
                <span className="text-gray-300">•</span>
                <div className={`flex items-center gap-1 text-sm ${getStatusColor(file.status)}`}>
                  <ApperIcon 
                    name={getStatusIcon(file.status)} 
                    size={14}
                    className={isUploading ? 'animate-spin' : ''}
                  />
                  <span className="capitalize">{file.status}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {showActions && (
              <div className="flex items-center gap-1">
                {canPreview && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Eye"
                    onClick={() => onPreview && onPreview(file)}
                    className="w-8 h-8 p-0"
                  />
                )}
                
                {isUploading && onCancel && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="X"
                    onClick={() => onCancel(file.id)}
                    className="w-8 h-8 p-0 text-error hover:bg-error/10"
                  />
                )}
                
                {!isUploading && onRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => onRemove(file.id)}
                    className="w-8 h-8 p-0 text-error hover:bg-error/10"
                  />
                )}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="mt-3">
              <ProgressBar
                progress={file.progress || 0}
                variant="primary"
                size="sm"
                showLabel={false}
              />
            </div>
          )}

          {/* Success Actions */}
          {isCompleted && file.url && (
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                icon="ExternalLink"
                onClick={() => window.open(file.url, '_blank')}
              >
                Open
              </Button>
              <Button
                variant="ghost"
                size="sm"
                icon="Copy"
                onClick={() => {
                  navigator.clipboard.writeText(file.url);
                  // Toast notification would be triggered from parent
                }}
              >
                Copy Link
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default FileCard;