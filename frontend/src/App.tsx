import { DataProtectionPortal } from './components/DataProtectionPortal';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  return (
    <LanguageProvider>
      <DataProtectionPortal />
    </LanguageProvider>
  );
}