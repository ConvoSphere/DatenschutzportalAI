import { useState } from 'react';
import { X, Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PDFPreviewProps {
  file: File;
  onClose: () => void;
}

export function PDFPreview({ file, onClose }: PDFPreviewProps) {
  const [zoom, setZoom] = useState(100);
  const { t } = useLanguage();
  
  const fileUrl = URL.createObjectURL(file);

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = fileUrl;
    a.download = file.name;
    a.click();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex-1 min-w-0">
            <h2 className="text-gray-900 truncate">{file.name}</h2>
            <p className="text-gray-500 text-sm">
              {(file.size / 1024).toFixed(2)} KB
            </p>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Zoom out"
            >
              <ZoomOut className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-gray-600 text-sm w-12 text-center">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Zoom in"
            >
              <ZoomIn className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded transition-colors"
              aria-label={t('upload.close')}
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div 
            className="mx-auto bg-white shadow-lg"
            style={{ 
              width: `${zoom}%`,
              minWidth: '600px',
            }}
          >
            {file.type === 'application/pdf' ? (
              <object
                data={fileUrl}
                type="application/pdf"
                className="w-full h-[800px]"
              >
                <div className="p-8 text-center">
                  <p className="text-gray-600 mb-4">
                    PDF kann nicht angezeigt werden.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                  >
                    PDF herunterladen
                  </button>
                </div>
              </object>
            ) : (
              <div className="p-8 text-center">
                <p className="text-gray-600 mb-4">
                  Vorschau nur für PDF-Dateien verfügbar.
                </p>
                <button
                  onClick={handleDownload}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Datei herunterladen
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
