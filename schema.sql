-- CipherVault Enterprise Database Schema (MySQL 8.4 LTS)
-- Enhanced CP-ABE Cloud File Sharing with RBAC, ABAC, Audit & Revocation

CREATE DATABASE IF NOT EXISTS ciphervault CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ciphervault;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
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
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_username (username),
    INDEX idx_user_status (status),
    INDEX idx_user_department (department)
) ENGINE=InnoDB;

-- User Dynamic Attributes Table (ABAC)
CREATE TABLE IF NOT EXISTS user_attributes (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    category VARCHAR(50) NOT NULL,
    attribute_name VARCHAR(50) NOT NULL,
    attribute_value VARCHAR(100) NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_attr_user (user_id),
    INDEX idx_attr_status (is_revoked)
) ENGINE=InnoDB;

-- CP-ABE Access Policies Table
CREATE TABLE IF NOT EXISTS cpabe_policies (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    expression TEXT NOT NULL,
    description TEXT,
    created_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_policy_name (name)
) ENGINE=InnoDB;

-- Encrypted Files Metadata Table
CREATE TABLE IF NOT EXISTS encrypted_files (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    classification VARCHAR(30) NOT NULL,
    category VARCHAR(30) NOT NULL DEFAULT 'Document',
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
    current_version VARCHAR(20) DEFAULT 'v1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (policy_id) REFERENCES cpabe_policies(id),
    FOREIGN KEY (owner_id) REFERENCES users(id),
    INDEX idx_file_classification (classification),
    INDEX idx_file_owner (owner_id),
    INDEX idx_file_bin (is_in_recycle_bin)
) ENGINE=InnoDB;

-- File Version History Table
CREATE TABLE IF NOT EXISTS file_versions (
    id VARCHAR(36) PRIMARY KEY,
    file_id VARCHAR(36) NOT NULL,
    version_number VARCHAR(20) NOT NULL,
    sha256_hash VARCHAR(64) NOT NULL,
    file_size BIGINT NOT NULL,
    ciphertext_path VARCHAR(500) NOT NULL,
    uploaded_by VARCHAR(36) NOT NULL,
    change_summary VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (file_id) REFERENCES encrypted_files(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
) ENGINE=InnoDB;

-- Immutable Security Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
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
    failure_reason TEXT,
    policy_id VARCHAR(36),
    INDEX idx_audit_user (user_id),
    INDEX idx_audit_action (action_type),
    INDEX idx_audit_status (status),
    INDEX idx_audit_timestamp (timestamp)
) ENGINE=InnoDB;
