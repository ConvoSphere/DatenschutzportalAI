import { useEffect, useState } from 'react';
import { Upload, CheckCircle2 } from 'lucide-react';

interface UploadProgressProps {
  isUploading: boolean;
  filesCount: number;
}

export function UploadProgress({ isUploading, filesCount }: UploadProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (isUploading) {
      setProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 95) {
            return 95; // Stay at 95% until actual upload completes
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      return () => clearInterval(interval);
    } else {
      // Complete the progress when upload is done
      if (progress > 0) {
        setProgress(100);
      }
    }
  }, [isUploading, progress]);

  if (!isUploading && progress === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          {progress < 100 ? (
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-blue-600 animate-pulse" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          )}
          
          <h2 className="text-gray-900 mb-2">
            {progress < 100 ? 'Dokumente werden hochgeladen...' : 'Upload abgeschlossen!'}
          </h2>
          <p className="text-gray-600">
            {filesCount} {filesCount === 1 ? 'Datei' : 'Dateien'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-600 text-sm">{Math.round(progress)}%</span>
            {progress < 100 && (
              <span className="text-gray-500 text-sm">Bitte warten...</span>
            )}
          </div>
        </div>

        {/* File List */}
        {progress > 0 && progress < 100 && (
          <div className="mt-4 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              <span>Verbindung zur Hessenbox wird hergestellt...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
