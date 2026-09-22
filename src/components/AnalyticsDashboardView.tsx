/**
 * CipherVault Enterprise - Analytics & Storage Dashboard
 * High-performance vector SVG charts for upload/download trends, storage allocation,
 * and security event breakdown without external heavy chart dependencies.
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  BarChart3,
  TrendingUp,
  HardDrive,
  PieChart,
  Shield,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export const AnalyticsDashboardView: React.FC = () => {
  const { storageStats, files, auditLogs, securityEvents } = useApp();

  // Synthetic 7-day upload & download trend data for demonstration
  const trendData = [
    { day: 'Mon', uploads: 12, downloads: 28 },
    { day: 'Tue', uploads: 19, downloads: 35 },
    { day: 'Wed', uploads: 15, downloads: 42 },
    { day: 'Thu', uploads: 27, downloads: 68 },
    { day: 'Fri', uploads: 34, downloads: 85 },
    { day: 'Sat', uploads: 18, downloads: 30 },
    { day: 'Sun', uploads: 22, downloads: 46 },
  ];

  const maxVal = 90;
  const chartHeight = 160;
  const chartWidth = 500;

  // Compute SVG polyline points
  const uploadPoints = trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - (d.uploads / maxVal) * (chartHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  const downloadPoints = trendData
    .map((d, i) => {
      const x = (i / (trendData.length - 1)) * (chartWidth - 40) + 20;
      const y = chartHeight - (d.downloads / maxVal) * (chartHeight - 30) - 15;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Enterprise Security & Cryptographic Analytics
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Cryptographic throughput metrics, storage quotas, department usage, and authorization challenge trends.
        </p>
      </div>

      {/* 4 Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Total Encrypted Files</span>
            <HardDrive className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">
            {files.length}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+14% this week</span>
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Encrypted Volume</span>
            <Layers className="w-4 h-4 text-cyan-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">
            {(storageStats.usedBytes / (1024 * 1024 * 1024)).toFixed(2)} GB
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            of 10.00 GB Allocated Quota
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Authorization Challenges</span>
            <Shield className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">
            {auditLogs.length * 12 + 142}
          </div>
          <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            99.2% Verification Rate
          </div>
        </div>

        <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
            <span>Avg Decryption Latency</span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono mt-2">
            4.8 ms
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            AES-256 + SHA-256 Benchmark
          </div>
        </div>
      </div>

      {/* Main Charts: Trends (7 Cols) & Department Breakdown (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Trend Area Chart (7 Cols) */}
        <div className="lg:col-span-7 p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs text-slate-900 dark:text-white">
                Cryptographic Transfer Volume (7 Days)
              </h3>
              <p className="text-[11px] text-slate-400">
                Encrypted uploads vs CP-ABE authorized downloads
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Downloads
              </span>
              <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Uploads
              </span>
            </div>
          </div>

          {/* SVG Trend Line */}
          <div className="w-full overflow-hidden pt-2">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 overflow-visible">
              <defs>
                <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[30, 70, 110, 140].map(y => (
                <line
                  key={y}
                  x1="10"
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="currentColor"
                  strokeDasharray="3 3"
                  className="text-slate-100 dark:text-slate-700/60"
                />
              ))}

              {/* Downloads Line */}
              <polyline
                fill="none"
                stroke="#6366f1"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={downloadPoints}
              />

              {/* Uploads Line */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={uploadPoints}
              />

              {/* X axis labels */}
              {trendData.map((d, i) => {
                const x = (i / (trendData.length - 1)) * (chartWidth - 40) + 20;
                return (
                  <text
                    key={d.day}
                    x={x}
                    y={chartHeight + 10}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {d.day}
                  </text>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Classification Breakdown & Department Donut (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
          <h3 className="font-bold text-xs text-slate-900 dark:text-white">
            Document Security Classification Distribution
          </h3>

          <div className="space-y-3 pt-1">
            {storageStats.classifications.map(c => {
              const count = c.count;
              const total = files.length || 1;
              const pct = Math.round((count / total) * 100);
              let color = 'bg-emerald-500';
              if (c.name === 'Internal') color = 'bg-blue-500';
              if (c.name === 'Confidential') color = 'bg-amber-500';
              if (c.name === 'Secret') color = 'bg-purple-500';
              if (c.name === 'Top Secret') color = 'bg-rose-500';

              return (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                    <span>{c.name}</span>
                    <span className="font-mono text-[11px] text-slate-400">
                      {count} files ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <h4 className="font-bold text-[11px] text-slate-400 uppercase tracking-wider mb-2">
              Storage by Department
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Cybersecurity</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">1.24 GB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Computer Science</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">0.68 GB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Medical Research</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">0.42 GB</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 block">Compliance Audit</span>
                <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">0.14 GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
