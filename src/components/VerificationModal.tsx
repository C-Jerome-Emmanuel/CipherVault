/**
 * CipherVault Enterprise - Cryptographic Verification & Decryption Modal
 * Displays real-time step-by-step evaluation of the CP-ABE and AES-256 pipeline
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EncryptedFile, PolicyEvaluationTrace } from '../types';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Copy,
  Check,
  X,
  Lock,
  Unlock,
  Hash,
  Clock,
  UserX,
  FileText,
  AlertCircle,
  FileCode,
  Terminal,
} from 'lucide-react';

interface VerificationModalProps {
  file: EncryptedFile;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ file, onClose }) => {
  const { attemptFileDownload, currentUser } = useApp();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [hasRun, setHasRun] = useState<boolean>(false);
  const [result, setResult] = useState<{
    success: boolean;
    plaintext?: string;
    trace?: PolicyEvaluationTrace;
    error?: string;
  } | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const runVerificationPipeline = async () => {
    setIsRunning(true);
    // Add realistic cryptographic processing delay for visual feedback
    await new Promise(r => setTimeout(r, 600));
    const res = await attemptFileDownload(file.id);
    setResult(res);
    setHasRun(true);
    setIsRunning(false);
  };

  const handleDownloadFile = () => {
    if (!result?.plaintext) return;
    const blob = new Blob([result.plaintext], { type: file.mimeType || 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyPlaintext = () => {
    if (!result?.plaintext) return;
    navigator.clipboard.writeText(result.plaintext);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                hasRun
                  ? result?.success
                    ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
                    : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
                  : 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
              }`}
            >
              {hasRun ? (
                result?.success ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )
              ) : (
                <Lock className="w-5 h-5" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Cryptographic Access & Decryption Verification
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono truncate max-w-md">
                {file.name} • {file.classification}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Active Persona Context Banner */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-lg object-cover"
              />
              <div>
                <div className="font-semibold text-slate-900 dark:text-white">
                  Challenger: {currentUser.fullName} ({currentUser.username})
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Role: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{currentUser.role}</span> | Dept: {currentUser.department} | Clearance: Lvl {currentUser.clearanceLevel}
                </div>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                currentUser.status === 'ACTIVE'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-rose-500 text-white'
              }`}
            >
              {currentUser.status}
            </span>
          </div>

          {/* Encapsulated Policy Spec */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                CP-ABE Encapsulated Policy:
              </span>
              <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                Policy ID: {file.policy.id}
              </span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900 text-cyan-400 font-mono text-[11px] leading-relaxed border border-slate-700/80">
              {file.policy.expression}
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-1">
              <span>Expected SHA-256: {file.sha256Hash.substring(0, 24)}...</span>
              <span>Cipher: AES-256-GCM (128-bit AuthTag)</span>
            </div>
          </div>

          {/* Step-by-step verification pipeline */}
          {!hasRun ? (
            <div className="text-center py-6 space-y-3">
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-md mx-auto">
                Click below to simulate the end-to-end zero-trust decryption challenge. The system evaluates identity status, evaluates CP-ABE policy attributes, verifies temporal restrictions, unwraps the AES-256 session key, and executes SHA-256 checksum integrity verification.
              </p>
              <button
                onClick={runVerificationPipeline}
                disabled={isRunning}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/25 flex items-center gap-2 mx-auto transition-all disabled:opacity-50"
              >
                {isRunning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Evaluating CP-ABE Cryptographic Tree...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-4 h-4" />
                    <span>Execute CP-ABE Verification & Decrypt</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Verification Decision Banner */}
              <div
                className={`p-4 rounded-2xl border flex items-start gap-3 ${
                  result?.success
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-200'
                }`}
              >
                {result?.success ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <div className="font-bold text-sm">
                    {result?.success
                      ? 'ACCESS GRANTED: CP-ABE Policy Satisfied & Integrity Verified'
                      : 'ACCESS DENIED / SECURITY REJECTION'}
                  </div>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {result?.error || result?.trace?.reason}
                  </p>
                </div>
              </div>

              {/* Evaluation Step Trace */}
              {result?.trace && (
                <div className="space-y-2">
                  <div className="font-semibold text-slate-700 dark:text-slate-300 text-xs flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-indigo-500" />
                    Step-by-Step Policy & Cryptographic Audit Trace:
                  </div>

                  <div className="p-3 bg-slate-900 text-slate-200 rounded-2xl font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto border border-slate-700">
                    {result.trace.evaluationSteps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <span
                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold shrink-0 ${
                            step.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {step.passed ? 'PASS' : 'FAIL'}
                        </span>
                        <div className="leading-tight">
                          <span className="text-slate-400">[{step.rule}]:</span>{' '}
                          <span className={step.passed ? 'text-slate-200' : 'text-rose-300 font-semibold'}>
                            {step.detail}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Decrypted Plaintext Preview (if successful) */}
              {result?.success && result.plaintext && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between font-semibold text-slate-700 dark:text-slate-300 text-xs">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-indigo-500" />
                      Decrypted Plaintext Payload:
                    </span>
                    <button
                      onClick={handleCopyPlaintext}
                      className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                    >
                      {isCopied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                      {isCopied ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 font-mono text-[11px] text-slate-800 dark:text-slate-200 max-h-44 overflow-y-auto whitespace-pre-wrap">
                    {result.plaintext}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            Close
          </button>

          {hasRun && result?.success && (
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Decrypted File
            </button>
          )}

          {hasRun && !result?.success && (
            <button
              onClick={runVerificationPipeline}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Re-evaluate Challenge
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
