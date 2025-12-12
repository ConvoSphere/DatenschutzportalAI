import { useRef, useState } from 'react';
import { Upload, X, FileText, FileArchive, Eye } from 'lucide-react';
import { PDFPreview } from './PDFPreview';
import { useLanguage } from '../contexts/LanguageContext';
import { FileCategory } from '../types';

interface FileUploadSectionProps {
  category: FileCategory;
  isRequired: boolean;
  onFilesAdded: (files: File[]) => void;
  onFileRemoved: (index: number) => void;
}

export function FileUploadSection({
  category,
  isRequired,
  onFilesAdded,
  onFileRemoved,
}: FileUploadSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onFilesAdded(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFilesAdded(files);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isZipFile = (filename: string): boolean => {
    return filename.toLowerCase().endsWith('.zip');
  };

  const isPDFFile = (filename: string): boolean => {
    return filename.toLowerCase().endsWith('.pdf');
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <label className="text-gray-900">
          {t(`category.${category.key}`)}
          {isRequired && <span className="text-red-500 ml-1">{t('form.required')}</span>}
        </label>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-400 rounded-lg p-6 text-center cursor-pointer hover:border-blue-600 hover:bg-blue-50 transition-colors bg-white shadow-sm"
      >
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-600 mb-1">
          {t('upload.dropzone')}
        </p>
        <p className="text-gray-500 text-sm">
          {t('upload.formats')}
        </p>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept=".pdf,.doc,.docx,.zip,.png,.jpg,.jpeg,.odt,.ods,.odp"
        />
      </div>

      {/* Uploaded Files List */}
      {category.files.length > 0 && (
        <div className="mt-3 space-y-2">
          {category.files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {isZipFile(file.name) ? (
                  <FileArchive className="w-5 h-5 text-blue-600 flex-shrink-0" />
                ) : (
                  <FileText className="w-5 h-5 text-gray-600 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-gray-900 truncate">{file.name}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 ml-2">
                {isPDFFile(file.name) && (
                  <button
                    type="button"
                    onClick={() => setPreviewFile(file)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                    aria-label={t('upload.preview')}
                  >
                    <Eye className="w-5 h-5 text-blue-600" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onFileRemoved(index)}
                  className="p-1 hover:bg-gray-200 rounded transition-colors"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewFile && (
        <PDFPreview
          file={previewFile}
          onClose={() => setPreviewFile(null)}
        />
      )}
    </div>
  );
}