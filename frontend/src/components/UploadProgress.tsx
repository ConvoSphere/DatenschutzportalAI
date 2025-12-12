import { useEffect, useState, useMemo } from 'react';
import { Upload, CheckCircle2, Cloud, Mail, FileCheck, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type UploadPhase = 
  | 'preparing'
  | 'validating'
  | 'connecting'
  | 'uploading'
  | 'processing'
  | 'email'
  | 'completing'
  | 'done';

interface PhaseInfo {
  label: string;
  icon: React.ReactNode;
  progress: number;
  description: string;
}

interface UploadProgressProps {
  isUploading: boolean;
  filesCount: number;
}

const PHASE_ORDER: UploadPhase[] = [
  'preparing',
  'validating',
  'connecting',
  'uploading',
  'processing',
  'email',
  'completing',
];

export function UploadProgress({ isUploading, filesCount }: UploadProgressProps) {
  const { t } = useLanguage();
  const [currentPhase, setCurrentPhase] = useState<UploadPhase>('preparing');
  const [progress, setProgress] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const phases: Record<UploadPhase, PhaseInfo> = useMemo(() => ({
    preparing: {
      label: t('upload.phase.preparing'),
      icon: <FileCheck className="w-6 h-6 text-blue-600" />,
      progress: 5,
      description: t('upload.phase.preparing.desc'),
    },
    validating: {
      label: t('upload.phase.validating'),
      icon: <FileCheck className="w-6 h-6 text-blue-600" />,
      progress: 15,
      description: t('upload.phase.validating.desc'),
    },
    connecting: {
      label: t('upload.phase.connecting'),
      icon: <Cloud className="w-6 h-6 text-blue-600" />,
      progress: 25,
      description: t('upload.phase.connecting.desc'),
    },
    uploading: {
      label: t('upload.phase.uploading'),
      icon: <Upload className="w-6 h-6 text-blue-600" />,
      progress: 60,
      description: t('upload.phase.uploading.desc', { count: filesCount }),
    },
    processing: {
      label: t('upload.phase.processing'),
      icon: <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />,
      progress: 80,
      description: t('upload.phase.processing.desc'),
    },
    email: {
      label: t('upload.phase.email'),
      icon: <Mail className="w-6 h-6 text-blue-600" />,
      progress: 95,
      description: t('upload.phase.email.desc'),
    },
    completing: {
      label: t('upload.phase.completing'),
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      progress: 98,
      description: t('upload.phase.completing.desc'),
    },
    done: {
      label: t('upload.phase.done'),
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      progress: 100,
      description: t('upload.phase.done.desc'),
    },
  }), [t, filesCount]);

  useEffect(() => {
    if (!isUploading) {
      if (progress > 0) {
        setCurrentPhase('done');
        setProgress(100);
      }
      return;
    }

    // Reset when starting
    setProgress(0);
    setElapsedTime(0);
    setCurrentPhase('preparing');

    const startTime = Date.now();
    let phaseIndex = 0;
    const updatePhase = () => {
      if (phaseIndex < PHASE_ORDER.length) {
        const phase = PHASE_ORDER[phaseIndex];
        setCurrentPhase(phase);
        setProgress(phases[phase].progress);
        phaseIndex++;
      }
    };

    // Initial phase
    updatePhase();

    // Phase transitions based on elapsed time
    const timers: NodeJS.Timeout[] = [];
    
    // Move through phases with increasing delays
    timers.push(setTimeout(() => updatePhase(), 500)); // preparing -> validating
    timers.push(setTimeout(() => updatePhase(), 1500)); // validating -> connecting
    timers.push(setTimeout(() => updatePhase(), 2500)); // connecting -> uploading
    
    // Uploading phase - longer duration based on file count
    const uploadDuration = Math.min(3000 + filesCount * 500, 8000);
    timers.push(setTimeout(() => updatePhase(), 2500 + uploadDuration)); // uploading -> processing
    
    timers.push(setTimeout(() => updatePhase(), 2500 + uploadDuration + 2000)); // processing -> email
    
    // Email phase can take longer, especially if there are issues
    timers.push(setTimeout(() => updatePhase(), 2500 + uploadDuration + 2000 + 5000)); // email -> completing

    // Update elapsed time
    const timeInterval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearInterval(timeInterval);
    };
  }, [isUploading, filesCount, phases]);

  if (!isUploading && progress === 0) {
    return null;
  }

  const currentPhaseInfo = phases[currentPhase];
  const isComplete = currentPhase === 'done';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="text-center mb-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
            isComplete ? 'bg-green-100' : 'bg-blue-100'
          }`}>
            {currentPhaseInfo.icon}
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {isComplete ? t('upload.complete') : t('upload.inProgress')}
          </h2>
          <p className="text-gray-600 mb-1">
            {filesCount} {filesCount === 1 ? t('upload.file') : t('upload.files')}
          </p>
          {elapsedTime > 0 && (
            <p className="text-gray-500 text-sm">
              {t('upload.elapsedTime', { seconds: elapsedTime })}
            </p>
          )}
        </div>

        {/* Current Phase Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {currentPhaseInfo.label}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}%
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isComplete ? 'bg-green-600' : 'bg-blue-600'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Phase Description */}
          <p className="text-sm text-gray-600 mt-2">
            {currentPhaseInfo.description}
          </p>
        </div>

        {/* Phase Steps */}
        <div className="mt-6 space-y-2">
          {PHASE_ORDER.map((phase) => {
            const phaseInfo = phases[phase];
            const isActive = currentPhase === phase;
            const currentIndex = PHASE_ORDER.indexOf(currentPhase);
            const phaseIndex = PHASE_ORDER.indexOf(phase);
            const isCompleted = currentIndex > phaseIndex;
            
            return (
              <div
                key={phase}
                className={`flex items-center gap-3 text-sm transition-colors ${
                  isActive
                    ? 'text-blue-700 font-medium'
                    : isCompleted
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${
                  isActive
                    ? 'bg-blue-600 animate-pulse'
                    : isCompleted
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`} />
                <span>{phaseInfo.label}</span>
              </div>
            );
          })}
        </div>

        {/* Additional Info for Long-Running Operations */}
        {elapsedTime > 10 && currentPhase === 'email' && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              {t('upload.emailDelay')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
