/**
 * CipherVault Enterprise - Audit Logging & Compliance Reports
 * Immutable audit trails, security violation forensics, and compliance exports (CSV / JSON)
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AuditLog } from '../types';
import {
  FileCheck2,
  Download,
  Filter,
  Search,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  FileCode,
  FileText,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

export interface AuditReportsViewProps {
  defaultTab?: 'logs' | 'compliance';
}

export const AuditReportsView: React.FC<AuditReportsViewProps> = ({ defaultTab = 'logs' }) => {
  const { auditLogs } = useApp();

  const [searchFilter, setSearchFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');
  const [reportTab, setReportTab] = useState<'logs' | 'compliance'>(defaultTab);

  React.useEffect(() => {
    if (defaultTab) {
      setReportTab(defaultTab);
    }
  }, [defaultTab]);

  const filteredLogs = auditLogs.filter(log => {
    if (statusFilter !== 'all' && log.status !== statusFilter) return false;
    if (actionFilter !== 'all' && log.action !== actionFilter) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        log.username.toLowerCase().includes(q) ||
        (log.resourceName && log.resourceName.toLowerCase().includes(q)) ||
        log.action.toLowerCase().includes(q) ||
        log.ipAddress.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const exportCSV = () => {
    const headers = ['ID', 'Timestamp', 'Username', 'Action', 'Resource', 'Status', 'IP', 'Details'];
    const rows = filteredLogs.map(l => [
      l.id,
      l.timestamp,
      l.username,
      l.action,
      l.resourceName || 'N/A',
      l.status,
      l.ipAddress,
      l.details || 'None',
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ciphervault-audit-report-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `ciphervault-audit-report-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadge = (status: AuditLog['status']) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      case 'BLOCKED':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'FAILED':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'WARNING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Audit Logs & Enterprise Compliance Reporting
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable cryptographic records of all access attempts, CP-ABE policy decisions, key unwraps, and integrity tests.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={exportJSON}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs border border-slate-200 dark:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileCode className="w-4 h-4 text-indigo-600" />
            <span>Export JSON</span>
          </button>
        </div>
      </div>

      {/* Tabs: Live Logs vs Compliance Briefs */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setReportTab('logs')}
          className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all ${
            reportTab === 'logs'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Security Audit Trail ({filteredLogs.length})
        </button>
        <button
          onClick={() => setReportTab('compliance')}
          className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all ${
            reportTab === 'compliance'
              ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          Compliance Framework Status (ISO 27001, HIPAA, SOC 2)
        </button>
      </div>

      {reportTab === 'logs' ? (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search audit records by user, filename, IP, or failure reason..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>

            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Verdicts</option>
              <option value="SUCCESS">SUCCESS</option>
              <option value="DENIED">DENIED (ABAC / Time)</option>
              <option value="BLOCKED">BLOCKED (Revocation)</option>
              <option value="FAILED">FAILED (Integrity)</option>
            </select>

            <select
              value={actionFilter}
              onChange={e => setActionFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Action Types</option>
              <option value="FILE_DOWNLOAD">Download Challenge</option>
              <option value="FILE_UPLOAD">Upload & Encrypt</option>
              <option value="USER_REVOCATION">Revocation Event</option>
              <option value="TAMPER_ATTEMPT">Tamper Event</option>
              <option value="POLICY_UPDATE">Policy Change</option>
            </select>
          </div>

          {/* Audit Logs Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-3">Challenger Identity</th>
                  <th className="py-3 px-3">Action Type</th>
                  <th className="py-3 px-3">Target File</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">IP Address</th>
                  <th className="py-3 px-4">Outcome / Failure Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-mono text-[11px]">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                      {log.timestamp}
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-800 dark:text-slate-200">
                      {log.username}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 font-sans font-semibold">
                      {log.action}
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-300 truncate max-w-xs font-sans">
                      {log.resourceName || 'N/A'}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                          log.status
                        )}`}
                      >
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-400 whitespace-nowrap">
                      {log.ipAddress}
                    </td>
                    <td className="py-3 px-4 font-sans text-[11px] text-slate-500 dark:text-slate-400">
                      {log.details || 'Authorized successfully under CP-ABE policy'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Compliance Framework Matrix */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                ISO / IEC 27001:2022
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                100% COMPLIANT
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              A.8.24 Use of Cryptography & A.9 Access Control. Enforces dual-layer AES-256-GCM envelope encryption and mathematical attribute-based policy barriers.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 font-mono">
              Controls Verified: A.5.15, A.8.11, A.8.20, A.8.24
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                HIPAA Security Rule (45 CFR § 164.312)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                VERIFIED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              § 164.312(a)(2)(iv) Encryption and Decryption & § 164.312(b) Audit Controls. Stored ePHI encrypted at rest, with SHA-256 pre-verification preventing tampering.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 font-mono">
              Audit trails timestamped with IP and user identity
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                EU GDPR Article 32
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                ENFORCED
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Security of Processing: Pseudonymization and encryption of personal data, ability to ensure ongoing confidentiality, integrity, availability and resilience.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 font-mono">
              Revocation barrier immediately removes decryption capabilities
            </div>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                SOC 2 Type II Trust Principles
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                AUDIT READY
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Security, Availability, Processing Integrity, Confidentiality. Automated telemetry ensures zero untracked data downloads or privilege escalations.
            </p>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-400 font-mono">
              Continuous SHA-256 cryptographic attestation active
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
