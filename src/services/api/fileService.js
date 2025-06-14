import filesData from '../mockData/files.json';

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate file URLs for mock data
const generateFileUrl = (fileId) => `https://files.dropzone.app/uploads/${fileId}`;
const generateThumbnailUrl = (fileId, type) => {
  if (type.startsWith('image/')) {
    return `https://files.dropzone.app/thumbnails/${fileId}.jpg`;
  }
  return null;
};

let files = [...filesData].map(file => ({
  ...file,
  url: generateFileUrl(file.id),
  thumbnailUrl: generateThumbnailUrl(file.id, file.type)
}));

const fileService = {
  async getAll() {
    await delay(300);
    return [...files];
  },

  async getById(id) {
    await delay(200);
    const file = files.find(f => f.id === id);
    if (!file) {
      throw new Error('File not found');
    }
    return { ...file };
  },

  async create(fileData) {
    await delay(400);
    const newFile = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      status: 'pending',
      progress: 0,
      url: null,
      thumbnailUrl: fileData.type.startsWith('image/') ? null : null,
      createdAt: new Date().toISOString()
    };
    files.push(newFile);
    return { ...newFile };
  },

  async update(id, updates) {
    await delay(250);
    const index = files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File not found');
    }
    
    files[index] = { ...files[index], ...updates };
    
    // Generate URLs when upload completes
    if (updates.status === 'completed' && !files[index].url) {
      files[index].url = generateFileUrl(id);
      files[index].thumbnailUrl = generateThumbnailUrl(id, files[index].type);
    }
    
    return { ...files[index] };
  },

  async delete(id) {
    await delay(200);
    const index = files.findIndex(f => f.id === id);
    if (index === -1) {
      throw new Error('File not found');
    }
    const deletedFile = files[index];
    files.splice(index, 1);
    return { ...deletedFile };
  },

  // File-specific methods
  async uploadFile(file, onProgress) {
    const fileItem = await this.create(file);
    
    // Simulate upload progress
    return new Promise((resolve, reject) => {
      let progress = 0;
      const interval = setInterval(async () => {
        progress += Math.random() * 15 + 5; // Random progress 5-20%
        progress = Math.min(progress, 100);
        
        try {
          const updatedFile = await this.update(fileItem.id, {
            progress: Math.round(progress),
            status: progress >= 100 ? 'completed' : 'uploading'
          });
          
          if (onProgress) {
            onProgress(updatedFile);
          }
          
          if (progress >= 100) {
            clearInterval(interval);
            resolve(updatedFile);
          }
        } catch (error) {
          clearInterval(interval);
          reject(error);
        }
      }, 200 + Math.random() * 300); // Random interval 200-500ms
    });
  },

  async validateFile(file) {
    await delay(100);
    
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/zip', 'video/mp4', 'audio/mpeg'
    ];
    
    if (file.size > maxSize) {
      throw new Error(`File size exceeds 100MB limit`);
    }
    
    if (!allowedTypes.includes(file.type)) {
      throw new Error(`File type ${file.type} is not supported`);
    }
    
    return true;
  },

  async generateShareableLink(fileId) {
    await delay(200);
    const file = files.find(f => f.id === fileId);
    if (!file) {
      throw new Error('File not found');
    }
    
    const shareId = Math.random().toString(36).substr(2, 8);
    return `https://dropzone.app/share/${shareId}`;
  }
};

export default fileService;