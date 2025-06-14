import FileUploader from '@/components/organisms/FileUploader';

function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      <FileUploader />
    </div>
  );
}

export default Home;