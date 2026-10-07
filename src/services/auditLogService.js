/**
 * =========================================================================
 * HANZI GO - AUDIT LOG SERVICE
 * =========================================================================
 * Provides persistent, traceable audit logs for sensitive operations:
 * - Classroom creation, updates, deletion, code regeneration
 * - Student removal and enrollment
 * - Assignment creation, deletion, and grade overrides
 * - Live classroom moderation (kick, mute, room lock)
 * - Security events (rate limit breaches, prompt injection attempts)
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

const AUDIT_STORAGE_KEY = 'hanzigo_audit_logs_store';
const MAX_LOCAL_LOGS = 500;

export const AUDIT_CATEGORIES = {
  AUTH: 'AUTH',
  CLASSROOM: 'CLASSROOM',
  ASSIGNMENT: 'ASSIGNMENT',
  LIVE_ROOM: 'LIVE_ROOM',
  SECURITY: 'SECURITY'
};

export const AUDIT_SEVERITY = {
  INFO: 'INFO',
  WARN: 'WARN',
  SECURITY_ALERT: 'SECURITY_ALERT'
};

// In-memory fallback for test and serverless environments
const memoryAuditLogs = [];

function getLocalAuditLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return [...memoryAuditLogs];
}

function saveLocalAuditLogs(logs) {
  const bounded = (logs || []).slice(-MAX_LOCAL_LOGS);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(bounded));
    }
  } catch {}
  memoryAuditLogs.length = 0;
  memoryAuditLogs.push(...bounded);
}

/**
 * Record a structured audit log entry
 */
export async function recordAuditLog({
  action,
  category = AUDIT_CATEGORIES.CLASSROOM,
  severity = AUDIT_SEVERITY.INFO,
  actorId = 'anonymous',
  targetId = null,
  metadata = {}
}) {
  if (!action) return null;

  const entry = {
    id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    action,
    category,
    severity,
    actor_id: actorId,
    target_id: targetId,
    metadata: metadata || {},
    created_at: new Date().toISOString()
  };

  // 1. Save locally
  const current = getLocalAuditLogs();
  current.push(entry);
  saveLocalAuditLogs(current);

  // 2. Persist to Supabase if configured and table exists
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('audit_logs').insert([{
        action: entry.action,
        category: entry.category,
        severity: entry.severity,
        actor_id: entry.actor_id,
        target_id: entry.target_id,
        metadata: entry.metadata,
        created_at: entry.created_at
      }]);
    } catch {
      // Gracefully continue with local log
    }
  }

  return entry;
}

/**
 * Query audit logs with optional filters
 */
export async function getAuditLogs({
  category = null,
  actorId = null,
  targetId = null,
  severity = null,
  limit = 50
} = {}) {
  let logs = getLocalAuditLogs();

  if (category) {
    logs = logs.filter(l => l.category === category);
  }
  if (actorId) {
    logs = logs.filter(l => l.actor_id === actorId);
  }
  if (targetId) {
    logs = logs.filter(l => l.target_id === targetId);
  }
  if (severity) {
    logs = logs.filter(l => l.severity === severity);
  }

  return logs.slice(-limit).reverse();
}

/**
 * Clear audit logs (Testing / Reset)
 */
export function clearAuditLogs() {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(AUDIT_STORAGE_KEY);
    }
  } catch {}
  memoryAuditLogs.length = 0;
  return true;
}
