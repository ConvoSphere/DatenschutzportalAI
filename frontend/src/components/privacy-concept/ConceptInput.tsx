import React, { useState, useEffect } from 'react';
import { Upload, FileText, Loader2, Wand2 } from 'lucide-react';
import { extractData } from '../../services/privacyConceptApi';
import { ExtractedStudyData } from '../../types/privacy-concept';
import { toast } from 'sonner';

interface ConceptInputProps {
  onDataExtracted: (data: ExtractedStudyData) => void;
}

const LOADING_MESSAGES = [
  "Analysiere Dokumentenstruktur...",
  "Extrahiere Metadaten...",
  "Identifiziere Datenquellen...",
  "Prüfe auf Pseudonymisierung...",
  "Fasse Studienziele zusammen..."
];

export function ConceptInput({ onDataExtracted }: ConceptInputProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      let i = 0;
      interval = setInterval(() => {
        i = (i + 1) % LOADING_MESSAGES.length;
        setLoadingMessage(LOADING_MESSAGES[i]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleAnalyze = async () => {
    if (files.length === 0 && !text.trim()) {
      toast.error("Bitte laden Sie eine Datei hoch oder geben Sie Text ein.");
      return;
    }

    setIsLoading(true);
    try {
      const data = await extractData(files, text);
      toast.success("Analyse erfolgreich!");
      onDataExtracted(data);
    } catch (error) {
      toast.error("Fehler bei der Analyse: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
      {/* Left: Input */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Forschungsantrag hochladen</h2>
          <p className="text-gray-600">Laden Sie Ihren Antrag (PDF, DOCX) hoch oder fügen Sie den Text direkt ein.</p>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-gray-50">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            accept=".pdf,.docx,.doc,.txt"
          />
          <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8" />
            </div>
            <span className="text-lg font-medium text-gray-700">Dateien auswählen</span>
            <span className="text-sm text-gray-500 mt-2">Drag & Drop oder klicken</span>
          </label>
          {files.length > 0 && (
            <div className="mt-4 text-left w-full">
              <p className="font-semibold text-gray-700 mb-2">Ausgewählte Dateien:</p>
              <ul className="space-y-1">
                {files.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4" /> {f.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ODER Text einfügen</span>
          </div>
        </div>

        <textarea
          className="w-full h-40 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Fügen Sie hier den Text Ihres Forschungsantrags ein..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>{loadingMessage}</span>
            </>
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Antrag analysieren
            </>
          )}
        </button>
      </div>

      {/* Right: Info / Preview */}
      <div className="hidden md:flex flex-col justify-center items-center bg-blue-50 rounded-2xl p-8 text-center">
         {/* Using a placeholder logo or icon if image not available */}
         <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mb-6 opacity-80">
            <Wand2 className="w-16 h-16 text-blue-500" />
         </div>
         
         <h3 className="text-xl font-semibold text-blue-900 mb-4">Wie es funktioniert</h3>
         <div className="space-y-6 text-blue-800 max-w-sm">
            <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 font-bold">1</div>
                <p>KI analysiert Ihren Antrag auf datenschutzrelevante Informationen.</p>
            </div>
            <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 font-bold">2</div>
                <p>Sie überprüfen die extrahierten Daten und korrigieren bei Bedarf.</p>
            </div>
            <div className="flex items-start gap-4 text-left">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center flex-shrink-0 font-bold">3</div>
                <p>Das vollständige Datenschutzkonzept wird automatisch generiert.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
