import { Finding } from '../types/security';

export function exportFindingsToCSV(findings: Finding[], filename = 'code-red-findings.csv'): void {
  const headers = [
    'Finding ID',
    'Title',
    'Severity',
    'Confidence',
    'Status',
    'Category',
    'Asset Name',
    'Affected Endpoint',
    'CVSS Score',
    'CWE IDs',
    'OWASP Category',
    'Business Impact',
    'Technical Impact',
    'Simulated Attack Vector',
    'Assigned Owner',
    'First Detected',
    'Remediation Summary',
    'Solution Patch'
  ];

  const escapeCSV = (val: string | number | undefined | null) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = findings.map(f => [
    escapeCSV(f.id),
    escapeCSV(f.title),
    escapeCSV(f.severity),
    escapeCSV(f.confidence),
    escapeCSV(f.status),
    escapeCSV(f.category),
    escapeCSV(f.assetName),
    escapeCSV(f.affectedEndpoint),
    escapeCSV(f.cvssScore ?? 'N/A'),
    escapeCSV(f.cweIds.join('; ')),
    escapeCSV(f.owaspCategory ?? 'N/A'),
    escapeCSV(f.businessImpact),
    escapeCSV(f.technicalImpact),
    escapeCSV(f.simulatedAttackVector ?? 'N/A'),
    escapeCSV(f.assignedOwner ?? 'Unassigned'),
    escapeCSV(f.firstDetected),
    escapeCSV(f.remediationSummary),
    escapeCSV(f.solutionPatch ?? 'N/A')
  ]);

  const csvContent = [
    headers.map(h => `"${h}"`).join(','),
    ...rows.map(r => r.join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
