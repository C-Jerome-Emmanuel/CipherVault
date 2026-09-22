/**
 * CipherVault Enterprise - Core TypeScript Definitions
 * Enhanced CP-ABE Cloud File Sharing Platform
 */

export type UserRole = 'Admin' | 'Professor' | 'Student' | 'Researcher' | 'Guest';

export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'REVOKED';

export type FileClassification = 'Public' | 'Internal' | 'Confidential' | 'Secret' | 'Top Secret';

export interface UserAttribute {
  id: string;
  category: 'Department' | 'Designation' | 'Project' | 'Course' | 'Organization' | 'Security Level' | 'Clearance Level' | 'Academic Year' | 'Country' | 'Research Area';
  name: string;
  value: string;
  isRevoked: boolean;
  assignedAt: string;
  revokedAt?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  department: string;
  organization: string;
  clearanceLevel: number; // 1 to 5
  attributes: UserAttribute[];
  isOnline: boolean;
  lastLogin?: string;
  failedLoginAttempts: number;
  isLocked: boolean;
  createdAt: string;
  sessions: UserSession[];
}

export interface UserSession {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location: string;
  startTime: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface CPABEPolicy {
  id: string;
  name: string;
  expression: string; // e.g. "(Department = 'Cybersecurity' AND ClearanceLevel >= 3) OR Role = 'Admin'"
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FileVersion {
  versionId: string;
  versionNumber: string; // e.g. "v1.0"
  fileSize: number;
  sha256Hash: string;
  iv: string; // AES-GCM IV
  encryptedDataPreview?: string; // base64 preview
  uploadedAt: string;
  uploadedBy: string;
  changeSummary: string;
}

export interface EncryptedFile {
  id: string;
  name: string;
  originalName: string;
  mimeType: string;
  fileSize: number;
  category: 'Document' | 'Code' | 'Dataset' | 'Image' | 'Archive' | 'Executive';
  classification: FileClassification;
  tags: string[];
  isFavorite: boolean;
  isInRecycleBin: boolean;
  deletedAt?: string;
  
  // Cryptographic & CP-ABE attributes
  policy: CPABEPolicy;
  sha256Hash: string; // Plaintext integrity checksum
  encryptedAesKey: string; // Simulated hybrid envelope encryption key
  iv: string; // AES-256-GCM initialization vector (base64)
  encryptedContent: string; // Base64 ciphertext or encrypted payload
  
  // Time-based access control
  accessStartTime?: string; // ISO string
  accessExpiryTime?: string; // ISO string
  isTimeRestricted: boolean;
  
  // Ownership and Tracking
  ownerId: string;
  ownerName: string;
  ownerDepartment: string;
  createdAt: string;
  updatedAt: string;
  downloadCount: number;
  
  // Versioning
  currentVersion: string;
  versions: FileVersion[];
  
  // Sharing
  shares: FileShare[];
}

export interface FileShare {
  id: string;
  fileId: string;
  shareType: 'USER' | 'DEPARTMENT' | 'ROLE' | 'SECURE_LINK';
  target: string; // username, dept name, role name, or link token
  accessExpiry?: string;
  downloadLimit?: number;
  downloadCount: number;
  isRevoked: boolean;
  createdAt: string;
}

export interface PolicyEvaluationTrace {
  timestamp: string;
  userEvaluated: string;
  role: UserRole;
  userStatus: UserStatus;
  attributesChecked: Record<string, string | number>;
  policyExpression: string;
  timeWindowValid: boolean;
  policySatisfied: boolean;
  userRevoked: boolean;
  integrityVerified: boolean;
  accessGranted: boolean;
  reason: string;
  evaluationSteps: {
    rule: string;
    condition: string;
    passed: boolean;
    detail: string;
  }[];
}

export type AuditAction = 
  | 'USER_REGISTER'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'FAILED_LOGIN'
  | 'ACCOUNT_LOCKED'
  | 'FILE_UPLOAD'
  | 'FILE_DOWNLOAD'
  | 'FILE_DELETE'
  | 'FILE_RESTORE'
  | 'FILE_SHARE'
  | 'POLICY_CREATE'
  | 'POLICY_UPDATE'
  | 'USER_REVOCATION'
  | 'ATTRIBUTE_REVOCATION'
  | 'ACCESS_DENIED'
  | 'TAMPER_DETECTED'
  | 'PASSWORD_CHANGE'
  | 'INTEGRITY_CHECK_PASSED';

export interface AuditLog {
  id: string;
  timestamp: string;
  username: string;
  action: AuditAction;
  resourceId?: string;
  resourceName?: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED' | 'BLOCKED';
  ipAddress: string;
  device: string;
  details: string;
  evaluationTrace?: PolicyEvaluationTrace;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: string;
  source: string;
  description: string;
  status: 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  category: 'SECURITY' | 'FILE' | 'ACCESS' | 'SYSTEM';
  actionUrl?: string;
}

export interface StorageStats {
  usedBytes: number;
  totalBytes: number;
  fileCount: number;
  encryptedBytes: number;
  departments: { name: string; bytes: number; count: number }[];
  classifications: { name: FileClassification; count: number }[];
}
