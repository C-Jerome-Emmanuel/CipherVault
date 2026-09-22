/**
 * CipherVault Enterprise - CP-ABE Policy Studio & AST Evaluator
 * Interactive playground to compose, inspect, and evaluate Ciphertext-Policy ABE trees
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { cpabeEngine } from '../services/cpabeEngine';
import { PolicyEvaluationTrace, User } from '../types';
import {
  Cpu,
  CheckCircle2,
  XCircle,
  Play,
  Layers,
  Sparkles,
  Plus,
  Trash2,
  Edit2,
  Info,
  Terminal,
  Code2,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';

export const CPABEStudioView: React.FC = () => {
  const { policies, createPolicy, updatePolicy, deletePolicy, users, currentUser } = useApp();

  const [testUser, setTestUser] = useState<User>(currentUser);
  const [testExpression, setTestExpression] = useState<string>(
    policies[0]?.expression || "(Department = 'Cybersecurity' AND ClearanceLevel >= 4) OR Role = 'Admin'"
  );
  const [selectedPolicyName, setSelectedPolicyName] = useState<string>('Custom Studio Test');
  const [evaluationTrace, setEvaluationTrace] = useState<PolicyEvaluationTrace | null>(null);

  // Policy creation modal state
  const [isCreatingPolicy, setIsCreatingPolicy] = useState(false);
  const [newPolicyName, setNewPolicyName] = useState('');
  const [newPolicyExpr, setNewPolicyExpr] = useState('');
  const [newPolicyDesc, setNewPolicyDesc] = useState('');

  const runEvaluation = () => {
    const trace = cpabeEngine.evaluate(testExpression, testUser);
    setEvaluationTrace(trace);
  };

  const handleCreatePolicySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPolicyName.trim() || !newPolicyExpr.trim()) return;
    createPolicy(newPolicyName, newPolicyExpr, newPolicyDesc);
    setIsCreatingPolicy(false);
    setNewPolicyName('');
    setNewPolicyExpr('');
    setNewPolicyDesc('');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 dark:bg-cyan-950 dark:text-cyan-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              CP-ABE Policy Studio & Engine Evaluator
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Ciphertext-Policy Attribute-Based Encryption defines access trees directly inside ciphertext. Test expressions against dynamic identity attributes.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingPolicy(true)}
          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1.5 transition-colors self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New CP-ABE Policy</span>
        </button>
      </div>

      {/* Main Sandbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Expression Editor & Persona Attributes (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Policy Expression Editor Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-cyan-500" />
                Access Policy Expression (Boolean Logic Tree)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Grammar: AND, OR, (, ), =, !=, &gt;=, &lt;=, IN
              </span>
            </div>

            <textarea
              rows={3}
              value={testExpression}
              onChange={e => setTestExpression(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-900 text-cyan-300 font-mono text-xs leading-relaxed border border-slate-700/80 focus:ring-2 focus:ring-cyan-500/50 outline-none"
              placeholder="e.g. (Department = 'Computer Science' AND ClearanceLevel >= 3) OR Role = 'Admin'"
            />

            {/* Predefined Templates */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="text-[11px] text-slate-400 font-medium mr-1">Load Template:</span>
              {policies.map(p => (
                <button
                  key={p.id}
                  onClick={() => {
                    setTestExpression(p.expression);
                    setSelectedPolicyName(p.name);
                  }}
                  className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 transition-colors"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Test Persona Attributes Card */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-500" />
                Challenger Identity & Attributes (ABAC Credential Set)
              </span>
              {/* Select challenger dropdown */}
              <select
                value={testUser.id}
                onChange={e => {
                  const u = users.find(x => x.id === e.target.value);
                  if (u) setTestUser(u);
                }}
                className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white text-xs font-semibold border-none"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.fullName} ({u.role} - {u.status})
                  </option>
                ))}
              </select>
            </div>

            {/* Attributes Grid Preview */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Department</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {testUser.department}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Clearance Level</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Level {testUser.clearanceLevel}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Role</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {testUser.role}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span
                  className={`font-semibold ${
                    testUser.status === 'ACTIVE' ? 'text-emerald-500' : 'text-rose-500'
                  }`}
                >
                  {testUser.status}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 col-span-2">
                <span className="text-[10px] text-slate-400 block">Active Dynamic Attributes</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {testUser.attributes.map(a => (
                    <span
                      key={a.id}
                      className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
                        a.isRevoked
                          ? 'bg-rose-100 text-rose-700 line-through dark:bg-rose-950 dark:text-rose-400'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {a.name}={a.value} {a.isRevoked && '(REVOKED)'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evaluate Button */}
            <div className="pt-2">
              <button
                onClick={runEvaluation}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-700 hover:to-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Evaluate CP-ABE Access Policy Against Attributes</span>
              </button>
            </div>
          </div>

          {/* Architecture Pluggability Callout */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
              <Info className="w-4 h-4 text-indigo-500" />
              Modular Pluggability Design
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              This engine implements the standardized <code className="text-indigo-500 font-mono">ICPABEPolicyEngine</code> contract. When transitioning to hardware-grade pairing-based CP-ABE (e.g. Java JPBC / BSW07 / Waters), only the underlying evaluator requires swapping — leaving authentication, storage, and file pipelines 100% intact.
            </p>
          </div>
        </div>

        {/* Right Column: AST Decision Breakdown & Audit Trace (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <span className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-indigo-500" />
                  Cryptographic Evaluation Result
                </span>
                {evaluationTrace && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      evaluationTrace.accessGranted
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                    }`}
                  >
                    {evaluationTrace.accessGranted ? 'ACCESS GRANTED' : 'ACCESS REJECTED'}
                  </span>
                )}
              </div>

              {!evaluationTrace ? (
                <div className="text-center py-12 space-y-2">
                  <Cpu className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
                  <p className="text-xs text-slate-400">
                    Click "Evaluate CP-ABE Access Policy" to simulate bilinear pairing / attribute comparison steps.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Decision Banner */}
                  <div
                    className={`p-3.5 rounded-2xl border flex items-start gap-2.5 ${
                      evaluationTrace.accessGranted
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                        : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    }`}
                  >
                    {evaluationTrace.accessGranted ? (
                      <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                    ) : (
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                    )}
                    <div>
                      <div className="font-bold text-xs">
                        {evaluationTrace.accessGranted ? 'Policy Satisfied' : 'Access Denied'}
                      </div>
                      <p className="text-[11px] mt-0.5 opacity-90 leading-relaxed">
                        {evaluationTrace.reason}
                      </p>
                    </div>
                  </div>

                  {/* Step Breakdown */}
                  <div>
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 block mb-1.5">
                      AST Leaf Nodes & Rule Resolution:
                    </span>
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {evaluationTrace.evaluationSteps.map((step, i) => (
                        <div
                          key={i}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5"
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className="text-slate-700 dark:text-slate-300 font-mono text-[10px]">
                              {step.rule}
                            </span>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                                step.passed
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/60 dark:text-emerald-300'
                                  : 'bg-rose-100 text-rose-700 dark:bg-rose-900/60 dark:text-rose-300'
                              }`}
                            >
                              {step.passed ? 'PASS' : 'FAIL'}
                            </span>
                          </div>
                          <p className="text-slate-500 dark:text-slate-400 text-[10px]">
                            {step.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 font-mono text-center">
              Timestamp: {evaluationTrace ? evaluationTrace.timestamp : 'Pending'}
            </div>
          </div>
        </div>
      </div>

      {/* New Policy Modal */}
      {isCreatingPolicy && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Define New CP-ABE Access Policy
            </h3>

            <form onSubmit={handleCreatePolicySubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Policy Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Medical-Genomics-Specialist"
                  value={newPolicyName}
                  onChange={e => setNewPolicyName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Boolean Policy Formula
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="(Department = 'Medical Research' AND ClearanceLevel >= 3) OR Role = 'Admin'"
                  value={newPolicyExpr}
                  onChange={e => setNewPolicyExpr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 text-cyan-300 font-mono text-[11px] border border-slate-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Policy Description / Intent
                </label>
                <input
                  type="text"
                  placeholder="Applies to genomics datasets and clinical findings"
                  value={newPolicyDesc}
                  onChange={e => setNewPolicyDesc(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingPolicy(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Save Policy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
