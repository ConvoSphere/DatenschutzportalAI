import { FileCategory } from '../types';

export interface UploadData {
  email: string;
  uploaderName: string;
  projectTitle: string;
  isProspectiveStudy: boolean;
  categories: FileCategory[];
}

export interface UploadResult {
  success: boolean;
  timestamp: string;
  message?: string;
}

export const api = {
  upload: async (data: UploadData): Promise<UploadResult> => {
    // Mock API Call - simulates interaction with the planned FastAPI Backend
    console.log('Starting upload...', {
      email: data.email,
      projectTitle: data.projectTitle,
      fileCount: data.categories.reduce((sum, cat) => sum + cat.files.length, 0),
    });

    // Simulate network delay (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate success
    return {
      success: true,
      timestamp: new Date().toISOString(),
      message: 'Upload successful (Mock)',
    };
  }
};
