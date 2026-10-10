import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { LandingPage } from '../../pages/LandingPage';
import { OverviewPage } from '../../pages/OverviewPage';
import { AssetsPage } from '../../pages/AssetsPage';
import { ScansListPage } from '../../pages/ScansListPage';
import { ScanNewPage } from '../../pages/ScanNewPage';
import { FindingsPage } from '../../pages/FindingsPage';
import { ReportsPage } from '../../pages/ReportsPage';
import { VulnerabilityDatabasePage } from '../../pages/VulnerabilityDatabasePage';
import { KaliToolsPage } from '../../pages/KaliToolsPage';
import { MethodologyPage } from '../../pages/MethodologyPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { useSecurity } from '../../context/SecurityContext';

export const AppShell: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [selectedFindingId, setSelectedFindingId] = useState<string | undefined>(undefined);
  const [selectedAssetIdForScan, setSelectedAssetIdForScan] = useState<string | undefined>(undefined);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { resetToDemoData } = useSecurity();

  const handleNavigate = (page: string, extraParam?: string) => {
    if (page === 'findings' && extraParam) {
      setSelectedFindingId(extraParam);
    } else {
      setSelectedFindingId(undefined);
    }

    if (page === 'scan-new' && extraParam) {
      setSelectedAssetIdForScan(extraParam);
    } else {
      setSelectedAssetIdForScan(undefined);
    }

    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartScanForAsset = (assetId: string) => {
    setSelectedAssetIdForScan(assetId);
    setCurrentPage('scan-new');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If on public marketing landing page
  if (currentPage === 'landing') {
    return (
      <LandingPage
        onEnterWorkspace={() => handleNavigate('overview')}
        onExploreLibrary={() => handleNavigate('database')}
        onViewMethodology={() => handleNavigate('methodology')}
      />
    );
  }

  // Authenticated Security Workspace
  return (
    <div className="min-h-screen bg-[#090B0F] text-[#F3F5F8] flex">
      {/* Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onResetDemo={resetToDemoData}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        <TopBar
          currentPage={currentPage}
          onNavigate={handleNavigate}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          {currentPage === 'overview' && (
            <OverviewPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'assets' && (
            <AssetsPage
              onNavigate={handleNavigate}
              onStartScanForAsset={handleStartScanForAsset}
            />
          )}

          {currentPage === 'scans' && (
            <ScansListPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'scan-new' && (
            <ScanNewPage
              onNavigate={handleNavigate}
              defaultAssetId={selectedAssetIdForScan}
            />
          )}

          {currentPage === 'findings' && (
            <FindingsPage
              initialSelectedFindingId={selectedFindingId}
            />
          )}

          {currentPage === 'reports' && (
            <ReportsPage />
          )}

          {currentPage === 'database' && (
            <VulnerabilityDatabasePage />
          )}

          {currentPage === 'kali-tools' && (
            <KaliToolsPage onNavigate={handleNavigate} />
          )}

          {currentPage === 'methodology' && (
            <MethodologyPage />
          )}

          {currentPage === 'settings' && (
            <SettingsPage />
          )}
        </main>
      </div>
    </div>
  );
};
