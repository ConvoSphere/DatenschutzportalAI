import React from 'react';
import { ExtractedStudyData } from '../../types/privacy-concept';
import { downloadDocx } from '../../services/privacyConceptApi';
import { Download, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface ConceptResultProps {
  concept: string;
  data: ExtractedStudyData;
  onBack: () => void;
}

export function ConceptResult({ concept, data, onBack }: ConceptResultProps) {
    const handleDownload = async () => {
        try {
            await downloadDocx(concept);
            toast.success("Download gestartet");
        } catch (error) {
            toast.error("Download fehlgeschlagen");
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(concept);
        toast.success("In die Zwischenablage kopiert");
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Datenschutzkonzept</h2>
                <div className="flex gap-4 items-center">
                     <button onClick={onBack} className="text-gray-600 hover:text-gray-900">Zurück</button>
                     <button 
                        onClick={handleDownload} 
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 shadow-sm transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        Download als DOCX
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-gray-50 border rounded-xl overflow-hidden flex flex-col min-h-[500px]">
                <div className="bg-gray-100 p-3 border-b flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Vorschau (Markdown)</span>
                    <button onClick={handleCopy} className="text-gray-500 hover:text-blue-600 p-1 rounded hover:bg-white transition-colors" title="Kopieren">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex-1 overflow-auto p-8 bg-white">
                    <div className="prose max-w-none whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                        {concept}
                    </div>
                </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-blue-900 font-semibold mb-2">Nächste Schritte</h3>
                <ul className="list-disc list-inside text-blue-800 space-y-1">
                    <li>Laden Sie das Dokument herunter (.docx).</li>
                    <li>Öffnen Sie es in Word und prüfen Sie die Formatierung.</li>
                    <li>Ergänzen Sie ggf. spezifische Details, die im Antrag nicht enthalten waren.</li>
                    <li>Reichen Sie es zusammen mit Ihrem Ethikantrag ein.</li>
                </ul>
            </div>
        </div>
    );
}
