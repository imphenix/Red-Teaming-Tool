import React from 'react';
import { 
  ShieldAlert, 
  LayoutDashboard, 
  Globe, 
  Search, 
  AlertOctagon, 
  FileText, 
  BookOpen, 
  Sliders, 
  Compass,
  RotateCcw,
  FileCode,
  Flame
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onResetDemo: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  onResetDemo,
  isOpenMobile,
  onCloseMobile
}) => {
  const navSections = [
    {
      heading: 'WORKSPACE',
      items: [
        { id: 'overview', label: 'Security Overview', icon: LayoutDashboard },
        { id: 'scan-new', label: 'Scan File or Link', icon: Search },
        { id: 'assets', label: 'Assets', icon: Globe },
        { id: 'scans', label: 'Assessments', icon: FileCode },
        { id: 'findings', label: 'Findings', icon: AlertOctagon },
        { id: 'reports', label: 'Reports', icon: FileText },
      ]
    },
    {
      heading: 'INTELLIGENCE',
      items: [
        { id: 'kali-tools', label: 'Kali Tools Arsenal', icon: Flame },
        { id: 'database', label: 'Vulnerability Library', icon: BookOpen },
        { id: 'methodology', label: 'Methodology', icon: Compass },
      ]
    },
    {
      heading: 'SETTINGS',
      items: [
        { id: 'settings', label: 'Workspace Settings', icon: Sliders },
      ]
    }
  ];

  const handleItemClick = (pageId: string) => {
    onNavigate(pageId);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-[#10141B] border-r border-[#252C38] flex flex-col transition-transform duration-200 ease-in-out md:translate-x-0 ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Brand Lockup */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#252C38] bg-[#090B0F]/50">
          <button 
            onClick={() => handleItemClick('landing')}
            className="flex items-center gap-2.5 text-left focus:outline-hidden"
          >
            <div className="w-8 h-8 rounded-lg bg-[#FF3548]/15 border border-[#FF3548]/30 flex items-center justify-center text-[#FF3548]">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-[#F3F5F8] block">CODE RED TOOL</span>
              <span className="text-[10px] text-[#98A2B3] tracking-wide block uppercase">VAPT Platform</span>
            </div>
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map(section => (
            <div key={section.heading}>
              <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#98A2B3]/70 uppercase">
                {section.heading}
              </div>
              <div className="space-y-1">
                {section.items.map(item => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left whitespace-nowrap ${
                        isActive
                          ? 'bg-[#FF3548]/15 text-[#FF3548] border border-[#FF3548]/25'
                          : 'text-[#98A2B3] hover:text-[#F3F5F8] hover:bg-[#141922]'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#FF3548]' : 'text-[#98A2B3]'}`} />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Demo Mode & Reset Footer */}
        <div className="p-4 border-t border-[#252C38] bg-[#090B0F]/30 space-y-3">
          <div className="p-2.5 rounded-lg border border-[#252C38] bg-[#141922]/60">
            <div className="flex items-center justify-between text-[11px] font-medium text-[#F3F5F8]">
              <span>Demo Workspace</span>
              <span className="text-[10px] text-[#35C98A] font-mono">Simulated</span>
            </div>
            <p className="mt-1 text-[11px] text-[#98A2B3] leading-relaxed">
              Authorized safe environment with non-destructive telemetry.
            </p>
          </div>
          <button
            onClick={onResetDemo}
            className="w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-xs font-medium text-[#98A2B3] hover:text-[#F3F5F8] hover:bg-[#141922] border border-[#252C38] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </aside>
    </>
  );
};
