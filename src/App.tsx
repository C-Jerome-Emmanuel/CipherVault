/**
 * CipherVault Enterprise - Main Application Root
 * Enhanced CP-ABE Cloud File Sharing Platform with Hybrid AES-256-GCM & SHA-256
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { UploadModal } from './components/UploadModal';
import { FileExplorerView } from './components/FileExplorerView';
import { CPABEStudioView } from './components/CPABEStudioView';
import { UserAttributeManagerView } from './components/UserAttributeManagerView';
import { SecurityCenterView } from './components/SecurityCenterView';
import { AnalyticsDashboardView } from './components/AnalyticsDashboardView';
import { AuditReportsView } from './components/AuditReportsView';
import { ArchitectureDocsView } from './components/ArchitectureDocsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'explorer':
      case 'files':
        return <FileExplorerView />;
      case 'cpabe':
      case 'policy-studio':
        return <CPABEStudioView />;
      case 'users':
      case 'attributes':
        return <UserAttributeManagerView />;
      case 'security':
      case 'security-center':
        return <SecurityCenterView />;
      case 'analytics':
        return <AnalyticsDashboardView />;
      case 'audits':
        return <AuditReportsView defaultTab="logs" />;
      case 'reports':
        return <AuditReportsView defaultTab="compliance" />;
      case 'artifacts':
        return <ArchitectureDocsView defaultTab="docker" />;
      case 'diagrams':
      case 'architecture':
        return <ArchitectureDocsView defaultTab="abe" />;
      default:
        return <FileExplorerView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation Bar with Persona Switcher & Live Notifications */}
      <Navbar />

      {/* Main Container: Sidebar + Content Canvas */}
      <div className="flex-1 flex max-w-[1700px] w-full mx-auto">
        <Sidebar />

        <main className="flex-1 min-w-0 pb-16 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <UploadModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
