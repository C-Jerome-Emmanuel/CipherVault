/**
 * CipherVault Enterprise - Secure File Upload & CP-ABE Policy Encapsulation
 * Handles drag & drop, AES-256-GCM envelope encryption, SHA-256 hash generation,
 * classification tagging, and time-based access control windows.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FileClassification, CPABEPolicy } from '../types';
import {
  UploadCloud,
  File,
  Shield,
  Key,
  Hash,
  Clock,
  Tag,
  CheckCircle2,
  X,
  Plus,
  AlertCircle,
} from 'lucide-react';

export const UploadModal: React.FC = () => {
  const { isUploadModalOpen, setIsUploadModalOpen, uploadFile, policies, createPolicy } = useApp();

  const [fileObject, setFileObject] = useState<File | null>(null);
  const [manualName, setManualName] = useState('');
  const [manualContent, setManualContent] = useState('');
  const [inputMode, setInputMode] = useState<'file' | 'text'>('file');
  const [isDragOver, setIsDragOver] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [classification, setClassification] = useState<FileClassification>('Confidential');
  const [selectedPolicyId, setSelectedPolicyId] = useState<string>(policies[0]?.id || '');
  const [isCustomPolicy, setIsCustomPolicy] = useState(false);
  const [customPolicyName, setCustomPolicyName] = useState('');
  const [customPolicyExpr, setCustomPolicyExpr] = useState("(Department = 'Cybersecurity' AND ClearanceLevel >= 3)");

  const [isTimeRestricted, setIsTimeRestricted] = useState(false);
  const [accessStartTime, setAccessStartTime] = useState('');
  const [accessExpiryTime, setAccessExpiryTime] = useState('');

  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Encrypted', 'AES-256']);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<string>('');
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isUploadModalOpen) return null;

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFileObject(e.dataTransfer.files[0]);
      setFormError(null);
    }
  };

  const loadSampleFile = () => {
    const sampleContent = `CONFIDENTIAL CIPHERVAULT CLOUD ENCLAVE ASSET
Classification: Confidential
Date: ${new Date().toISOString()}
Security Protocol: CP-ABE Enhanced with AES-256-GCM Envelope Encryption
Plaintext Payload:
This document contains classified telemetry and cryptographic parameter specifications for multi-authority attribute access control.
All access attempts are audited and cross-verified with SHA-256 attestation digests.`;
    const blob = new Blob([sampleContent], { type: 'text/plain' });
    const sampleFile = new (window as any).File([blob], 'Quantum-Defense-Telemetrics.log', { type: 'text/plain' });
    setFileObject(sampleFile);
    setFormError(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleUploadSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setFormError(null);

    let targetPolicy: CPABEPolicy | undefined;
    if (isCustomPolicy) {
      if (!customPolicyName.trim() || !customPolicyExpr.trim()) {
        setFormError('Please provide both a name and a valid Boolean formula for the custom CP-ABE policy.');
        return;
      }
      targetPolicy = createPolicy(customPolicyName, customPolicyExpr, 'Custom user-defined policy');
    } else {
      targetPolicy = policies.find(p => p.id === selectedPolicyId) || policies[0];
    }

    if (!targetPolicy) {
      setFormError('No access policy selected. Please select or compose a CP-ABE policy.');
      return;
    }

    let uploadPayload: any;
    if (inputMode === 'file') {
      if (!fileObject) {
        setFormError('Please select or drop a file to encrypt, or click "Load Demo Sample File" below.');
        return;
      }
      uploadPayload = fileObject;
    } else {
      if (!manualName.trim() || !manualContent.trim()) {
        setFormError('Please provide both a document title and classified content to encrypt.');
        return;
      }
      uploadPayload = {
        name: manualName.trim(),
        content: manualContent,
        mimeType: 'text/plain',
      };
    }

    setIsUploading(true);
    setUploadStep('Generating 256-bit AES-GCM Cryptographic Session Key...');
    setUploadProgress(25);
    await new Promise(r => setTimeout(r, 350));

    setUploadStep('Computing SHA-256 Plaintext Cryptographic Digest...');
    setUploadProgress(55);
    await new Promise(r => setTimeout(r, 350));

    setUploadStep('Encapsulating Access Policy into CP-ABE Structure...');
    setUploadProgress(85);
    await new Promise(r => setTimeout(r, 350));

    try {
      const result = await uploadFile({
        file: uploadPayload,
        classification,
        policy: targetPolicy,
        tags,
        isTimeRestricted,
        accessStartTime: isTimeRestricted && accessStartTime ? new Date(accessStartTime).toISOString() : undefined,
        accessExpiryTime: isTimeRestricted && accessExpiryTime ? new Date(accessExpiryTime).toISOString() : undefined,
      });

      setUploadProgress(100);
      setUploadStep('Encryption Complete! Stored securely in vault.');
      await new Promise(r => setTimeout(r, 350));

      setIsUploading(false);
      if (result.success) {
        setIsUploadModalOpen(false);
      } else {
        setFormError(`Upload failed: ${result.error || 'Cryptographic encryption failure'}`);
      }
    } catch (err: any) {
      setIsUploading(false);
      setFormError(`Upload error: ${err.message || 'Cryptographic operation failed'}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Encrypt & Upload New File
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Encapsulated under AES-256-GCM & CP-ABE Access Tree
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsUploadModalOpen(false)}
            disabled={isUploading}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Error Banner */}
          {formError && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex items-start justify-between gap-2 text-rose-800 dark:text-rose-300 animate-in fade-in">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div>
                  <span className="font-semibold block text-xs">Validation / Cryptographic Warning</span>
                  <span className="text-[11px] leading-relaxed">{formError}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setFormError(null)}
                className="text-rose-400 hover:text-rose-600 dark:hover:text-rose-200 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Mode Tabs: File or Direct Text Document */}
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => { setInputMode('file'); setFormError(null); }}
              className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                inputMode === 'file'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Upload Local File
            </button>
            <button
              type="button"
              onClick={() => { setInputMode('text'); setFormError(null); }}
              className={`flex-1 py-1.5 rounded-lg font-semibold text-xs transition-all ${
                inputMode === 'text'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              Compose Encrypted Secret Note
            </button>
          </div>

          {inputMode === 'file' ? (
            /* Drag and Drop Zone */
            <div className="space-y-2">
              <div
                onDragOver={e => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleFileDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragOver
                    ? 'border-indigo-500 bg-indigo-50/60 dark:bg-indigo-950/40 scale-[1.01]'
                    : fileObject
                    ? 'border-emerald-400 bg-emerald-50/30 dark:bg-emerald-950/20'
                    : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-slate-50/50 dark:bg-slate-800/40'
                }`}
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  className="hidden"
                  onChange={e => {
                    if (e.target.files && e.target.files.length > 0) {
                      setFileObject(e.target.files[0]);
                      setFormError(null);
                    }
                  }}
                />
                <UploadCloud className={`w-8 h-8 mx-auto mb-2 ${fileObject ? 'text-emerald-500' : 'text-indigo-500'}`} />
                {fileObject ? (
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 inline" />
                      {fileObject.name}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {(fileObject.size / 1024).toFixed(1)} KB • Ready for AES-256-GCM encryption • Click to change
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      Drag and drop file here, or{' '}
                      <span className="text-indigo-600 dark:text-indigo-400 font-semibold underline">
                        browse local storage
                      </span>
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Supports documents, logs, datasets, code, PDFs, and binaries
                    </p>
                  </div>
                )}
              </div>

              {!fileObject && (
                <div className="flex items-center justify-between px-1 text-[11px]">
                  <span className="text-slate-400">Quick Test:</span>
                  <button
                    type="button"
                    onClick={loadSampleFile}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    ⚡ Load Demo Classified File (Quantum-Defense-Telemetrics.log)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Direct Text Input */
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Document Filename
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mission-Alpha-Briefing.txt"
                  value={manualName}
                  onChange={e => setManualName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Classified Plaintext Content
                </label>
                <textarea
                  rows={4}
                  placeholder="Type confidential notes, configuration, or clinical data..."
                  value={manualContent}
                  onChange={e => setManualContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-mono text-[11px]"
                />
              </div>
            </div>
          )}

          {/* Classification & Security Level */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Classification
              </label>
              <select
                value={classification}
                onChange={e => setClassification(e.target.value as FileClassification)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                <option value="Public">Public (Unrestricted)</option>
                <option value="Internal">Internal (Company wide)</option>
                <option value="Confidential">Confidential (Project restricted)</option>
                <option value="Secret">Secret (Level 4+ Clearance)</option>
                <option value="Top Secret">Top Secret (Level 5 Clearance only)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Access Policy Selection
              </label>
              <select
                value={isCustomPolicy ? 'custom' : selectedPolicyId}
                onChange={e => {
                  if (e.target.value === 'custom') {
                    setIsCustomPolicy(true);
                  } else {
                    setIsCustomPolicy(false);
                    setSelectedPolicyId(e.target.value);
                  }
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                {policies.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
                <option value="custom">⚡ Compose Custom CP-ABE Formula...</option>
              </select>
            </div>
          </div>

          {/* Custom Policy Formula Builder */}
          {isCustomPolicy && (
            <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="font-semibold text-indigo-900 dark:text-indigo-300">
                Custom CP-ABE Policy Definition
              </div>
              <input
                type="text"
                placeholder="Policy Name (e.g. AI-Ethics-Group-Policy)"
                value={customPolicyName}
                onChange={e => setCustomPolicyName(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-slate-900 dark:text-white"
              />
              <textarea
                rows={2}
                placeholder="Boolean formula: (Department = 'Cybersecurity' AND ClearanceLevel >= 4) OR Role = 'Admin'"
                value={customPolicyExpr}
                onChange={e => setCustomPolicyExpr(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-700"
              />
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                Supports: <code className="text-indigo-600 dark:text-indigo-400">AND, OR, parentheses, =, !=, &gt;=, &lt;=, IN</code>
              </p>
            </div>
          )}

          {/* Time-Based Access Control Toggle */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Time-Based Access Control (Temporal Window)
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTimeRestricted}
                  onChange={e => setIsTimeRestricted(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>

            {isTimeRestricted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    Access Start Time (Optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={accessStartTime}
                    onChange={e => setAccessStartTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    Access Expiry Time (Required)
                  </label>
                  <input
                    type="datetime-local"
                    value={accessExpiryTime}
                    onChange={e => setAccessExpiryTime(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Classification Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add keyword tag..."
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(t => (
                <span
                  key={t}
                  className="px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 flex items-center gap-1 font-mono text-[10px]"
                >
                  {t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    className="hover:text-rose-500"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Upload Progress Animation */}
          {isUploading && (
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 space-y-2">
              <div className="flex justify-between font-semibold text-indigo-900 dark:text-indigo-200 text-xs">
                <span>{uploadStep}</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-indigo-200 dark:bg-indigo-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(false)}
            disabled={isUploading}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleUploadSubmit()}
            disabled={isUploading}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Shield className="w-4 h-4" />
            <span>Encrypt & Store in Cloud Vault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
