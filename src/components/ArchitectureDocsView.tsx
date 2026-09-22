/**
 * CipherVault Enterprise - Architecture, Cryptographic Formalism & API Specification
 * Detailed documentation for CP-ABE, Hybrid AES-256-GCM, Spring Boot backend, and Docker deployment.
 */

import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Layers,
  FileCode,
  Server,
  Database,
  Shield,
  Key,
  Terminal,
  Code,
  Copy,
  Check,
} from 'lucide-react';

export interface ArchitectureDocsViewProps {
  defaultTab?: 'abe' | 'sequence' | 'schema' | 'api' | 'docker';
}

export const ArchitectureDocsView: React.FC<ArchitectureDocsViewProps> = ({ defaultTab = 'abe' }) => {
  const [activeTab, setActiveTab] = useState<'abe' | 'sequence' | 'schema' | 'api' | 'docker'>(defaultTab);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  React.useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6 p-4 lg:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Architecture, CP-ABE Cryptography & Backend Specification
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Cryptographic specifications, sequence diagrams, relational schema, REST API definitions, and Spring Boot 3.5 / Docker deployment guide.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl w-fit">
        {[
          { id: 'abe', label: 'CP-ABE Cryptographic Spec' },
          { id: 'sequence', label: 'Security Workflows & Sequence' },
          { id: 'schema', label: 'Database Schema (ERD)' },
          { id: 'api', label: 'OpenAPI REST Endpoints' },
          { id: 'docker', label: 'Spring Boot 3.5 & Docker' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-1.5 rounded-xl font-semibold text-xs transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panes */}
      {activeTab === 'abe' && (
        <div className="space-y-4 text-xs">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-500" />
              Ciphertext-Policy Attribute-Based Encryption (CP-ABE) Mathematical Model
            </h3>

            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              In CipherVault Enterprise, CP-ABE acts as the mathematical access gatekeeper. Files are not encrypted directly under individual public keys. Instead, files are encrypted under an <strong>Access Tree policy structure <span className="font-mono text-indigo-500">T</span></strong>, while users receive cryptographic secret keys associated with a <strong>set of descriptive attributes <span className="font-mono text-cyan-500">S</span></strong>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                  1. Setup(1^λ) → (PK, MK)
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  Generates bilinear pairing groups <code className="text-indigo-400 font-mono">e: G0 × G0 → G1</code>. Outputs public parameters <code className="text-indigo-400 font-mono">PK = (G0, g, h = g^β, e(g, g)^α)</code> and master secret key <code className="text-indigo-400 font-mono">MK = (β, g^α)</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                  2. KeyGen(MK, S) → SK
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  Given attribute set <code className="text-indigo-400 font-mono">S</code> for user <code className="text-indigo-400 font-mono">u</code>, generates secret key components for each attribute <code className="text-indigo-400 font-mono">j ∈ S</code> using random polynomial secrets <code className="text-indigo-400 font-mono">r_j</code>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                  3. Encrypt(PK, M, T) → CT
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  Encrypts AES-256 session key <code className="text-indigo-400 font-mono">K</code> under access policy tree <code className="text-indigo-400 font-mono">T</code>. Shares secret <code className="text-indigo-400 font-mono">s</code> across leaf nodes using Shamir's secret sharing.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block font-mono text-[11px]">
                  4. Decrypt(CT, SK) → K
                </span>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
                  Evaluates pairing function <code className="text-indigo-400 font-mono">e(g, g)^(αs)</code> recursively from leaf nodes. If and only if attribute set <code className="text-indigo-400 font-mono">S satisfies T</code>, the pairing reconstructs session key <code className="text-indigo-400 font-mono">K</code> to decrypt the payload.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
              <span className="font-bold text-indigo-900 dark:text-indigo-300 block mb-1">
                Zero-Trust Dynamic Revocation Property
              </span>
              <p className="text-indigo-800 dark:text-indigo-200 leading-relaxed text-[11px]">
                When an administrator revokes an attribute or account, the user's secret key <code className="font-mono font-bold">SK</code> is immediately invalidated at the authorization barrier. The stored encrypted files do not require expensive re-encryption or distribution of new symmetric keys!
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sequence' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-500" />
            End-to-End Cryptographic Download Challenge Workflow
          </h3>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Step 1: User Revocation & Account Status Validation
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-sans block">
                Challenger token is decoded. If user status == 'REVOKED' or 'SUSPENDED', the request is terminated immediately with HTTP 403 Forbidden.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Step 2: Time-Based Access Control (TBAC) Window Verification
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-sans block">
                If file has temporal bounds, verifies currentTime ≥ accessStartTime AND currentTime ≤ accessExpiryTime. If outside window, request is aborted.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Step 3: CP-ABE Policy Evaluation on User Attributes
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-sans block">
                Active non-revoked attributes (Department, Role, ClearanceLevel, Project, Course) are parsed into the CP-ABE AST tree. If evaluation returns false, access is denied.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Step 4: AES-256-GCM Decryption & Authentication Tag Check
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-sans block">
                The session key unwraps the ciphertext with the 96-bit IV. AES-GCM validates the 128-bit authentication tag.
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                Step 5: SHA-256 Cryptographic Hash Attestation
              </span>
              <span className="text-slate-500 dark:text-slate-400 font-sans block">
                The decrypted plaintext bytes are hashed with SHA-256. The digest is compared against the stored immutable hash. If matching, file is delivered to user; otherwise an integrity breach alarm is fired.
              </span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'schema' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-500" />
            Relational MySQL Database Schema (DDL)
          </h3>

          <div className="relative">
            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`-- CipherVault Enterprise Relational Schema

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    department VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL,
    clearance_level INT NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    organization VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_attributes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL,
    attribute_name VARCHAR(50) NOT NULL,
    attribute_value VARCHAR(100) NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE cpabe_policies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expression TEXT NOT NULL,
    description TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE encrypted_files (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    classification VARCHAR(30) NOT NULL,
    policy_id VARCHAR(36) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    aes_iv VARCHAR(64) NOT NULL,
    ciphertext_path VARCHAR(500) NOT NULL,
    owner_id VARCHAR(36) NOT NULL,
    is_time_restricted BOOLEAN DEFAULT FALSE,
    access_start_time TIMESTAMP NULL,
    access_expiry_time TIMESTAMP NULL,
    is_favorite BOOLEAN DEFAULT FALSE,
    is_in_recycle_bin BOOLEAN DEFAULT FALSE,
    download_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES cpabe_policies(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(36),
    username VARCHAR(50) NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    file_id VARCHAR(36),
    file_name VARCHAR(255),
    status VARCHAR(30) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT,
    failure_reason TEXT
);`}
            </pre>
          </div>
        </div>
      )}

      {activeTab === 'api' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-500" />
            OpenAPI REST Endpoint Specifications
          </h3>

          <div className="space-y-3 font-mono text-[11px]">
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold text-[10px]">
                  POST
                </span>
                <span className="font-bold text-slate-900 dark:text-white">/api/v1/auth/login</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Authenticates user credentials and returns signed JWT token with identity claims.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                  POST
                </span>
                <span className="font-bold text-slate-900 dark:text-white">/api/v1/files/upload</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Accepts file multipart, generates AES-256 session key, encrypts payload, encapsulates CP-ABE policy, and logs audit.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 font-bold text-[10px]">
                  GET
                </span>
                <span className="font-bold text-slate-900 dark:text-white">/api/v1/files/{'{fileId}'}/challenge</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Executes the 5-step CP-ABE verification challenge. If verified, streams decrypted payload with SHA-256 validation header.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 font-bold text-[10px]">
                  PUT
                </span>
                <span className="font-bold text-slate-900 dark:text-white">/api/v1/users/{'{userId}'}/attributes/{'{attrId}'}/revoke</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Revokes specified user attribute in real-time, immediately terminating associated CP-ABE access trees.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'docker' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-cyan-500" />
            Enterprise Deployment: Spring Boot 3.5 & Docker Compose
          </h3>

          <div className="space-y-3">
            <p className="text-slate-600 dark:text-slate-300">
              The platform is architected for microservice or containerized deployment with Java 21, Spring Boot 3.5, and MySQL 8.4 LTS:
            </p>

            <pre className="p-4 rounded-2xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto leading-relaxed border border-slate-800">
{`# docker-compose.yml
version: '3.8'

services:
  ciphervault-db:
    image: mysql:8.4
    container_name: ciphervault_mysql
    environment:
      MYSQL_ROOT_PASSWORD: root_master_pass
      MYSQL_DATABASE: ciphervault
      MYSQL_USER: ciphervault_app
      MYSQL_PASSWORD: vault_secure_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql

  ciphervault-backend:
    build: .
    container_name: ciphervault_api
    depends_on:
      - ciphervault-db
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://ciphervault-db:3306/ciphervault?useSSL=false
      SPRING_DATASOURCE_USERNAME: ciphervault_app
      SPRING_DATASOURCE_PASSWORD: vault_secure_pass
      CIPHERVAULT_JWT_SECRET: super_secure_256_bit_jwt_secret_key_production
    ports:
      - "8080:8080"

volumes:
  mysql_data:`}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
