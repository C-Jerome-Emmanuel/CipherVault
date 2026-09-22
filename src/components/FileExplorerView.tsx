/**
 * CipherVault Enterprise - Secure File Explorer
 * Lists encrypted vault files, classification indicators, CP-ABE policy badges,
 * version badges, cryptographic actions, and recycle bin management.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EncryptedFile, FileClassification } from '../types';
import { VerificationModal } from './VerificationModal';
import {
  FileText,
  FileCode,
  Database,
  Lock,
  Unlock,
  Star,
  Trash2,
  Share2,
  RefreshCw,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Tag,
  LayoutGrid,
  List,
  AlertTriangle,
  History,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Plus,
} from 'lucide-react';

export const FileExplorerView: React.FC = () => {
  const {
    files,
    searchQuery,
    toggleFavorite,
    deleteFile,
    restoreFile,
    simulateCiphertextTamper,
    repairTamperedCiphertext,
    currentUser,
    setIsUploadModalOpen,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [classificationFilter, setClassificationFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [verifyingFile, setVerifyingFile] = useState<EncryptedFile | null>(null);
  const [activeVersionFile, setActiveVersionFile] = useState<EncryptedFile | null>(null);

  // Filter files
  const filteredFiles = files.filter(f => {
    // Recycle bin check
    if (categoryFilter === 'bin') {
      if (!f.isInRecycleBin) return false;
    } else {
      if (f.isInRecycleBin) return false;
    }

    if (categoryFilter === 'favorites' && !f.isFavorite) return false;
    if (categoryFilter === 'documents' && f.category !== 'Document') return false;
    if (categoryFilter === 'datasets' && f.category !== 'Dataset') return false;
    if (categoryFilter === 'code' && f.category !== 'Code') return false;
    if (categoryFilter === 'executive' && f.category !== 'Executive') return false;

    if (classificationFilter !== 'all' && f.classification !== classificationFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = f.name.toLowerCase().includes(q);
      const matchPolicy = f.policy.expression.toLowerCase().includes(q);
      const matchTag = f.tags.some(t => t.toLowerCase().includes(q));
      const matchHash = f.sha256Hash.toLowerCase().includes(q);
      const matchDept = f.ownerDepartment.toLowerCase().includes(q);
      if (!matchName && !matchPolicy && !matchTag && !matchHash && !matchDept) return false;
    }

    return true;
  });

  const getClassificationBadge = (classification: FileClassification) => {
    switch (classification) {
      case 'Top Secret':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800';
      case 'Secret':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-300 dark:border-purple-800';
      case 'Confidential':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      case 'Internal':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300 dark:border-blue-800';
      default:
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Dataset':
        return <Database className="w-4 h-4 text-cyan-500" />;
      case 'Code':
        return <FileCode className="w-4 h-4 text-emerald-500" />;
      case 'Executive':
        return <Lock className="w-4 h-4 text-rose-500" />;
      default:
        return <FileText className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="space-y-5 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Top Header & Quick Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Secure Cloud Vault Explorer
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Every resource is envelope-encrypted with AES-256 and protected by CP-ABE access policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'grid'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm shadow-indigo-500/20 flex items-center gap-1.5 transition-colors"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Encrypt New File</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Files' },
            { id: 'documents', label: 'Documents' },
            { id: 'datasets', label: 'Datasets' },
            { id: 'code', label: 'Code & Enclaves' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'bin', label: 'Recycle Bin' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                categoryFilter === tab.id
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Classification Filter Dropdown */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Classification:</span>
          <select
            value={classificationFilter}
            onChange={e => setClassificationFilter(e.target.value)}
            className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold"
          >
            <option value="all">All Classifications</option>
            <option value="Public">Public</option>
            <option value="Internal">Internal</option>
            <option value="Confidential">Confidential</option>
            <option value="Secret">Secret</option>
            <option value="Top Secret">Top Secret</option>
          </select>
        </div>
      </div>

      {/* File List / Grid */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-16 bg-slate-50/50 dark:bg-slate-900/30 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800 p-8 space-y-4">
          <Lock className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600" />
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300 text-sm">
              No files found matching criteria
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
              Try adjusting your search keywords, classification filters, or encrypt a new file under a CP-ABE policy.
            </p>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs inline-flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Encrypt & Upload New File</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFiles.map(file => {
            const isTampered = file.tags.includes('TAMPERED_CIPHERTEXT');
            return (
              <div
                key={file.id}
                className={`p-4 rounded-2xl bg-white dark:bg-slate-800/90 border transition-all hover:shadow-md flex flex-col justify-between space-y-3 ${
                  isTampered
                    ? 'border-rose-400 dark:border-rose-600/80 ring-1 ring-rose-400/30'
                    : 'border-slate-200 dark:border-slate-700/80'
                }`}
              >
                {/* Card Top: Icon, Classification, Star */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      {getCategoryIcon(file.category)}
                    </div>
                    <div>
                      <h4
                        className="font-bold text-slate-900 dark:text-white text-xs truncate max-w-[170px]"
                        title={file.name}
                      >
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                        <span>{(file.fileSize / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span className="font-mono">{file.currentVersion}</span>
                        <span>•</span>
                        <span>{file.ownerDepartment}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getClassificationBadge(
                        file.classification
                      )}`}
                    >
                      {file.classification}
                    </span>
                    <button
                      onClick={() => toggleFavorite(file.id)}
                      className={`p-1 rounded-lg transition-colors ${
                        file.isFavorite
                          ? 'text-amber-500'
                          : 'text-slate-300 hover:text-slate-500 dark:text-slate-600'
                      }`}
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Tampered Alert Warning Banner */}
                {isTampered && (
                  <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 flex items-center gap-1.5 text-[10px] font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span>Tampered Ciphertext (Simulated Attack)</span>
                  </div>
                )}

                {/* CP-ABE Policy Preview */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-indigo-500" />
                      CP-ABE Policy
                    </span>
                    <span className="truncate max-w-[120px]" title={file.policy.name}>
                      {file.policy.name}
                    </span>
                  </div>
                  <div
                    className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-lg truncate border border-slate-200/50 dark:border-slate-700/50"
                    title={file.policy.expression}
                  >
                    {file.policy.expression}
                  </div>
                </div>

                {/* SHA-256 and Tags */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span title={`SHA-256: ${file.sha256Hash}`}>
                    SHA-256: {file.sha256Hash.substring(0, 10)}...
                  </span>
                  <span>{file.downloadCount} downloads</span>
                </div>

                {/* Actions Footer */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-1.5">
                  {categoryFilter === 'bin' ? (
                    <div className="flex items-center gap-2 w-full">
                      <button
                        onClick={() => restoreFile(file.id)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-xs font-semibold hover:bg-indigo-100 flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                      <button
                        onClick={() => deleteFile(file.id, true)}
                        className="py-1.5 px-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-xs font-semibold hover:bg-rose-100"
                        title="Permanently Purge"
                      >
                        Purge
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Primary Download Challenge Button */}
                      <button
                        onClick={() => setVerifyingFile(file)}
                        className="flex-1 py-1.5 px-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Unlock className="w-3.5 h-3.5" />
                        <span>Decrypt & Download</span>
                      </button>

                      {/* Simulation: Tamper or Repair Ciphertext */}
                      {isTampered ? (
                        <button
                          onClick={() => repairTamperedCiphertext(file.id)}
                          className="p-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-800"
                          title="Repair Tampered Ciphertext & Restore SHA-256"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => simulateCiphertextTamper(file.id)}
                          className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                          title="Simulate Ciphertext Tamper Attack (Flip bits to test SHA-256 verification)"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Version History */}
                      <button
                        onClick={() => setActiveVersionFile(file)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                        title="Version History"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => deleteFile(file.id)}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Move to Recycle Bin"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/90 shadow-xs">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/60 text-slate-400 font-semibold">
                <th className="py-3 px-4">Document</th>
                <th className="py-3 px-3">Classification</th>
                <th className="py-3 px-3">CP-ABE Policy</th>
                <th className="py-3 px-3">SHA-256 Digest</th>
                <th className="py-3 px-3">Size & Version</th>
                <th className="py-3 px-4 text-right">Cryptographic Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredFiles.map(file => {
                const isTampered = file.tags.includes('TAMPERED_CIPHERTEXT');
                return (
                  <tr key={file.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {getCategoryIcon(file.category)}
                        <div>
                          <span className="font-bold text-slate-900 dark:text-white block truncate max-w-xs">
                            {file.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            Owner: {file.ownerName} ({file.ownerDepartment})
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${getClassificationBadge(
                          file.classification
                        )}`}
                      >
                        {file.classification}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-md block truncate max-w-xs"
                        title={file.policy.expression}
                      >
                        {file.policy.expression}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-[10px] text-slate-400">
                      {file.sha256Hash.substring(0, 12)}...
                    </td>
                    <td className="py-3 px-3 text-[11px] text-slate-500 dark:text-slate-400">
                      {(file.fileSize / 1024).toFixed(1)} KB ({file.currentVersion})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setVerifyingFile(file)}
                          className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px] flex items-center gap-1 shadow-xs"
                        >
                          <Unlock className="w-3 h-3" />
                          <span>Challenge</span>
                        </button>
                        {isTampered ? (
                          <button
                            onClick={() => repairTamperedCiphertext(file.id)}
                            className="p-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                            title="Repair"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>
                        ) : (
                          <button
                            onClick={() => simulateCiphertextTamper(file.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                            title="Tamper Simulation"
                          >
                            <ShieldAlert className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteFile(file.id)}
                          className="p-1 rounded-lg text-slate-400 hover:text-rose-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Verification Modal trigger */}
      {verifyingFile && (
        <VerificationModal file={verifyingFile} onClose={() => setVerifyingFile(null)} />
      )}

      {/* Version History Modal */}
      {activeVersionFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                  Cryptographic Version History
                </h3>
              </div>
              <button
                onClick={() => setActiveVersionFile(null)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              File: <span className="font-semibold text-slate-700 dark:text-slate-300">{activeVersionFile.name}</span>
            </p>

            <div className="space-y-3">
              {activeVersionFile.versions.map((v, i) => (
                <div
                  key={v.versionId}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                      {v.versionNumber} {i === 0 && '(Current Master)'}
                    </span>
                    <span className="text-[10px] text-slate-400">{v.uploadedAt}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300">{v.changeSummary}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    SHA-256: {v.sha256Hash.substring(0, 20)}...
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setActiveVersionFile(null)}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
