/**
 * CipherVault Enterprise - Security Center & Cryptographic Attack Simulation Lab
 * Features Security Posture Score, Threat Mitigation feeds, and 1-click Attack Scenarios
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  AlertTriangle,
  Terminal,
  Activity,
  Bug,
  Flame,
  CheckCircle2,
  XCircle,
  Clock,
  KeyRound,
  FileX,
  UserX,
} from 'lucide-react';

export const SecurityCenterView: React.FC = () => {
  const {
    users,
    files,
    auditLogs,
    securityEvents,
    simulateCiphertextTamper,
    repairTamperedCiphertext,
    attemptFileDownload,
    loginAsUser,
    addAuditLog,
  } = useApp();

  const [simulationLog, setSimulationLog] = useState<string[]>([
    '[INIT] CipherVault Zero-Trust Cryptographic Engine Active.',
    '[MONITOR] SHA-256 integrity daemon scanning encrypted blobs: All nominal.',
    '[CP-ABE] Master public key pairing group: Active.',
  ]);

  const [isSimulating, setIsSimulating] = useState(false);

  // Compute live security score based on system posture
  const revokedCount = users.filter(u => u.status === 'REVOKED').length;
  const tamperedFiles = files.filter(f => f.tags.includes('TAMPERED_CIPHERTEXT')).length;
  const failedAudits = auditLogs.filter(l => l.status === 'BLOCKED' || l.status === 'FAILED').length;

  let baseScore = 96;
  if (tamperedFiles > 0) baseScore -= 15;
  if (failedAudits > 5) baseScore -= 5;
  const securityScore = Math.max(40, baseScore);

  const appendSimLog = (msg: string) => {
    const time = new Date().toLocaleTimeString();
    setSimulationLog(prev => [`[${time}] ${msg}`, ...prev.slice(0, 40)]);
  };

  // Scenario 1: Bit-Flip Tampering Attack
  const runBitFlipAttack = async () => {
    setIsSimulating(true);
    appendSimLog('🚨 INITIATING ATTACK: Injecting byte corruption into encrypted vault ciphertext...');
    const target = files[0];
    if (target) {
      simulateCiphertextTamper(target.id);
      appendSimLog(`💥 Bit flipped in ciphertext of '${target.name}'. Attempting download challenge...`);
      await new Promise(r => setTimeout(r, 600));

      const res = await attemptFileDownload(target.id);
      if (!res.success) {
        appendSimLog(`🛡️ DEFENSE TRIGGERED: ${res.error}`);
        appendSimLog('✅ INTEGRITY VERIFIED: AES-256-GCM / SHA-256 successfully prevented data tampering!');
      }
    }
    setIsSimulating(false);
  };

  // Scenario 2: Revoked Identity Breach Attempt
  const runRevokedBreachAttack = async () => {
    setIsSimulating(true);
    appendSimLog('🚨 INITIATING ATTACK: Revoked user Victor Vance attempting unauthorized download...');
    const revokedUser = users.find(u => u.status === 'REVOKED') || users[4];
    const topSecretFile = files.find(f => f.classification === 'Top Secret') || files[0];

    // Temporarily test from perspective of revoked user
    loginAsUser(revokedUser.id);
    await new Promise(r => setTimeout(r, 500));

    appendSimLog(`🔒 Challenging CP-ABE policy for '${topSecretFile.name}' under revoked credentials...`);
    const res = await attemptFileDownload(topSecretFile.id);
    if (!res.success) {
      appendSimLog(`🛡️ DEFENSE TRIGGERED: ${res.error}`);
      appendSimLog('✅ REVOCATION ENFORCED: User Revocation Barrier rejected access prior to key unwrap.');
    }
    setIsSimulating(false);
  };

  // Scenario 3: Privilege Escalation Attempt (Clearance Bypass)
  const runPrivilegeEscalationAttack = async () => {
    setIsSimulating(true);
    appendSimLog('🚨 INITIATING ATTACK: Student Sarah Jenkins (Clearance Level 1) targeting Top Secret Defense Enclave...');
    const student = users.find(u => u.role === 'Student') || users[3];
    const topSecretFile = files.find(f => f.classification === 'Top Secret') || files[0];

    loginAsUser(student.id);
    await new Promise(r => setTimeout(r, 500));

    appendSimLog(`🔍 CP-ABE Tree evaluating formula: "${topSecretFile.policy.expression}"...`);
    const res = await attemptFileDownload(topSecretFile.id);
    if (!res.success) {
      appendSimLog(`🛡️ DEFENSE TRIGGERED: ${res.error}`);
      appendSimLog('✅ ABAC ENFORCED: Challenger lacks required ClearanceLevel >= 5.');
    }
    setIsSimulating(false);
  };

  // Scenario 4: Repair all tampered files
  const runHealSystem = async () => {
    appendSimLog('🩹 HEALING: Re-encrypting and restoring pristine ciphertexts across vault...');
    for (const f of files) {
      if (f.tags.includes('TAMPERED_CIPHERTEXT')) {
        await repairTamperedCiphertext(f.id);
        appendSimLog(`✓ Restored pristine ciphertext & SHA-256 for '${f.name}'.`);
      }
    }
    appendSimLog('✨ System security posture restored to 100% nominal.');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise Security Center & Cryptographic Attack Lab
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Real-time security posture monitoring, threat intelligence telemetry, and interactive attack simulation against CP-ABE, AES-256-GCM, and SHA-256 defenses.
        </p>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Security Score Card */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Security Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono">
                {securityScore}
              </span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
            </div>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3 h-3" /> FIPS 140-3 Compliant
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Activity className="w-7 h-7" />
          </div>
        </div>

        {/* Revoked Identities */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Revoked Identities
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {revokedCount}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Blocked at CP-ABE boundary
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
            <UserX className="w-7 h-7" />
          </div>
        </div>

        {/* Ciphertext Tamper Detections */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Tampered Blobs
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {tamperedFiles}
            </div>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold mt-1 block">
              {tamperedFiles > 0 ? 'Integrity failure detected' : 'Zero tampering'}
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Bug className="w-7 h-7" />
          </div>
        </div>

        {/* Blocked Violations */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Blocked Violations
            </span>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-1">
              {failedAudits}
            </div>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold mt-1 block">
              Logged in Immutable Audit
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-800 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <ShieldAlert className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Interactive Cryptographic Attack Simulation Lab */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenarios (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Live Attack Simulation Scenarios
              </h3>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Trigger simulated cyberattacks to inspect how the enhanced CP-ABE and cryptographic layers mitigate breaches.
            </p>

            <div className="space-y-2.5 pt-1">
              {/* Attack 1 */}
              <button
                onClick={runBitFlipAttack}
                disabled={isSimulating}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-300 text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                  <span>1. Ciphertext Bit-Flip Attack</span>
                  <span className="text-[10px] text-rose-500 font-mono">SIMULATE</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Corrupts a byte in stored AES-GCM ciphertext. Demonstrates SHA-256 pre-digest & GCM tag verification rejection.
                </p>
              </button>

              {/* Attack 2 */}
              <button
                onClick={runRevokedBreachAttack}
                disabled={isSimulating}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-300 text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                  <span>2. Revoked Identity Breach</span>
                  <span className="text-[10px] text-rose-500 font-mono">SIMULATE</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Attempts access using credentials of revoked user Victor Vance. Demonstrates immediate zero-trust revocation gate.
                </p>
              </button>

              {/* Attack 3 */}
              <button
                onClick={runPrivilegeEscalationAttack}
                disabled={isSimulating}
                className="w-full p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/30 border border-slate-200 dark:border-slate-800 hover:border-rose-300 text-left transition-all disabled:opacity-50"
              >
                <div className="flex items-center justify-between font-bold text-xs text-slate-900 dark:text-white">
                  <span>3. Privilege Escalation Bypass</span>
                  <span className="text-[10px] text-rose-500 font-mono">SIMULATE</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  Student (Clearance 1) attempts download of Level 5 Top Secret enclave. Demonstrates CP-ABE threshold failure.
                </p>
              </button>

              {/* Reset/Heal */}
              <button
                onClick={runHealSystem}
                disabled={isSimulating}
                className="w-full py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
              >
                Heal & Restore All Vault Ciphertexts
              </button>
            </div>
          </div>
        </div>

        {/* Security Terminal Output (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-3xl bg-slate-950 border border-slate-800 shadow-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Terminal className="w-4 h-4" />
                <span>Zero-Trust Cryptographic Defense Terminal</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>

            <div className="h-96 overflow-y-auto space-y-1 text-[11px] text-slate-300 pr-1">
              {simulationLog.map((log, i) => {
                const isError = log.includes('🚨') || log.includes('💥');
                const isSuccess = log.includes('✅') || log.includes('✓');
                const isDefense = log.includes('🛡️');
                return (
                  <div
                    key={i}
                    className={`leading-relaxed ${
                      isError
                        ? 'text-rose-400 font-semibold'
                        : isSuccess
                        ? 'text-emerald-400 font-semibold'
                        : isDefense
                        ? 'text-cyan-300 font-semibold'
                        : 'text-slate-400'
                    }`}
                  >
                    {log}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
