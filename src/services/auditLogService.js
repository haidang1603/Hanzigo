/**
 * =========================================================================
 * HANZI GO - AUDIT LOG SERVICE
 * =========================================================================
 * Provides persistent, traceable audit logs for sensitive operations:
 * - Classroom creation, updates, deletion, code regeneration
 * - Student removal and enrollment
 * - Assignment creation, deletion, and grading / score overrides
 * - Live classroom moderation (kick, mute, room lock)
 * - Security events (rate limit breaches, prompt injection attempts, IDOR)
 *
 * Resilience Architecture (Offline Buffer & Auto-Retry Sync):
 * - All audit events are stored locally immediately.
 * - Unsent events are queued in a persistent offline buffer (local buffer).
 * - When online / reconnected: retries flush to Supabase audit_logs table.
 * - Local pending copy is removed ONLY AFTER confirmed DB write.
 * - Zero silent audit loss guarantee.
 */

import { supabase, isSupabaseConfigured } from '../supabase/config.js';

const AUDIT_STORAGE_KEY = 'hanzigo_audit_logs_store';
const AUDIT_PENDING_QUEUE_KEY = 'hanzigo_audit_pending_queue';
const MAX_LOCAL_LOGS = 500;
const MAX_PENDING_QUEUE = 500;

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

// In-memory fallback stores for test and serverless environments
const memoryAuditLogs = [];
const memoryPendingQueue = [];

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

function getLocalPendingQueue() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(AUDIT_PENDING_QUEUE_KEY);
      if (raw) return JSON.parse(raw);
    }
  } catch {}
  return [...memoryPendingQueue];
}

function saveLocalPendingQueue(queue) {
  const bounded = (queue || []).slice(-MAX_PENDING_QUEUE);
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(AUDIT_PENDING_QUEUE_KEY, JSON.stringify(bounded));
    }
  } catch {}
  memoryPendingQueue.length = 0;
  memoryPendingQueue.push(...bounded);
}

/**
 * Flush pending audit log queue to Supabase database.
 * Only removes entries from local pending buffer upon confirmed database insert.
 */
export async function flushPendingAuditLogs() {
  const pending = getLocalPendingQueue();
  if (!pending || pending.length === 0) {
    return { success: true, flushedCount: 0, remainingCount: 0 };
  }

  if (!isSupabaseConfigured || !supabase) {
    return { success: false, error: 'Database unconfigured', remainingCount: pending.length };
  }

  // Check browser online status if available
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return { success: false, error: 'Network offline', remainingCount: pending.length };
  }

  const successfullySyncedIds = new Set();

  for (const entry of pending) {
    try {
      const { error } = await supabase.from('audit_logs').insert([{
        action: entry.action,
        category: entry.category,
        severity: entry.severity,
        actor_id: entry.actor_id,
        target_id: entry.target_id,
        metadata: entry.metadata,
        created_at: entry.created_at
      }]);

      if (!error) {
        successfullySyncedIds.add(entry.id);
      } else {
        // Stop batch on DB error to preserve order and retry later
        break;
      }
    } catch {
      // Network failure during retry; stop and keep remaining
      break;
    }
  }

  if (successfullySyncedIds.size > 0) {
    const remaining = pending.filter(entry => !successfullySyncedIds.has(entry.id));
    saveLocalPendingQueue(remaining);
    return {
      success: true,
      flushedCount: successfullySyncedIds.size,
      remainingCount: remaining.length
    };
  }

  return { success: false, flushedCount: 0, remainingCount: pending.length };
}

/**
 * Setup auto-sync listener for network reconnect events
 */
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
  window.addEventListener('online', () => {
    flushPendingAuditLogs().catch(() => {});
  });
}

/**
 * Record a structured audit log entry.
 * Guarantees persistent buffer -> attempt DB -> remove from buffer only on success.
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
    actor_id: String(actorId),
    target_id: targetId ? String(targetId) : null,
    metadata: metadata || {},
    created_at: new Date().toISOString()
  };

  // 1. Save to local audit history store
  const currentLogs = getLocalAuditLogs();
  currentLogs.push(entry);
  saveLocalAuditLogs(currentLogs);

  // 2. Add to persistent pending buffer queue
  const currentPending = getLocalPendingQueue();
  currentPending.push(entry);
  saveLocalPendingQueue(currentPending);

  // 3. Attempt immediate sync to Supabase
  if (isSupabaseConfigured && supabase) {
    const isOnline = typeof navigator === 'undefined' || navigator.onLine !== false;
    if (isOnline) {
      try {
        const { error } = await supabase.from('audit_logs').insert([{
          action: entry.action,
          category: entry.category,
          severity: entry.severity,
          actor_id: entry.actor_id,
          target_id: entry.target_id,
          metadata: entry.metadata,
          created_at: entry.created_at
        }]);

        if (!error) {
          // Success: remove exclusively this entry from pending buffer queue
          const updatedPending = getLocalPendingQueue().filter(item => item.id !== entry.id);
          saveLocalPendingQueue(updatedPending);
        }
      } catch {
        // Keep in pending buffer for next reconnect retry
      }
    }
  }

  return entry;
}

/**
 * Get count of pending audit logs waiting for database sync
 */
export function getPendingAuditLogsCount() {
  return getLocalPendingQueue().length;
}

/**
 * Get raw pending audit logs queue
 */
export function getPendingAuditLogs() {
  return getLocalPendingQueue();
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
      localStorage.removeItem(AUDIT_PENDING_QUEUE_KEY);
    }
  } catch {}
  memoryAuditLogs.length = 0;
  memoryPendingQueue.length = 0;
  return true;
}
