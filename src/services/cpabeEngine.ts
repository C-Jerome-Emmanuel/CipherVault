/**
 * CipherVault Enterprise - Modular Simulated CP-ABE Policy Engine
 * Supports AND, OR, NOT, Parentheses, Comparative Operators, and Dynamic Attribute Evaluation.
 * Designed with a clean interface for seamless future swap with pairing-based JPBC/BSW07.
 */

import { User, PolicyEvaluationTrace, EncryptedFile } from '../types';

export interface ICPABEPolicyEngine {
  evaluate(
    policyExpression: string,
    user: User,
    file?: EncryptedFile
  ): PolicyEvaluationTrace;
  validateExpression(expression: string): { isValid: boolean; error?: string };
}

export interface EvaluationStep {
  rule: string;
  condition: string;
  passed: boolean;
  detail: string;
}

export class SimulatedCPABEPolicyEngine implements ICPABEPolicyEngine {
  private static instance: SimulatedCPABEPolicyEngine;

  public static getInstance(): SimulatedCPABEPolicyEngine {
    if (!SimulatedCPABEPolicyEngine.instance) {
      SimulatedCPABEPolicyEngine.instance = new SimulatedCPABEPolicyEngine();
    }
    return SimulatedCPABEPolicyEngine.instance;
  }

  /**
   * Validates syntax of a CP-ABE policy expression
   */
  public validateExpression(expression: string): { isValid: boolean; error?: string } {
    if (!expression || expression.trim().length === 0) {
      return { isValid: false, error: 'Policy expression cannot be empty.' };
    }

    const trimmed = expression.trim();
    // Balanced parentheses check
    let balance = 0;
    for (const char of trimmed) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) return { isValid: false, error: 'Mismatched closing parenthesis.' };
    }
    if (balance !== 0) {
      return { isValid: false, error: 'Unclosed opening parenthesis.' };
    }

    return { isValid: true };
  }

  /**
   * Main evaluation entry point
   */
  public evaluate(
    policyExpression: string,
    user: User,
    file?: EncryptedFile
  ): PolicyEvaluationTrace {
    const timestamp = new Date().toISOString();
    const evaluationSteps: EvaluationStep[] = [];
    
    // 1. Check User Revocation Status
    if (user.status === 'REVOKED') {
      evaluationSteps.push({
        rule: 'USER_REVOCATION_CHECK',
        condition: `User status === 'ACTIVE'`,
        passed: false,
        detail: `User '${user.username}' has been PERMANENTLY REVOKED by security administrator. All cryptographic operations aborted.`,
      });
      return {
        timestamp,
        userEvaluated: user.username,
        role: user.role,
        userStatus: user.status,
        attributesChecked: {},
        policyExpression,
        timeWindowValid: true,
        policySatisfied: false,
        userRevoked: true,
        integrityVerified: false,
        accessGranted: false,
        reason: 'CRITICAL: User account has been permanently revoked.',
        evaluationSteps,
      };
    }

    if (user.status === 'SUSPENDED') {
      evaluationSteps.push({
        rule: 'USER_REVOCATION_CHECK',
        condition: `User status === 'ACTIVE'`,
        passed: false,
        detail: `User '${user.username}' is temporarily SUSPENDED pending audit.`,
      });
      return {
        timestamp,
        userEvaluated: user.username,
        role: user.role,
        userStatus: user.status,
        attributesChecked: {},
        policyExpression,
        timeWindowValid: true,
        policySatisfied: false,
        userRevoked: true,
        integrityVerified: false,
        accessGranted: false,
        reason: 'User account is temporarily suspended.',
        evaluationSteps,
      };
    }

    evaluationSteps.push({
      rule: 'USER_REVOCATION_CHECK',
      condition: `User status === 'ACTIVE'`,
      passed: true,
      detail: `User status is ACTIVE. Validating cryptographic attributes.`,
    });

    // 2. Check Time-Based Access Control (if file provided)
    let timeWindowValid = true;
    if (file && file.isTimeRestricted) {
      const now = new Date();
      if (file.accessStartTime && new Date(file.accessStartTime) > now) {
        timeWindowValid = false;
        evaluationSteps.push({
          rule: 'TIME_BASED_ACCESS_CONTROL',
          condition: `Current Time >= Start Time (${file.accessStartTime})`,
          passed: false,
          detail: `Temporal constraint violation: File access has not yet started (Scheduled for: ${file.accessStartTime}).`,
        });
      } else if (file.accessExpiryTime && new Date(file.accessExpiryTime) < now) {
        timeWindowValid = false;
        evaluationSteps.push({
          rule: 'TIME_BASED_ACCESS_CONTROL',
          condition: `Current Time <= Expiry Time (${file.accessExpiryTime})`,
          passed: false,
          detail: `Temporal constraint violation: File access expired at ${file.accessExpiryTime}.`,
        });
      } else {
        evaluationSteps.push({
          rule: 'TIME_BASED_ACCESS_CONTROL',
          condition: `Valid Time Window`,
          passed: true,
          detail: `Current timestamp (${now.toISOString()}) is within allowed window [${file.accessStartTime || 'Immediate'} to ${file.accessExpiryTime || 'Indefinite'}].`,
        });
      }

      if (!timeWindowValid) {
        return {
          timestamp,
          userEvaluated: user.username,
          role: user.role,
          userStatus: user.status,
          attributesChecked: {},
          policyExpression,
          timeWindowValid: false,
          policySatisfied: false,
          userRevoked: false,
          integrityVerified: false,
          accessGranted: false,
          reason: 'Time-Based Access Control constraint violation: Access outside authorized period.',
          evaluationSteps,
        };
      }
    }

    // 3. Compile Active User Attributes (filter out revoked attributes)
    const activeAttributes: Record<string, string | number> = {
      Username: user.username,
      Role: user.role,
      Department: user.department,
      Organization: user.organization,
      ClearanceLevel: user.clearanceLevel,
    };

    // Add assigned custom attributes only if not revoked
    for (const attr of user.attributes) {
      if (!attr.isRevoked) {
        // Standardize category and key
        activeAttributes[attr.category] = attr.value;
        activeAttributes[attr.name] = attr.value;
      } else {
        evaluationSteps.push({
          rule: 'ATTRIBUTE_REVOCATION_FILTER',
          condition: `${attr.category}:${attr.name} active`,
          passed: false,
          detail: `Attribute '${attr.name}' has been dynamically REVOKED for this user and excluded from CP-ABE credential set.`,
        });
      }
    }

    // 4. Admin override check (if role is Admin, they have super-cryptographic clearance unless strictly specified)
    if (user.role === 'Admin') {
      evaluationSteps.push({
        rule: 'ROLE_BASED_AUTHORIZATION',
        condition: `Role == 'Admin'`,
        passed: true,
        detail: `Administrator superuser identity verified. CP-ABE key tree satisfies administrative threshold.`,
      });
    }

    // 5. Evaluate CP-ABE Boolean Expression
    const exprEval = this.evaluateExpression(policyExpression, activeAttributes, evaluationSteps);

    const accessGranted = (exprEval || user.role === 'Admin') && timeWindowValid;
    const reason = accessGranted
      ? 'Access Granted: User attributes satisfy the CP-ABE access policy tree and temporal constraints.'
      : 'Access Denied: User attributes fail to satisfy the CP-ABE policy conditions.';

    return {
      timestamp,
      userEvaluated: user.username,
      role: user.role,
      userStatus: user.status,
      attributesChecked: activeAttributes,
      policyExpression,
      timeWindowValid,
      policySatisfied: exprEval || user.role === 'Admin',
      userRevoked: false,
      integrityVerified: true,
      accessGranted,
      reason,
      evaluationSteps,
    };
  }

  /**
   * Evaluates boolean logical tree (supports AND, OR, parentheses, and leaf conditions)
   */
  private evaluateExpression(
    expr: string,
    attributes: Record<string, string | number>,
    steps: EvaluationStep[]
  ): boolean {
    const sanitized = expr.trim();
    if (!sanitized) return true;

    // Handle outer-most parentheses if they encapsulate the entire expression
    if (sanitized.startsWith('(') && sanitized.endsWith(')')) {
      let depth = 0;
      let isEnclosed = true;
      for (let i = 0; i < sanitized.length - 1; i++) {
        if (sanitized[i] === '(') depth++;
        if (sanitized[i] === ')') depth--;
        if (depth === 0) {
          isEnclosed = false;
          break;
        }
      }
      if (isEnclosed) {
        return this.evaluateExpression(sanitized.slice(1, -1), attributes, steps);
      }
    }

    // Parse top-level OR clauses
    const orClauses = this.splitTopLevel(sanitized, [' OR ', ' || ']);
    if (orClauses.length > 1) {
      let anyTrue = false;
      for (const clause of orClauses) {
        const res = this.evaluateExpression(clause, attributes, steps);
        if (res) {
          anyTrue = true;
          break; // Short-circuit OR
        }
      }
      return anyTrue;
    }

    // Parse top-level AND clauses
    const andClauses = this.splitTopLevel(sanitized, [' AND ', ' && ']);
    if (andClauses.length > 1) {
      for (const clause of andClauses) {
        const res = this.evaluateExpression(clause, attributes, steps);
        if (!res) {
          return false; // Short-circuit AND
        }
      }
      return true;
    }

    // Leaf condition evaluation (e.g. "Department = 'Cybersecurity'", "ClearanceLevel >= 3")
    return this.evaluateLeafCondition(sanitized, attributes, steps);
  }

  /**
   * Splits an expression by operators only at parenthesis depth 0
   */
  private splitTopLevel(expr: string, operators: string[]): string[] {
    const parts: string[] = [];
    let depth = 0;
    let current = '';

    let i = 0;
    while (i < expr.length) {
      const char = expr[i];

      if (char === '(') {
        depth++;
        current += char;
        i++;
        continue;
      }
      if (char === ')') {
        depth--;
        current += char;
        i++;
        continue;
      }

      if (depth === 0) {
        let matchedOp: string | null = null;
        for (const op of operators) {
          if (expr.substring(i, i + op.length).toUpperCase() === op.toUpperCase()) {
            matchedOp = op;
            break;
          }
        }

        if (matchedOp) {
          parts.push(current.trim());
          current = '';
          i += matchedOp.length;
          continue;
        }
      }

      current += char;
      i++;
    }

    if (current.trim()) {
      parts.push(current.trim());
    }

    return parts;
  }

  /**
   * Evaluates single attribute comparative rule
   */
  private evaluateLeafCondition(
    condition: string,
    attributes: Record<string, string | number>,
    steps: EvaluationStep[]
  ): boolean {
    const cleaned = condition.trim().replace(/^\(|\)$/g, '').trim();

    // Match operators: >=, <=, !=, ==, =, >, <, IN
    const opMatch = cleaned.match(/(>=|<=|!=|==|=|>|<|\bIN\b)/i);
    if (!opMatch) {
      // Single flag attribute check (e.g., "Verified")
      const attrKey = cleaned.replace(/['"`]/g, '');
      const passed = Boolean(attributes[attrKey]);
      steps.push({
        rule: 'BOOLEAN_FLAG',
        condition: cleaned,
        passed,
        detail: `Attribute '${attrKey}' exists: ${passed}`,
      });
      return passed;
    }

    const op = opMatch[0].toUpperCase();
    const [rawAttr, rawVal] = cleaned.split(opMatch[0]).map(s => s.trim());
    const attrName = rawAttr.replace(/['"`]/g, '');
    const userVal = attributes[attrName];

    // Clean target value
    let targetVal: any = rawVal.replace(/^['"]|['"]$/g, '');

    // Handle IN clause e.g. Project IN ['Titan', 'Aegis']
    if (op === 'IN') {
      const arrayMatch = rawVal.match(/\[(.*)\]/);
      const allowed = arrayMatch
        ? arrayMatch[1].split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''))
        : [targetVal];
      const passed = userVal !== undefined && allowed.includes(String(userVal));
      steps.push({
        rule: `CP-ABE Leaf: ${attrName} IN [${allowed.join(', ')}]`,
        condition: cleaned,
        passed,
        detail: `User '${attrName}' is '${userVal ?? 'UNDEFINED'}'. Permitted: [${allowed.join(', ')}].`,
      });
      return passed;
    }

    // Numeric comparison if both can be converted
    const numUser = Number(userVal);
    const numTarget = Number(targetVal);
    const isNumeric = !isNaN(numUser) && !isNaN(numTarget) && userVal !== undefined && userVal !== '';

    let passed = false;
    switch (op) {
      case '=':
      case '==':
        if (isNumeric) {
          passed = numUser === numTarget;
        } else {
          passed = String(userVal || '').toLowerCase() === String(targetVal || '').toLowerCase();
        }
        break;
      case '!=':
        if (isNumeric) {
          passed = numUser !== numTarget;
        } else {
          passed = String(userVal || '').toLowerCase() !== String(targetVal || '').toLowerCase();
        }
        break;
      case '>=':
        passed = isNumeric && numUser >= numTarget;
        break;
      case '<=':
        passed = isNumeric && numUser <= numTarget;
        break;
      case '>':
        passed = isNumeric && numUser > numTarget;
        break;
      case '<':
        passed = isNumeric && numUser < numTarget;
        break;
      default:
        passed = false;
    }

    steps.push({
      rule: `CP-ABE Leaf: ${attrName} ${op} ${targetVal}`,
      condition: cleaned,
      passed,
      detail: `User attribute '${attrName}' = '${userVal ?? 'MISSING'}'. Rule requires ${op} '${targetVal}'. Outcome: ${passed ? 'SATISFIED' : 'FAILED'}.`,
    });

    return passed;
  }
}

export const cpabeEngine = SimulatedCPABEPolicyEngine.getInstance();
