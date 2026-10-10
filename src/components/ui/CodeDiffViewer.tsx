import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

interface CodeDiffViewerProps {
  vulnerableCode?: string;
  solutionPatch?: string;
  fileName?: string;
  lineNumber?: number;
}

export const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({
  vulnerableCode,
  solutionPatch,
  fileName = 'source-file.js',
  lineNumber
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!solutionPatch) return;
    navigator.clipboard.writeText(solutionPatch);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-[#252C38] bg-[#090B0F] overflow-hidden shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#141922] border-b border-[#252C38]">
        <div className="flex items-center gap-2 text-xs">
          <FileCode className="w-3.5 h-3.5 text-[#98A2B3]" />
          <span className="font-mono text-[#F3F5F8] font-medium">{fileName}</span>
          {lineNumber && (
            <span className="text-[11px] font-mono text-[#FF8A3D]">Line {lineNumber}</span>
          )}
        </div>

        {solutionPatch && (
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#10141B] hover:bg-[#1a212d] border border-[#252C38] text-[11px] font-medium text-[#98A2B3] hover:text-[#F3F5F8] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#35C98A]" />
                <span className="text-[#35C98A]">Copied Patch</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Patch</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Diff Content */}
      <div className="divide-y divide-[#252C38]/60 text-xs font-mono">
        {/* Vulnerable code block */}
        {vulnerableCode && (
          <div className="bg-[#FF3548]/5 p-3.5 border-l-2 border-[#FF3548]">
            <div className="flex items-center justify-between text-[10px] text-[#FF3548] font-semibold uppercase tracking-wider mb-1.5">
              <span>- VULNERABLE CODE (BEFORE)</span>
            </div>
            <pre className="text-[#FF8A3D] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {vulnerableCode}
            </pre>
          </div>
        )}

        {/* Secure solution patch block */}
        {solutionPatch && (
          <div className="bg-[#35C98A]/5 p-3.5 border-l-2 border-[#35C98A]">
            <div className="flex items-center justify-between text-[10px] text-[#35C98A] font-semibold uppercase tracking-wider mb-1.5">
              <span>+ VERIFIED SECURE REMEDIATION PATCH (AFTER)</span>
            </div>
            <pre className="text-[#35C98A] overflow-x-auto whitespace-pre-wrap leading-relaxed">
              {solutionPatch}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
