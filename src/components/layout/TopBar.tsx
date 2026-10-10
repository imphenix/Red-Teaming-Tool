import React, { useState } from 'react';
import { Menu, Plus, ShieldCheck, Github } from 'lucide-react';
import { GitHubUploadModal } from '../ui/GitHubUploadModal';

interface TopBarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileMenu
}) => {
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentPage) {
      case 'overview': return 'Security Overview';
      case 'assets': return 'Authorized Assets';
      case 'scans': return 'Security Assessments';
      case 'scan-new': return 'Scan File or Link';
      case 'findings': return 'Security Findings';
      case 'reports': return 'Assessment Reports';
      case 'database': return 'Vulnerability Library';
      case 'kali-tools': return 'Kali Linux Arsenal';
      case 'methodology': return 'Methodology & Standards';
      case 'settings': return 'Workspace Settings';
      default: return 'Overview';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 h-16 bg-[#090B0F]/90 backdrop-blur-md border-b border-[#252C38] px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Breadcrumbs */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-1.5 text-[#98A2B3] hover:text-[#F3F5F8] md:hidden rounded-md hover:bg-[#141922]"
            aria-label="Open sidebar menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#98A2B3] hidden sm:inline">Workspace</span>
            <span className="text-[#252C38] hidden sm:inline">/</span>
            <h1 className="text-sm font-semibold text-[#F3F5F8] whitespace-nowrap">
              {getBreadcrumbTitle()}
            </h1>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-[#10141B] border border-[#252C38] rounded-md text-[11px] text-[#98A2B3]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#35C98A]" />
            <span>Non-Destructive Safe Probes Active</span>
          </div>

          <button
            onClick={() => setIsGitHubModalOpen(true)}
            className="flex items-center gap-1.5 py-1.5 px-3 bg-[#141922] hover:bg-[#1a212d] border border-[#252C38] hover:border-[#35C98A]/50 text-[#F3F5F8] rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          >
            <Github className="w-3.5 h-3.5 text-[#35C98A]" />
            <span>Upload to GitHub</span>
          </button>

          <button
            onClick={() => onNavigate('scan-new')}
            className="flex items-center gap-1.5 py-1.5 px-3.5 bg-[#FF3548] hover:bg-[#FF3548]/90 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-red-500/10 transition-all whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Assessment</span>
          </button>
        </div>
      </header>

      <GitHubUploadModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </>
  );
};
