import sessionsData from '../mockData/uploadSessions.json';

// Utility function for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let sessions = [...sessionsData];

const uploadService = {
  async getAll() {
    await delay(300);
    return [...sessions];
  },

  async getById(id) {
    await delay(200);
    const session = sessions.find(s => s.id === id);
    if (!session) {
      throw new Error('Upload session not found');
    }
    return { ...session };
  },

  async create(sessionData) {
    await delay(200);
    const newSession = {
      id: Date.now().toString(),
      files: sessionData.files || [],
      totalSize: sessionData.totalSize || 0,
      uploadedSize: 0,
      startTime: new Date().toISOString(),
      endTime: null,
      status: 'active'
    };
    sessions.push(newSession);
    return { ...newSession };
  },

  async update(id, updates) {
    await delay(150);
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Upload session not found');
    }
    
    sessions[index] = { ...sessions[index], ...updates };
    return { ...sessions[index] };
  },

  async delete(id) {
    await delay(200);
    const index = sessions.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Upload session not found');
    }
    const deletedSession = sessions[index];
    sessions.splice(index, 1);
    return { ...deletedSession };
  },

async completeSession(id) {
    await delay(100);
    return this.update(id, {
      endTime: new Date().toISOString(),
      status: 'completed'
    });
  },

  async downloadMultipleFiles(files, onProgress) {
    await delay(300);
    
    // Dynamic import of JSZip
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    // Simulate adding files to ZIP
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (onProgress) {
        onProgress((i / files.length) * 100, file.name);
      }
      
      // Simulate file content (in real app, this would fetch actual file data)
      const mockContent = `Mock content for ${file.name} (${file.size} bytes)`;
      zip.file(file.name, mockContent);
      
      await delay(200); // Simulate processing time
    }
    
    if (onProgress) {
      onProgress(100);
    }
    
    // Generate ZIP blob
    const zipBlob = await zip.generateAsync({ type: 'blob' });
    return zipBlob;
  }
};

export default uploadService;