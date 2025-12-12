import { FileCategory } from '../types';

export interface UploadData {
  email: string;
  uploaderName: string;
  projectTitle: string;
  institution: string;
  isProspectiveStudy: boolean;
  projectDetails?: string;
  categories: FileCategory[];
  projectType: 'new' | 'existing' | null;
}

export interface UploadResult {
  success: boolean;
  timestamp: string;
  project_id?: string;
  files_uploaded?: number;
  message?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export const api = {
  upload: async (data: UploadData): Promise<UploadResult> => {
    console.log('[API] Starting upload request', {
      email: data.email,
      projectTitle: data.projectTitle,
      institution: data.institution,
      projectType: data.projectType,
      totalFiles: data.categories.reduce((sum, cat) => sum + cat.files.length, 0)
    });

    // Basic validation before even trying
    if (!API_TOKEN) {
      console.error('[API] API_TOKEN is missing in environment variables');
      throw new Error('Konfigurationsfehler: API Token fehlt. Bitte kontaktieren Sie den Administrator.');
    }

    if (!API_BASE_URL) {
      console.error('[API] API_BASE_URL is missing in environment variables');
      throw new Error('Konfigurationsfehler: API URL fehlt. Bitte kontaktieren Sie den Administrator.');
    }

    const formData = new FormData();

    // Add basic fields
    formData.append('email', data.email);
    if (data.uploaderName) {
      formData.append('uploader_name', data.uploaderName);
    }
    formData.append('project_title', data.projectTitle);
    formData.append('institution', data.institution);
    formData.append('is_prospective_study', String(data.isProspectiveStudy));
    if (data.projectDetails) {
      formData.append('project_details', data.projectDetails);
    }
    formData.append('project_type', data.projectType || 'new');

    // Process files and categories
    const categoryMap: Record<string, string> = {};
    let totalFileSize = 0;

    data.categories.forEach((category) => {
      category.files.forEach((file) => {
        let fileToUpload = file;
        
        // Renaming logic based on requirements
        let prefix = '';
        // Use first 10 chars of title, replace potentially problematic chars for filenames
        const titlePart = data.projectTitle.substring(0, 10).replace(/[\/\\:]/g, '_');
        
        switch (category.key) {
          case 'verantwortung':
            prefix = 'Verpflichtung_';
            break;
          case 'schulung_uni':
            prefix = 'SchulungGU_';
            break;
          case 'schulung_ukf':
            prefix = 'SchulungUKF_';
            break;
          case 'datenschutzkonzept':
            prefix = `DSK_${titlePart}_`;
            break;
          case 'einwilligung':
            prefix = `EW_${titlePart}_`;
            break;
          case 'ethikvotum':
            prefix = 'ethik_';
            break;
          // 'sonstiges' keeps original name as per implied requirements (only specific prefixes listed)
        }

        if (prefix) {
          const newName = prefix + file.name;
          fileToUpload = new File([file], newName, { type: file.type });
          console.log(`[API] Renamed file: ${file.name} -> ${newName}`);
        }

        formData.append('files', fileToUpload);
        categoryMap[fileToUpload.name] = category.key;
        totalFileSize += fileToUpload.size;
        console.log(`[API] Added file to FormData: ${fileToUpload.name} (${fileToUpload.size} bytes, category: ${category.key})`);
      });
    });

    // Add category mapping
    formData.append('file_categories', JSON.stringify(categoryMap));
    console.log('[API] File categories mapping:', categoryMap);
    console.log(`[API] Total upload size: ${(totalFileSize / 1024 / 1024).toFixed(2)} MB`);

    const uploadUrl = `${API_BASE_URL}/upload`;
    console.log(`[API] Sending request to: ${uploadUrl}`);

    try {
      const startTime = Date.now();
      const response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
        },
        body: formData,
      });

      const duration = Date.now() - startTime;
      console.log(`[API] Response received after ${duration}ms`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (!response.ok) {
        let errorMessage = `Upload fehlgeschlagen (Status ${response.status})`;
        
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'Authentifizierung fehlgeschlagen. Bitte überprüfen Sie das API-Token.';
          console.error('[API] Authentication failed', {
            status: response.status,
            statusText: response.statusText
          });
        } else {
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
            console.error('[API] Upload failed with error response:', errorData);
          } catch (parseError) {
            const text = await response.text().catch(() => 'Unable to read error response');
            console.error('[API] Upload failed, unable to parse error response:', {
              status: response.status,
              statusText: response.statusText,
              responseText: text.substring(0, 500) // Limit log size
            });
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log('[API] Upload successful:', result);
      
      return {
        success: result.success,
        timestamp: result.timestamp,
        project_id: result.project_id,
        files_uploaded: result.files_uploaded,
        message: result.message,
      };
    } catch (error) {
      if (error instanceof Error) {
        console.error('[API] Upload error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
      } else {
        console.error('[API] Upload error (unknown type):', error);
      }
      // Re-throw with user-friendly message if possible, or pass through
      throw error;
    }
  }
};
