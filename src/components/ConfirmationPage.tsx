import { CheckCircle2, Mail, FileText, Calendar, User, ArrowLeft } from 'lucide-react';

interface ConfirmationPageProps {
  email: string;
  uploaderName: string;
  projectTitle: string;
  uploadedFiles: Array<{ category: string; fileName: string }>;
  uploadTimestamp: string;
  onNewUpload: () => void;
}

export function ConfirmationPage({
  email,
  uploaderName,
  projectTitle,
  uploadedFiles,
  uploadTimestamp,
  onNewUpload,
}: ConfirmationPageProps) {
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-8 mb-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>
          
          <h1 className="text-gray-900 mb-2">Upload erfolgreich abgeschlossen!</h1>
          
          <p className="text-gray-600 max-w-xl mx-auto">
            Ihre Dokumente wurden erfolgreich hochgeladen und in der Hessenbox gespeichert. 
            Eine Bestätigungs-E-Mail wurde an Ihre E-Mail-Adresse versendet.
          </p>
        </div>

        {/* Upload Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Upload-Details</h2>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Projekttitel</p>
                <p className="text-gray-900">{projectTitle}</p>
              </div>
            </div>

            {uploaderName && (
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-gray-500 text-sm">Uploader</p>
                  <p className="text-gray-900">{uploaderName}</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">E-Mail-Adresse</p>
                <p className="text-gray-900 break-all">{email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Upload-Zeitpunkt</p>
                <p className="text-gray-900">{formatDate(uploadTimestamp)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Uploaded Files */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-gray-900 mb-4">
            Hochgeladene Dokumente ({uploadedFiles.length})
          </h2>
          
          <div className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <FileText className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-gray-900 truncate">{file.fileName}</p>
                  <p className="text-gray-500 text-sm">{file.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* E-Mail Notification */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex gap-3">
            <Mail className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-blue-900 mb-2">E-Mail-Benachrichtigung</h3>
              <p className="text-blue-800 mb-3">
                Eine Bestätigungs-E-Mail wurde an <span className="break-all">{email}</span> gesendet 
                mit allen Details zu Ihrem Upload.
              </p>
              <p className="text-blue-700 text-sm">
                Das Datenschutz-Team wurde ebenfalls über Ihren Upload informiert und wird 
                Ihre Dokumente zeitnah prüfen.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-gray-900 mb-3">Wie geht es weiter?</h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Das Datenschutz-Team prüft Ihre hochgeladenen Dokumente</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Bei Rückfragen werden Sie per E-Mail kontaktiert</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>Nach erfolgreicher Prüfung erhalten Sie eine Freigabe</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onNewUpload}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Weiteren Upload durchführen</span>
          </button>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Bei Fragen wenden Sie sich bitte an das Datenschutz-Team</p>
          <p>Universität Frankfurt / Universitätsklinik</p>
        </div>
      </div>
    </div>
  );
}
