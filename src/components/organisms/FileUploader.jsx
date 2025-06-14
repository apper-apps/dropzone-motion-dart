import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import DropZone from '@/components/molecules/DropZone';
import FileCard from '@/components/molecules/FileCard';
import PreviewModal from '@/components/molecules/PreviewModal';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { fileService } from '@/services';

function FileUploader() {
  const [files, setFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewFile, setPreviewFile] = useState(null);
  const [completedUploads, setCompletedUploads] = useState([]);

  const handleFilesSelect = useCallback(async (selectedFiles) => {
    const newFiles = [];
    
    for (const file of selectedFiles) {
      try {
        // Validate file
        await fileService.validateFile(file);
        
        // Create file object
        const fileItem = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: file.name,
          size: file.size,
          type: file.type,
          status: 'pending',
          progress: 0,
          file: file // Keep reference to actual file
        };
        
        newFiles.push(fileItem);
      } catch (error) {
        toast.error(`${file.name}: ${error.message}`);
      }
    }
    
    if (newFiles.length > 0) {
      setFiles(prev => [...prev, ...newFiles]);
      toast.success(`${newFiles.length} file(s) added to queue`);
    }
  }, []);

  const handleRemoveFile = useCallback((fileId) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast.info('File removed from queue');
  }, []);

  const handleCancelUpload = useCallback((fileId) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId 
        ? { ...f, status: 'cancelled', progress: 0 }
        : f
    ));
    toast.info('Upload cancelled');
  }, []);

  const handlePreviewFile = useCallback((file) => {
    setPreviewFile(file);
  }, []);

  const handleUploadAll = useCallback(async () => {
    const pendingFiles = files.filter(f => f.status === 'pending');
    
    if (pendingFiles.length === 0) {
      toast.warning('No files to upload');
      return;
    }

    setIsUploading(true);
    const uploadPromises = [];

    for (const file of pendingFiles) {
      // Update status to uploading
      setFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, status: 'uploading', progress: 0 }
          : f
      ));

      const uploadPromise = fileService.uploadFile(file.file, (updatedFile) => {
        // Update progress in real-time
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, ...updatedFile, status: updatedFile.status, progress: updatedFile.progress }
            : f
        ));
      }).then((completedFile) => {
        // Final update with completed status
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, ...completedFile }
            : f
        ));
        
        setCompletedUploads(prev => [...prev, completedFile]);
        return completedFile;
      }).catch((error) => {
        // Handle upload error
        setFiles(prev => prev.map(f => 
          f.id === file.id 
            ? { ...f, status: 'error', progress: 0 }
            : f
        ));
        
        toast.error(`Upload failed for ${file.name}: ${error.message}`);
        throw error;
      });

      uploadPromises.push(uploadPromise);
    }

    try {
      const results = await Promise.allSettled(uploadPromises);
      const successful = results.filter(r => r.status === 'fulfilled').length;
      const failed = results.filter(r => r.status === 'rejected').length;
      
      if (successful > 0) {
        toast.success(`${successful} file(s) uploaded successfully!`);
      }
      
      if (failed > 0) {
        toast.error(`${failed} file(s) failed to upload`);
      }
    } catch (error) {
      toast.error('Upload process encountered errors');
    } finally {
      setIsUploading(false);
    }
  }, [files]);

  const handleClearCompleted = useCallback(() => {
    setFiles(prev => prev.filter(f => f.status !== 'completed'));
    setCompletedUploads([]);
    toast.info('Completed uploads cleared');
  }, []);

  const handleGenerateShareLink = useCallback(async (fileId) => {
    try {
      const shareLink = await fileService.generateShareableLink(fileId);
      await navigator.clipboard.writeText(shareLink);
      
      // Show confetti animation
      const confetti = document.createElement('div');
      confetti.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] pointer-events-none';
      confetti.innerHTML = '🎉'.repeat(10);
      confetti.style.fontSize = '2rem';
      confetti.style.animation = 'confetti 0.6s ease-out';
      document.body.appendChild(confetti);
      
      setTimeout(() => {
        document.body.removeChild(confetti);
      }, 600);
      
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  }, []);

  const pendingFiles = files.filter(f => f.status === 'pending');
  const uploadingFiles = files.filter(f => f.status === 'uploading');
  const completedFiles = files.filter(f => f.status === 'completed');
  const hasFiles = files.length > 0;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-2xl mb-4"
        >
          <ApperIcon name="Upload" className="w-8 h-8 text-white" />
        </motion.div>
        
        <h1 className="text-4xl font-heading font-bold gradient-text mb-2">
          DropZone
        </h1>
        <p className="text-gray-600 text-lg">
          Upload and share your files effortlessly
        </p>
      </div>

      {/* Drop Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <DropZone 
          onFilesSelect={handleFilesSelect}
          disabled={isUploading}
        />
      </motion.div>

      {/* File Queue */}
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Queue Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-heading font-semibold text-gray-900">
                Upload Queue ({files.length})
              </h2>
              
              <div className="flex items-center gap-2">
                {completedFiles.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={handleClearCompleted}
                  >
                    Clear Completed
                  </Button>
                )}
                
                {pendingFiles.length > 0 && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon="Upload"
                    loading={isUploading}
                    onClick={handleUploadAll}
                    disabled={isUploading}
                  >
                    Upload All ({pendingFiles.length})
                  </Button>
                )}
              </div>
            </div>

            {/* File List */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {files.map((file, index) => (
                  <motion.div
                    key={file.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ 
                      opacity: 1, 
                      x: 0,
                      transition: { delay: index * 0.05 }
                    }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <FileCard
                      file={file}
                      onRemove={file.status === 'pending' ? handleRemoveFile : null}
                      onCancel={file.status === 'uploading' ? handleCancelUpload : null}
                      onPreview={handlePreviewFile}
                    />
                    
                    {/* Success actions for completed files */}
                    {file.status === 'completed' && file.url && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 p-3 bg-success/5 border border-success/20 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-success">
                            <ApperIcon name="CheckCircle" size={16} />
                            <span className="text-sm font-medium">Upload completed!</span>
                          </div>
                          
                          <Button
                            variant="success"
                            size="sm"
                            icon="Link"
                            onClick={() => handleGenerateShareLink(file.id)}
                          >
                            Copy Share Link
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Upload Summary */}
            {(uploadingFiles.length > 0 || completedFiles.length > 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-surface rounded-lg p-4 border border-gray-200"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {uploadingFiles.length}
                    </div>
                    <div className="text-sm text-gray-600">Uploading</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-success">
                      {completedFiles.length}
                    </div>
                    <div className="text-sm text-gray-600">Completed</div>
                  </div>
                  
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024) > 1 
                        ? `${(files.reduce((acc, f) => acc + f.size, 0) / (1024 * 1024)).toFixed(1)} MB`
                        : `${(files.reduce((acc, f) => acc + f.size, 0) / 1024).toFixed(0)} KB`
                      }
                    </div>
                    <div className="text-sm text-gray-600">Total Size</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal */}
      <PreviewModal
        file={previewFile}
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
      />
    </div>
  );
}

export default FileUploader;