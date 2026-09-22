/**
 * CipherVault Enterprise - Initial Mock Seed Data
 * Provides realistic enterprise users, attributes, roles, and initial encrypted files
 */

import { User, EncryptedFile, CPABEPolicy, AuditLog, SecurityEvent, NotificationItem } from '../types';
import { HybridCryptoEngine } from './cryptoEngine';

export const INITIAL_POLICIES: CPABEPolicy[] = [
  {
    id: 'pol-1',
    name: 'Cybersecurity Level 4+ Policy',
    expression: "(Department = 'Cybersecurity' AND ClearanceLevel >= 4) OR Role = 'Admin'",
    description: 'Requires Department to be Cybersecurity and Clearance Level of at least 4, or superuser Admin.',
    createdAt: '2026-09-01T08:00:00.000Z',
    updatedAt: '2026-09-01T08:00:00.000Z',
  },
  {
    id: 'pol-2',
    name: 'Genome-X Medical Research Policy',
    expression: "(Department = 'Medical Research' AND Project = 'Genome-X') OR Role = 'Admin'",
    description: 'Restricted strictly to researchers assigned to the Genome-X project.',
    createdAt: '2026-09-02T09:30:00.000Z',
    updatedAt: '2026-09-02T09:30:00.000Z',
  },
  {
    id: 'pol-3',
    name: 'Computer Science Academic Policy',
    expression: "Department = 'Computer Science' OR Role = 'Student' OR Role = 'Professor'",
    description: 'General academic materials accessible to CS students and faculty.',
    createdAt: '2026-09-05T10:00:00.000Z',
    updatedAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'pol-4',
    name: 'Titan Defense High Clearance Policy',
    expression: "(Project = 'Project-Titan' AND ClearanceLevel >= 5) OR Role = 'Admin'",
    description: 'Top-Secret policy reserved for Titan principal architects with Level 5 clearance.',
    createdAt: '2026-09-10T14:15:00.000Z',
    updatedAt: '2026-09-10T14:15:00.000Z',
  },
  {
    id: 'pol-5',
    name: 'General Staff Internal Policy',
    expression: "ClearanceLevel >= 2 OR Role = 'Admin'",
    description: 'Enterprise internal documentation for employees with level 2 clearance or above.',
    createdAt: '2026-09-12T11:00:00.000Z',
    updatedAt: '2026-09-12T11:00:00.000Z',
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-1',
    username: 'elena.vance',
    email: 'elena.vance@ciphervault.io',
    fullName: 'Dr. Elena Vance',
    role: 'Admin',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    department: 'Cybersecurity',
    organization: 'CipherVault Labs',
    clearanceLevel: 5,
    isOnline: true,
    lastLogin: '2026-09-19T07:45:00.000Z',
    failedLoginAttempts: 0,
    isLocked: false,
    createdAt: '2025-01-15T00:00:00.000Z',
    attributes: [
      { id: 'attr-101', category: 'Department', name: 'Department', value: 'Cybersecurity', isRevoked: false, assignedAt: '2025-01-15' },
      { id: 'attr-102', category: 'Project', name: 'Project', value: 'Project-Titan', isRevoked: false, assignedAt: '2025-01-15' },
      { id: 'attr-103', category: 'Clearance Level', name: 'ClearanceLevel', value: '5', isRevoked: false, assignedAt: '2025-01-15' },
      { id: 'attr-104', category: 'Designation', name: 'Designation', value: 'Chief Cryptographer', isRevoked: false, assignedAt: '2025-01-15' },
      { id: 'attr-105', category: 'Research Area', name: 'ResearchArea', value: 'Post-Quantum CP-ABE', isRevoked: false, assignedAt: '2025-01-15' },
    ],
    sessions: [
      { id: 'sess-1', device: 'MacBook Pro 16"', browser: 'Chrome 128', ipAddress: '192.168.1.45', location: 'San Francisco, US', startTime: '2026-09-19T06:30:00.000Z', lastActive: '2026-09-19T07:45:00.000Z', isCurrent: true },
      { id: 'sess-2', device: 'Secure Hardware Workstation', browser: 'Firefox ESR', ipAddress: '10.200.4.12', location: 'Vault Enclave DC', startTime: '2026-09-18T14:00:00.000Z', lastActive: '2026-09-18T18:00:00.000Z', isCurrent: false },
    ],
  },
  {
    id: 'usr-2',
    username: 'marcus.chen',
    email: 'marcus.chen@univ.edu',
    fullName: 'Prof. Marcus Chen',
    role: 'Professor',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    organization: 'National University',
    clearanceLevel: 4,
    isOnline: true,
    lastLogin: '2026-09-19T06:12:00.000Z',
    failedLoginAttempts: 0,
    isLocked: false,
    createdAt: '2025-03-10T00:00:00.000Z',
    attributes: [
      { id: 'attr-201', category: 'Department', name: 'Department', value: 'Computer Science', isRevoked: false, assignedAt: '2025-03-10' },
      { id: 'attr-202', category: 'Project', name: 'Project', value: 'Quantum-Safe', isRevoked: false, assignedAt: '2025-03-10' },
      { id: 'attr-203', category: 'Clearance Level', name: 'ClearanceLevel', value: '4', isRevoked: false, assignedAt: '2025-03-10' },
      { id: 'attr-204', category: 'Course', name: 'Course', value: 'CS-801', isRevoked: false, assignedAt: '2025-03-10' },
    ],
    sessions: [
      { id: 'sess-3', device: 'ThinkPad X1 Carbon', browser: 'Safari 18', ipAddress: '140.112.44.19', location: 'Boston, US', startTime: '2026-09-19T05:00:00.000Z', lastActive: '2026-09-19T06:12:00.000Z', isCurrent: false },
    ],
  },
  {
    id: 'usr-3',
    username: 'aris.thorne',
    email: 'aris.thorne@biotech.org',
    fullName: 'Dr. Aris Thorne',
    role: 'Researcher',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department: 'Medical Research',
    organization: 'BioTech Institute',
    clearanceLevel: 3,
    isOnline: false,
    lastLogin: '2026-09-18T22:15:00.000Z',
    failedLoginAttempts: 0,
    isLocked: false,
    createdAt: '2025-06-01T00:00:00.000Z',
    attributes: [
      { id: 'attr-301', category: 'Department', name: 'Department', value: 'Medical Research', isRevoked: false, assignedAt: '2025-06-01' },
      { id: 'attr-302', category: 'Project', name: 'Project', value: 'Genome-X', isRevoked: false, assignedAt: '2025-06-01' },
      { id: 'attr-303', category: 'Clearance Level', name: 'ClearanceLevel', value: '3', isRevoked: false, assignedAt: '2025-06-01' },
    ],
    sessions: [],
  },
  {
    id: 'usr-4',
    username: 'sarah.jenkins',
    email: 's.jenkins@univ.edu',
    fullName: 'Sarah Jenkins',
    role: 'Student',
    status: 'ACTIVE',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department: 'Computer Science',
    organization: 'National University',
    clearanceLevel: 1,
    isOnline: true,
    lastLogin: '2026-09-19T07:10:00.000Z',
    failedLoginAttempts: 0,
    isLocked: false,
    createdAt: '2025-09-01T00:00:00.000Z',
    attributes: [
      { id: 'attr-401', category: 'Department', name: 'Department', value: 'Computer Science', isRevoked: false, assignedAt: '2025-09-01' },
      { id: 'attr-402', category: 'Course', name: 'Course', value: 'CS-801', isRevoked: false, assignedAt: '2025-09-01' },
      { id: 'attr-403', category: 'Academic Year', name: 'AcademicYear', value: '2026', isRevoked: false, assignedAt: '2025-09-01' },
      { id: 'attr-404', category: 'Clearance Level', name: 'ClearanceLevel', value: '1', isRevoked: false, assignedAt: '2025-09-01' },
    ],
    sessions: [],
  },
  {
    id: 'usr-5',
    username: 'victor.vance',
    email: 'victor.vance@compromised.net',
    fullName: 'Victor Vance (Revoked)',
    role: 'Researcher',
    status: 'REVOKED', // Demonstrates instant revocation enforcement!
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department: 'Cybersecurity',
    organization: 'CipherVault Labs',
    clearanceLevel: 2,
    isOnline: false,
    lastLogin: '2026-09-10T11:00:00.000Z',
    failedLoginAttempts: 4,
    isLocked: true,
    createdAt: '2025-02-20T00:00:00.000Z',
    attributes: [
      { id: 'attr-501', category: 'Department', name: 'Department', value: 'Cybersecurity', isRevoked: true, assignedAt: '2025-02-20', revokedAt: '2026-09-10' },
      { id: 'attr-502', category: 'Project', name: 'Project', value: 'Project-Titan', isRevoked: true, assignedAt: '2025-02-20', revokedAt: '2026-09-10' },
      { id: 'attr-503', category: 'Clearance Level', name: 'ClearanceLevel', value: '2', isRevoked: true, assignedAt: '2025-02-20', revokedAt: '2026-09-10' },
    ],
    sessions: [],
  },
  {
    id: 'usr-6',
    username: 'guest.auditor',
    email: 'auditor@external-review.org',
    fullName: 'Guest External Auditor',
    role: 'Guest',
    status: 'ACTIVE',
    department: 'External Audit',
    organization: 'Compliance Org',
    clearanceLevel: 1,
    isOnline: false,
    lastLogin: '2026-09-17T15:00:00.000Z',
    failedLoginAttempts: 0,
    isLocked: false,
    createdAt: '2026-08-01T00:00:00.000Z',
    attributes: [
      { id: 'attr-601', category: 'Department', name: 'Department', value: 'External Audit', isRevoked: false, assignedAt: '2026-08-01' },
      { id: 'attr-602', category: 'Clearance Level', name: 'ClearanceLevel', value: '1', isRevoked: false, assignedAt: '2026-08-01' },
    ],
    sessions: [],
  }
];

export async function createInitialEncryptedFiles(): Promise<EncryptedFile[]> {
  // Plaintexts for real cryptographic AES-256-GCM + SHA-256 seeding
  const fileDefinitions = [
    {
      id: 'file-1',
      name: 'Quantum-Safe-Handshake-v3.pdf',
      originalName: 'Quantum-Safe-Handshake-v3.pdf',
      mimeType: 'application/pdf',
      category: 'Document' as const,
      classification: 'Secret' as const,
      tags: ['Cryptography', 'Quantum', 'NIST-Round-4'],
      policy: INITIAL_POLICIES[0],
      ownerId: 'usr-1',
      ownerName: 'Dr. Elena Vance',
      ownerDepartment: 'Cybersecurity',
      plaintext: `[CLASSIFIED: SECRET // CIPHERVAULT ENCLAVE]
Title: Post-Quantum Hybrid Key Encapsulation Specification
Version: 3.2-RC1
Abstract:
This document standardizes the CP-ABE and ML-KEM-1024 hybrid envelope cipher scheme implemented across CipherVault nodes. 
All data encryption keys (DEK) are derived via HKDF-SHA256 from ephemeral bilinear pairing groups or simulated polynomial rings.
Integrity is guaranteed via AES-GCM 128-bit authentication tags and SHA-256 pre-encryption digests.
Authorized Access Policy: (Department = 'Cybersecurity' AND ClearanceLevel >= 4) OR Role = 'Admin'`,
      currentVersion: 'v1.2',
    },
    {
      id: 'file-2',
      name: 'Clinical-Genomics-Cohort-Delta.csv',
      originalName: 'Clinical-Genomics-Cohort-Delta.csv',
      mimeType: 'text/csv',
      category: 'Dataset' as const,
      classification: 'Confidential' as const,
      tags: ['CRISPR', 'Genomics', 'Phase-II'],
      policy: INITIAL_POLICIES[1],
      ownerId: 'usr-3',
      ownerName: 'Dr. Aris Thorne',
      ownerDepartment: 'Medical Research',
      plaintext: `Patient_ID,Gene_Target,Vector,Concentration_uM,Target_Cleavage_Rate,Off_Target_Score,Status
GEN-8810,BRCA1-Exon11,AAV9,4.5,0.924,0.0012,VERIFIED
GEN-8811,TP53-Intron3,LipidNP,6.2,0.891,0.0031,VALIDATING
GEN-8812,CFTR-DeltaF,Cas12a,5.0,0.957,0.0008,OPTIMAL
GEN-8813,HBB-BetaThal,Cas9-HF,3.8,0.912,0.0014,VERIFIED`,
      currentVersion: 'v1.0',
    },
    {
      id: 'file-3',
      name: 'CS801-Advanced-Cryptography-Syllabus.docx',
      originalName: 'CS801-Advanced-Cryptography-Syllabus.docx',
      mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      category: 'Document' as const,
      classification: 'Public' as const,
      tags: ['Syllabus', 'CS801', 'Academic'],
      policy: INITIAL_POLICIES[2],
      ownerId: 'usr-2',
      ownerName: 'Prof. Marcus Chen',
      ownerDepartment: 'Computer Science',
      plaintext: `National University Department of Computer Science
Course: CS-801 Advanced Cryptography & CP-ABE Security Architectures
Instructor: Prof. Marcus Chen
Prerequisites: Linear Algebra, Computational Complexity, Abstract Algebra

Module 1: Mathematical Foundations of Attribute-Based Encryption (ABE)
Module 2: Ciphertext-Policy ABE (Bethencourt-Sahai-Waters Construction)
Module 3: Hybrid Cryptosystems: Combining CP-ABE with Symmetric Ciphers (AES-256)
Module 4: Dynamic Revocation Mechanisms: Revoking Users vs Attributes
Module 5: Real-world Cloud Deployment and Verification Audits`,
      currentVersion: 'v2.0',
    },
    {
      id: 'file-4',
      name: 'Project-Titan-Core-Architecture.yaml',
      originalName: 'Project-Titan-Core-Architecture.yaml',
      mimeType: 'text/yaml',
      category: 'Code' as const,
      classification: 'Top Secret' as const,
      tags: ['Defense', 'Titan', 'Hardware-HSM'],
      policy: INITIAL_POLICIES[3],
      ownerId: 'usr-1',
      ownerName: 'Dr. Elena Vance',
      ownerDepartment: 'Cybersecurity',
      plaintext: `apiVersion: ciphervault.enterprise/v1alpha1
kind: DefenseEnclaveDeployment
metadata:
  name: project-titan-core
  classification: TOP_SECRET
  clearanceFloor: 5
spec:
  hardwareSecurityModule:
    vendor: Thales Luna 7
    partitionId: partition-titan-zero
    slotFipsLevel: FIPS-140-3-Level4
  cpAbeEngine:
    mode: StrictPairingWithDynamicRevocation
    pairingGroup: SS512
    masterPublicKeyFingerprint: "sha256:7f9a8820bc39e120aa4490"
  integrityPolicy:
    sha256StrictCheck: true
    reEncryptionOnAttributeRevocation: false # CP-ABE enables dynamic revocation without file re-encryption!`,
      currentVersion: 'v1.0',
    },
    {
      id: 'file-5',
      name: 'Global-Security-Audit-Guidelines-2026.pdf',
      originalName: 'Global-Security-Audit-Guidelines-2026.pdf',
      mimeType: 'application/pdf',
      category: 'Document' as const,
      classification: 'Internal' as const,
      tags: ['Compliance', 'ISO27001', 'SOP'],
      policy: INITIAL_POLICIES[4],
      ownerId: 'usr-1',
      ownerName: 'Dr. Elena Vance',
      ownerDepartment: 'Cybersecurity',
      plaintext: `CipherVault Enterprise Standard Operating Procedures 2026
Standard: ISO/IEC 27001:2022 & SOC 2 Type II Compliance

Section 4.1: Access Control Matrix
All data stored in CipherVault must undergo automatic AES-256-GCM envelope encryption.
Access policies must be evaluated using the modular CP-ABE engine.
Every download, authorization challenge, or revocation event must generate an immutable audit record with SHA-256 verification logs.`,
      currentVersion: 'v1.1',
    }
  ];

  const encryptedFiles: EncryptedFile[] = [];

  for (const f of fileDefinitions) {
    // Perform real AES-256-GCM + SHA-256 calculation
    const enc = await HybridCryptoEngine.encrypt(f.plaintext);
    
    encryptedFiles.push({
      id: f.id,
      name: f.name,
      originalName: f.originalName,
      mimeType: f.mimeType,
      fileSize: new TextEncoder().encode(f.plaintext).length,
      category: f.category,
      classification: f.classification,
      tags: f.tags,
      isFavorite: f.classification === 'Top Secret' || f.classification === 'Secret',
      isInRecycleBin: false,
      policy: f.policy,
      sha256Hash: enc.sha256Hash,
      encryptedAesKey: enc.exportedKeyBase64,
      iv: enc.ivBase64,
      encryptedContent: enc.ciphertextBase64,
      isTimeRestricted: false,
      ownerId: f.ownerId,
      ownerName: f.ownerName,
      ownerDepartment: f.ownerDepartment,
      createdAt: '2026-09-15T12:00:00.000Z',
      updatedAt: '2026-09-18T10:00:00.000Z',
      downloadCount: Math.floor(Math.random() * 24) + 3,
      currentVersion: f.currentVersion,
      versions: [
        {
          versionId: `${f.id}-v1`,
          versionNumber: 'v1.0',
          fileSize: new TextEncoder().encode(f.plaintext).length,
          sha256Hash: enc.sha256Hash,
          iv: enc.ivBase64,
          uploadedAt: '2026-09-15T12:00:00.000Z',
          uploadedBy: f.ownerName,
          changeSummary: 'Initial cryptographic upload with CP-ABE access policy encapsulation',
        }
      ],
      shares: [
        {
          id: `share-${f.id}`,
          fileId: f.id,
          shareType: 'ROLE',
          target: 'Professor',
          downloadLimit: 50,
          downloadCount: 2,
          isRevoked: false,
          createdAt: '2026-09-16T09:00:00.000Z',
        }
      ],
    });
  }

  return encryptedFiles;
}

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-19T07:45:10.000Z',
    username: 'elena.vance',
    action: 'USER_LOGIN',
    status: 'SUCCESS',
    ipAddress: '192.168.1.45',
    device: 'MacBook Pro 16" (Chrome 128)',
    details: 'JWT access token and refresh token successfully issued with Admin authority.',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-19T07:30:22.000Z',
    username: 'marcus.chen',
    action: 'FILE_DOWNLOAD',
    resourceId: 'file-1',
    resourceName: 'Quantum-Safe-Handshake-v3.pdf',
    status: 'SUCCESS',
    ipAddress: '140.112.44.19',
    device: 'ThinkPad X1 (Safari 18)',
    details: 'CP-ABE policy evaluated: ClearanceLevel 4 satisfied. AES-256 decrypted. SHA-256 integrity check verified bit-perfect.',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-19T07:15:04.000Z',
    username: 'victor.vance',
    action: 'ACCESS_DENIED',
    resourceId: 'file-4',
    resourceName: 'Project-Titan-Core-Architecture.yaml',
    status: 'BLOCKED',
    ipAddress: '198.51.100.82',
    device: 'Unknown Linux Machine',
    details: 'SECURITY ALERT: Revoked user attempted access. CP-ABE access evaluation terminated at revocation gate.',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-19T06:50:33.000Z',
    username: 'sarah.jenkins',
    action: 'FILE_DOWNLOAD',
    resourceId: 'file-3',
    resourceName: 'CS801-Advanced-Cryptography-Syllabus.docx',
    status: 'SUCCESS',
    ipAddress: '140.112.44.89',
    device: 'Windows 11 (Firefox 129)',
    details: 'Policy: Department Computer Science satisfied. SHA-256 hash verified.',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-18T23:12:00.000Z',
    username: 'victor.vance',
    action: 'FAILED_LOGIN',
    status: 'FAILED',
    ipAddress: '198.51.100.82',
    device: 'curl/8.4.0',
    details: 'Failed authentication attempt: Account is marked REVOKED.',
  }
];

export const INITIAL_SECURITY_EVENTS: SecurityEvent[] = [
  {
    id: 'sec-1',
    timestamp: '2026-09-19T07:15:04.000Z',
    severity: 'HIGH',
    type: 'REVOKED_IDENTITY_BREACH_ATTEMPT',
    source: '198.51.100.82',
    description: 'Revoked user victor.vance attempted to download Top Secret resource file-4. Blocked by CP-ABE Revocation Barrier.',
    status: 'MITIGATED',
  },
  {
    id: 'sec-2',
    timestamp: '2026-09-19T04:20:11.000Z',
    severity: 'MEDIUM',
    type: 'MULTIPLE_FAILED_LOGINS',
    source: '203.0.113.55',
    description: '5 consecutive invalid password attempts against account auditor@external-review.org. Rate limiting triggered.',
    status: 'RESOLVED',
  },
  {
    id: 'sec-3',
    timestamp: '2026-09-18T16:00:00.000Z',
    severity: 'LOW',
    type: 'POLICY_MODIFICATION_AUDIT',
    source: '10.200.4.12',
    description: 'CP-ABE Policy pol-1 updated to incorporate NIST Round 4 security parameters.',
    status: 'RESOLVED',
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Security Alert: Access Blocked',
    message: 'Revoked credential for victor.vance was blocked attempting to access Project-Titan-Core-Architecture.yaml.',
    type: 'error',
    timestamp: '10 minutes ago',
    isRead: false,
    category: 'SECURITY',
  },
  {
    id: 'notif-2',
    title: 'File Decryption Verified',
    message: 'Quantum-Safe-Handshake-v3.pdf decrypted and verified with SHA-256 integrity match.',
    type: 'success',
    timestamp: '25 minutes ago',
    isRead: false,
    category: 'FILE',
  },
  {
    id: 'notif-3',
    title: 'Storage Quota Notice',
    message: 'Encrypted storage pool is at 24.8% capacity (2.48 GB of 10.00 GB used).',
    type: 'info',
    timestamp: '2 hours ago',
    isRead: true,
    category: 'SYSTEM',
  }
];
