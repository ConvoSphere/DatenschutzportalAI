import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FileCategory, Institution, ProjectType, WorkflowStep } from '../types';
import { api } from '../services/api';

export function useDataProtectionWorkflow() {
  const { t } = useLanguage();

  // Workflow state
  const [currentStep, setCurrentStep] = useState<WorkflowStep>('projectType');
  const [selectedInstitution, setSelectedInstitution] = useState<Institution>('university');
  const [selectedProjectType, setSelectedProjectType] = useState<ProjectType>(null);

  // Form state
  const [email, setEmail] = useState('');
  const [uploaderName, setUploaderName] = useState('');
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDetails, setProjectDetails] = useState('');
  const [isProspectiveStudy, setIsProspectiveStudy] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadTimestamp, setUploadTimestamp] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  const [categories, setCategories] = useState<FileCategory[]>([
    { key: 'datenschutzkonzept', label: 'Datenschutzkonzept', required: true, files: [] },
    { key: 'verantwortung', label: 'Übernahme der Verantwortung', required: true, files: [] },
    { key: 'schulung_uni', label: 'Schulung Uni Nachweis', required: true, files: [] },
    { key: 'schulung_ukf', label: 'Schulung UKF Nachweis', required: true, files: [] },
    { key: 'einwilligung', label: 'Einwilligung', required: false, conditionalRequired: true, files: [] },
    { key: 'ethikvotum', label: 'Ethikvotum', required: false, files: [] },
    { key: 'sonstiges', label: 'Sonstiges', required: false, files: [] },
  ]);

  // Workflow handlers
  const handleInstitutionSelect = (institution: Institution) => {
    setSelectedInstitution(institution);
    setCurrentStep('projectType');
  };

  const handleProjectTypeSelect = (type: ProjectType) => {
    setSelectedProjectType(type);
    if (type === 'new') {
      setCurrentStep('form');
    } else {
      setCurrentStep('existingProject');
    }
  };

  const handleBackToInstitution = () => {
    // Institution selection removed
    // setCurrentStep('institution');
    // setSelectedInstitution(null);
    // setSelectedProjectType(null);
  };

  const handleBackToProjectType = () => {
    setCurrentStep('projectType');
    setSelectedProjectType(null);
  };

  const handleFilesAdded = (categoryKey: string, newFiles: File[]) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: [...cat.files, ...newFiles] }
          : cat
      )
    );
  };

  const handleFileRemoved = (categoryKey: string, fileIndex: number) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.key === categoryKey
          ? { ...cat, files: cat.files.filter((_, i) => i !== fileIndex) }
          : cat
      )
    );
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];
    const newWarnings: string[] = [];

    // Pflichtfelder prüfen
    if (!email.trim()) {
      newErrors.push('E-Mail-Adresse ist erforderlich');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.push('Bitte geben Sie eine gültige E-Mail-Adresse ein');
    }

    if (!projectTitle.trim()) {
      newErrors.push('Projekttitel ist erforderlich');
    }

    // Kategorien prüfen
    categories.forEach(cat => {
      const isRequired = cat.required || (cat.conditionalRequired && isProspectiveStudy);
      
      if (isRequired && cat.files.length === 0) {
        newErrors.push(`${cat.label} ist ein Pflichtfeld`);
      }
    });

    setErrors(newErrors);
    setWarnings(newWarnings);

    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      console.warn('[Workflow] Form validation failed');
      return;
    }

    console.log('[Workflow] Starting form submission', {
      email,
      projectTitle,
      institution: selectedInstitution,
      projectType: selectedProjectType,
      categoriesCount: categories.length,
      totalFiles: categories.reduce((sum, cat) => sum + cat.files.length, 0)
    });

    setIsSubmitting(true);
    setErrors([]);

    try {
      const result = await api.upload({
        email,
        uploaderName,
        projectTitle,
        projectDetails,
        institution: selectedInstitution || 'university',
        isProspectiveStudy,
        categories,
        projectType: selectedProjectType
      });

      console.log('[Workflow] Upload completed successfully:', result);

      if (result.success) {
        setUploadTimestamp(result.timestamp);
        setShowSuccess(true);
      } else {
        console.warn('[Workflow] Upload returned success=false:', result);
        setErrors([result.message || 'Upload wurde nicht erfolgreich abgeschlossen.']);
      }
    } catch (error) {
      let errorMessage = 'Ein Fehler ist beim Upload aufgetreten. Bitte versuchen Sie es erneut.';
      
      if (error instanceof Error) {
        console.error('[Workflow] Upload error:', {
          message: error.message,
          name: error.name,
          stack: error.stack
        });
        
        // Use the error message if it's user-friendly
        if (error.message && !error.message.includes('Failed to fetch') && !error.message.includes('NetworkError')) {
          errorMessage = error.message;
        } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          errorMessage = 'Verbindungsfehler: Die Verbindung zum Server konnte nicht hergestellt werden. Bitte überprüfen Sie Ihre Internetverbindung.';
        }
      } else {
        console.error('[Workflow] Upload error (unknown type):', error);
      }
      
      setErrors([errorMessage]);
    } finally {
      setIsSubmitting(false);
      console.log('[Workflow] Form submission finished');
    }
  };

  const handleNewUpload = () => {
    setEmail('');
    setUploaderName('');
    setProjectTitle('');
    setProjectDetails('');
    setIsProspectiveStudy(false);
    setCategories(prev => prev.map(cat => ({ ...cat, files: [] })));
    setShowSuccess(false);
    setUploadTimestamp('');
    setErrors([]);
    setWarnings([]);
    setCurrentStep('projectType');
    // Keep default institution
    setSelectedInstitution('university');
    setSelectedProjectType(null);
  };

  return {
    // State
    currentStep,
    selectedInstitution,
    selectedProjectType,
    email,
    uploaderName,
    projectTitle,
    projectDetails,
    isProspectiveStudy,
    isSubmitting,
    showSuccess,
    uploadTimestamp,
    errors,
    warnings,
    categories,
    
    // Setters (for form fields)
    setEmail,
    setUploaderName,
    setProjectTitle,
    setProjectDetails,
    setIsProspectiveStudy,
    
    // Handlers
    handleInstitutionSelect,
    handleProjectTypeSelect,
    handleBackToInstitution,
    handleBackToProjectType,
    handleFilesAdded,
    handleFileRemoved,
    handleSubmit,
    handleNewUpload
  };
}
