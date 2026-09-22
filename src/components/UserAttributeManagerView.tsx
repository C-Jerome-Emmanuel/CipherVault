/**
 * CipherVault Enterprise - User & Dynamic Attribute Management (ABAC/RBAC)
 * Supports dynamic attribute assignment, immediate attribute revocation,
 * role-based permissions, and user lifecycle states (ACTIVE, SUSPENDED, REVOKED).
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { User, UserRole, UserStatus } from '../types';
import {
  Users,
  Shield,
  Key,
  Trash2,
  Plus,
  UserX,
  UserCheck,
  Ban,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Sliders,
  ChevronRight,
  Search,
} from 'lucide-react';

export const UserAttributeManagerView: React.FC = () => {
  const {
    users,
    currentUser,
    assignAttribute,
    revokeAttribute,
    restoreAttribute,
    updateUserStatus,
    updateUserClearance,
    loginAsUser,
  } = useApp();

  const [selectedUserId, setSelectedUserId] = useState<string>(users[0]?.id || '');
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  // Attribute addition modal state
  const [isAddingAttr, setIsAddingAttr] = useState(false);
  const [attrCategory, setAttrCategory] = useState<any>('Department');
  const [attrName, setAttrName] = useState('');
  const [attrValue, setAttrValue] = useState('');

  const selectedUser = users.find(u => u.id === selectedUserId) || users[0];

  const filteredUsers = users.filter(u => {
    if (roleFilter !== 'all' && u.role !== roleFilter) return false;
    if (userSearch.trim()) {
      const q = userSearch.toLowerCase();
      return (
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.department.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleAddAttributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!attrName.trim() || !attrValue.trim() || !selectedUser) return;
    assignAttribute(selectedUser.id, attrCategory, attrName.trim(), attrValue.trim());
    setIsAddingAttr(false);
    setAttrName('');
    setAttrValue('');
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            User, Role & Dynamic Attribute Management (ABAC / RBAC)
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Dynamically assign or revoke user attributes and accounts. Revocations immediately alter CP-ABE cryptographic access without touching stored encrypted ciphertexts.
        </p>
      </div>

      {/* Main Grid: User List (5 cols) & User Profile + Attribute Studio (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: User Directory (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter identity or dept..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200"
              />
            </div>
            <select
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
            >
              <option value="all">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="Professor">Professor</option>
              <option value="Researcher">Researcher</option>
              <option value="Student">Student</option>
              <option value="Guest">Guest</option>
            </select>
          </div>

          {/* User Cards List */}
          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredUsers.map(user => {
              const isSelected = user.id === selectedUser?.id;
              const isCurrentSession = user.id === currentUser.id;
              return (
                <div
                  key={user.id}
                  onClick={() => setSelectedUserId(user.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white dark:bg-slate-800 border-indigo-500 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-white/70 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/80 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                          alt={user.fullName}
                          className="w-9 h-9 rounded-xl object-cover"
                        />
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full ring-2 ring-white dark:ring-slate-800 ${
                            user.status === 'ACTIVE'
                              ? 'bg-emerald-500'
                              : user.status === 'SUSPENDED'
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                          <span>{user.fullName}</span>
                          {isCurrentSession && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
                              CURRENT
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {user.username} • {user.role} • Lvl {user.clearanceLevel}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          user.status === 'ACTIVE'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : user.status === 'SUSPENDED'
                            ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                      >
                        {user.status}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {user.attributes.filter(a => !a.isRevoked).length} active attrs
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected User Deep Management & Attribute Editor (7 Cols) */}
        {selectedUser && (
          <div className="lg:col-span-7 space-y-4">
            {/* Identity Profile Card */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={selectedUser.fullName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                      {selectedUser.fullName}
                      <span className="text-xs font-mono font-normal text-slate-400">
                        ({selectedUser.username})
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedUser.email} • {selectedUser.organization}
                    </p>
                  </div>
                </div>

                {/* Quick Persona Switcher button */}
                <button
                  onClick={() => loginAsUser(selectedUser.id)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 font-semibold text-xs transition-colors self-start sm:self-auto"
                >
                  Test As This User
                </button>
              </div>

              {/* Status Controls & Clearance Slider */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Account Lifecycle State */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 block">
                    Account Lifecycle Status
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => updateUserStatus(selectedUser.id, 'ACTIVE')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedUser.status === 'ACTIVE'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Active
                    </button>
                    <button
                      onClick={() => updateUserStatus(selectedUser.id, 'SUSPENDED')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedUser.status === 'SUSPENDED'
                          ? 'bg-amber-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Suspend
                    </button>
                    <button
                      onClick={() => updateUserStatus(selectedUser.id, 'REVOKED')}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold transition-all ${
                        selectedUser.status === 'REVOKED'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Revoke
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Revoking an account halts all cryptographic decryption challenges instantly.
                  </p>
                </div>

                {/* Clearance Level Selector */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-between justify-between font-semibold text-slate-700 dark:text-slate-300">
                    <span>Security Clearance Level</span>
                    <span className="text-indigo-600 dark:text-indigo-400 font-mono">
                      Level {selectedUser.clearanceLevel} of 5
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={selectedUser.clearanceLevel}
                    onChange={e => updateUserClearance(selectedUser.id, Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>L1: Public</span>
                    <span>L3: Confid</span>
                    <span>L5: TopSecret</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Attributes & Attribute Revocation Engine */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-cyan-500" />
                    Assigned CP-ABE Attributes (Dynamic ABAC)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Revoking an attribute strips it from the user's CP-ABE decryption key without re-encrypting vault files.
                  </p>
                </div>

                <button
                  onClick={() => setIsAddingAttr(true)}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Assign Attribute</span>
                </button>
              </div>

              {/* Attributes Table */}
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {selectedUser.attributes.map(attr => (
                  <div
                    key={attr.id}
                    className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      attr.isRevoked
                        ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                        : 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {attr.category} :
                        </span>
                        <span
                          className={`font-semibold ${
                            attr.isRevoked
                              ? 'line-through text-rose-600 dark:text-rose-400'
                              : 'text-indigo-600 dark:text-indigo-400'
                          }`}
                        >
                          {attr.name} = '{attr.value}'
                        </span>
                        {attr.isRevoked && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-500 text-white">
                            REVOKED
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Assigned: {attr.assignedAt} {attr.revokedAt && `• Revoked: ${attr.revokedAt}`}
                      </span>
                    </div>

                    {/* Revocation toggle button */}
                    {attr.isRevoked ? (
                      <button
                        onClick={() => restoreAttribute(selectedUser.id, attr.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-semibold text-[11px] hover:bg-emerald-200 flex items-center gap-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => revokeAttribute(selectedUser.id, attr.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-semibold text-[11px] hover:bg-rose-200 flex items-center gap-1"
                        title="Revoke this attribute immediately"
                      >
                        <Ban className="w-3 h-3" />
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Attribute Modal */}
      {isAddingAttr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">
              Assign Attribute to {selectedUser.fullName}
            </h3>

            <form onSubmit={handleAddAttributeSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attribute Category
                </label>
                <select
                  value={attrCategory}
                  onChange={e => {
                    setAttrCategory(e.target.value);
                    setAttrName(e.target.value);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
                >
                  <option value="Department">Department</option>
                  <option value="Designation">Designation</option>
                  <option value="Project">Project</option>
                  <option value="Course">Course</option>
                  <option value="Organization">Organization</option>
                  <option value="Clearance Level">Clearance Level</option>
                  <option value="Academic Year">Academic Year</option>
                  <option value="Country">Country</option>
                  <option value="Research Area">Research Area</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Attribute Variable Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Project or Course"
                  value={attrName}
                  onChange={e => setAttrName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Assigned Value
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Quantum-Safe or Cyber-Ops"
                  value={attrValue}
                  onChange={e => setAttrValue(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingAttr(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
                >
                  Assign to User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
