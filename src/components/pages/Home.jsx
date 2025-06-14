import { useState } from 'react';
import FileUploader from '@/components/organisms/FileUploader';
import UploadHistorySidebar from '@/components/organisms/UploadHistorySidebar';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200 flex">
      <div className="flex-1 relative">
        {/* Toggle Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center gap-2"
          >
            <ApperIcon name="History" className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </Button>
        </div>
        
        <FileUploader />
      </div>
      
      <UploadHistorySidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />
    </div>
  );
}
export default Home;