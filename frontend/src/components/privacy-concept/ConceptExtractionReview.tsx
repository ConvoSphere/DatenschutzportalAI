import React, { useState } from 'react';
import { ExtractedStudyData } from '../../types/privacy-concept';
import { generateConcept } from '../../services/privacyConceptApi';
import { Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface ConceptExtractionReviewProps {
  data: ExtractedStudyData;
  onUpdate: (data: ExtractedStudyData) => void;
  onGenerate: (concept: string) => void;
  onBack: () => void;
}

export function ConceptExtractionReview({ data, onUpdate, onGenerate, onBack }: ConceptExtractionReviewProps) {
    const [isLoading, setIsLoading] = useState(false);
    
    // Helper for input fields
    const handleChange = (key: keyof ExtractedStudyData, value: any) => {
        onUpdate({ ...data, [key]: value });
    };

    const handleGenerate = async () => {
        setIsLoading(true);
        try {
            const result = await generateConcept(data);
            onGenerate(result.concept_markdown);
        } catch (error) {
            toast.error("Fehler bei der Generierung: " + (error as Error).message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Extrahierte Daten überprüfen</h2>
                <div className="flex gap-4 items-center">
                     <button onClick={onBack} className="text-gray-600 hover:text-gray-900">Zurück</button>
                     <button 
                        onClick={handleGenerate} 
                        disabled={isLoading}
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition-colors shadow-sm"
                    >
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                        Konzept generieren
                    </button>
                </div>
            </div>
            
            <p className="text-gray-500">Bitte überprüfen Sie die automatisch extrahierten Daten. Sie können Felder direkt bearbeiten.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Dynamically render cards for main fields */}
                <Card title="Studientitel" value={data.study_title} onChange={(v) => handleChange('study_title', v)} multiline />
                <Card title="Studientyp" value={data.study_type} onChange={(v) => handleChange('study_type', v)} />
                <Card title="Principal Investigator" value={data.principal_investigator} onChange={(v) => handleChange('principal_investigator', v)} />
                <Card title="Institution" value={data.institution} onChange={(v) => handleChange('institution', v)} multiline />
                <Card title="Patientenzahl" value={data.patient_count} onChange={(v) => handleChange('patient_count', v)} />
                <Card title="Ethikvotum" value={data.ethics_vote || ''} onChange={(v) => handleChange('ethics_vote', v)} />
                
                <Card title="Datenarten" value={data.data_types.join(', ')} onChange={(v) => handleChange('data_types', v.split(',').map(s => s.trim()))} multiline />
                <Card title="Datenquellen" value={data.data_sources.join(', ')} onChange={(v) => handleChange('data_sources', v.split(',').map(s => s.trim()))} multiline />
                <Card title="Verarbeitungsmethoden" value={data.processing_methods} onChange={(v) => handleChange('processing_methods', v)} multiline />
                
                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Pseudonymisierung</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            checked={data.pseudonymization_usage} 
                            onChange={(e) => handleChange('pseudonymization_usage', e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span>Wird verwendet</span>
                    </div>
                </div>

                <div className="bg-white border rounded-xl p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Externe Weitergabe</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <input 
                            type="checkbox" 
                            checked={data.external_data_sharing} 
                            onChange={(e) => handleChange('external_data_sharing', e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <span>Findet statt</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Studienziel</h3>
                <textarea 
                    value={data.study_goal}
                    onChange={(e) => handleChange('study_goal', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none h-32"
                />
            </div>
        </div>
    );
}

function Card({ title, value, onChange, multiline = false }: { title: string, value: string, onChange: (v: string) => void, multiline?: boolean }) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow group flex flex-col h-full">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 group-hover:text-blue-600 transition-colors flex-shrink-0">{title}</h3>
            {multiline ? (
                <textarea 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent transition-colors resize-none text-gray-800 flex-grow"
                />
            ) : (
                 <input 
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-1 border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none bg-transparent transition-colors font-medium text-gray-800"
                />
            )}
        </div>
    )
}
