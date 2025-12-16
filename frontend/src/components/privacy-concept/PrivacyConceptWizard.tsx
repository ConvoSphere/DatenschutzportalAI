import React, { useState } from 'react';
import { ArrowLeft, FileText, Wand2 } from 'lucide-react';
import { ConceptInput } from './ConceptInput';
import { ConceptExtractionReview } from './ConceptExtractionReview';
import { ConceptResult } from './ConceptResult';
import { ExtractedStudyData, ConceptStep } from '../../types/privacy-concept';
import { useLanguage } from '../../contexts/LanguageContext';

interface PrivacyConceptWizardProps {
  onBack: () => void;
}

export function PrivacyConceptWizard({ onBack }: PrivacyConceptWizardProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState<ConceptStep>('input');
  const [extractedData, setExtractedData] = useState<ExtractedStudyData | null>(null);
  const [generatedConcept, setGeneratedConcept] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
            <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
            <ArrowLeft className="w-5 h-5" />
            <span>Zurück</span>
            </button>
            
            <div className="flex items-center gap-2 text-blue-700">
                <Wand2 className="w-6 h-6" />
                <h1 className="text-xl font-bold">AI Privacy Concept Generator</h1>
            </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden min-h-[600px]">
            {/* Stepper / Progress could go here */}
            
            <div className="p-6">
                {step === 'input' && (
                    <ConceptInput 
                        onDataExtracted={(data) => {
                            setExtractedData(data);
                            setStep('review');
                        }} 
                    />
                )}
                
                {step === 'review' && extractedData && (
                    <ConceptExtractionReview
                        data={extractedData}
                        onUpdate={setExtractedData}
                        onGenerate={(concept) => {
                            setGeneratedConcept(concept);
                            setStep('result');
                        }}
                        onBack={() => setStep('input')}
                    />
                )}
                
                {step === 'result' && generatedConcept && (
                    <ConceptResult
                        concept={generatedConcept}
                        data={extractedData}
                        onBack={() => setStep('review')}
                    />
                )}
            </div>
        </div>
      </div>
    </div>
  );
}
