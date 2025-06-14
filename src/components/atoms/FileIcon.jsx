import ApperIcon from '@/components/ApperIcon';

function FileIcon({ type, size = 24, className = '' }) {
  const getIconName = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Music';
    if (mimeType === 'application/pdf') return 'FileText';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'FileText';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'FileSpreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
    if (mimeType === 'application/zip' || mimeType.includes('compressed')) return 'Archive';
    if (mimeType === 'text/plain') return 'FileText';
    return 'File';
  };
  
  const getIconColor = (mimeType) => {
    if (mimeType.startsWith('image/')) return 'text-blue-500';
    if (mimeType.startsWith('video/')) return 'text-red-500';
    if (mimeType.startsWith('audio/')) return 'text-green-500';
    if (mimeType === 'application/pdf') return 'text-red-600';
    if (mimeType.includes('word') || mimeType.includes('document')) return 'text-blue-600';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return 'text-green-600';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'text-orange-500';
    if (mimeType === 'application/zip' || mimeType.includes('compressed')) return 'text-purple-500';
    return 'text-gray-500';
  };
  
  const iconName = getIconName(type);
  const iconColor = getIconColor(type);
  
  return (
    <ApperIcon 
      name={iconName} 
      size={size}
      className={`${iconColor} ${className}`}
    />
  );
}

export default FileIcon;