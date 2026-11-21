/**
 * =========================================================================
 * HANZIGO — LÃO SƯ AI AGENT: REAL TOOL REGISTRY
 * =========================================================================
 * Unified allowlist, JSON-schema validation, permission guard hook,
 * per-tool timeout, PII/secret-redacted error handling, and Gemini
 * functionDeclarations exporter.
 */

import { RISK_LEVELS } from './contracts.js';
import { redactSensitiveData } from './guardrails.js';

const DEFAULT_TOOL_TIMEOUT_MS = 4000;
const DEFAULT_MAX_STRING_LENGTH = 200;

export class ToolRegistry {
  constructor() {
    this._tools = new Map();
  }

  /**
   * Register a tool contract and handler.
   * High-risk tools are strictly forbidden from being registered.
   */
  register(definition) {
    if (!definition || typeof definition !== 'object') {
      throw new Error('Tool definition must be an object.');
    }
    const {
      name,
      description,
      riskLevel = RISK_LEVELS.LOW,
      parameters = { type: 'object', properties: {}, required: [] },
      execute,
      permissionGuard = null,
      timeoutMs = DEFAULT_TOOL_TIMEOUT_MS,
    } = definition;

    if (!name || typeof name !== 'string' || !/^[a-z][a-z0-9_]{2,63}$/.test(name)) {
      throw new Error(`Invalid tool name: ${String(name)}`);
    }
    if (!description || typeof description !== 'string') {
      throw new Error(`Tool "${name}" requires a description.`);
    }
    if (riskLevel === RISK_LEVELS.HIGH) {
      throw new Error(`Tool "${name}" cannot be registered with high risk level.`);
    }
    if (!Object.values(RISK_LEVELS).includes(riskLevel)) {
      throw new Error(`Invalid riskLevel "${riskLevel}" for tool "${name}".`);
    }
    if (typeof execute !== 'function') {
      throw new Error(`Tool "${name}" requires an execute(args, context) function.`);
    }

    this._tools.set(name, {
      name,
      description,
      riskLevel,
      parameters,
      execute,
      permissionGuard,
      timeoutMs: Math.min(10000, Math.max(200, Number(timeoutMs) || DEFAULT_TOOL_TIMEOUT_MS)),
    });
    return this;
  }

  has(name) {
    return this._tools.has(name);
  }

  get(name) {
    return this._tools.get(name) || null;
  }

  listNames() {
    return Array.from(this._tools.keys());
  }

  /**
   * Export tool definitions in Gemini functionDeclarations format.
   */
  getGeminiFunctionDeclarations(allowedToolNames = null) {
    const filterSet = Array.isArray(allowedToolNames) ? new Set(allowedToolNames) : null;
    const declarations = [];

    for (const tool of this._tools.values()) {
      if (tool.riskLevel === RISK_LEVELS.HIGH) continue;
      if (filterSet && !filterSet.has(tool.name)) continue;

      declarations.push({
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      });
    }
    return declarations;
  }

  /**
   * Validate raw arguments against the tool's JSON Schema.
   */
  validateArgs(schema = {}, rawArgs = {}) {
    if (rawArgs === null || typeof rawArgs !== 'object' || Array.isArray(rawArgs)) {
      return { valid: false, error: 'Tool arguments must be a JSON object.' };
    }

    const properties = schema?.properties && typeof schema.properties === 'object' ? schema.properties : {};
    const required = Array.isArray(schema?.required) ? schema.required : [];

    for (const reqKey of required) {
      const val = rawArgs[reqKey];
      if (val === undefined || val === null || (typeof val === 'string' && !val.trim())) {
        return { valid: false, error: `Missing required parameter: ${reqKey}` };
      }
    }

    const sanitizedArgs = {};
    for (const [key, propSchema] of Object.entries(properties)) {
      const val = rawArgs[key];
      if (val === undefined || val === null) continue;

      const expectedType = propSchema?.type;
      if (expectedType === 'string') {
        if (typeof val !== 'string') {
          return { valid: false, error: `Parameter "${key}" must be a string.` };
        }
        const trimmed = val.trim();
        const maxLen = Number(propSchema.maxLength || DEFAULT_MAX_STRING_LENGTH);
        if (trimmed.length > maxLen) {
          return { valid: false, error: `Parameter "${key}" exceeds max length (${maxLen}).` };
        }
        if (Array.isArray(propSchema.enum) && !propSchema.enum.includes(trimmed)) {
          return { valid: false, error: `Parameter "${key}" must be one of: ${propSchema.enum.join(', ')}` };
        }
        sanitizedArgs[key] = trimmed;
      } else if (expectedType === 'integer' || expectedType === 'number') {
        const num = Number(val);
        if (!Number.isFinite(num)) {
          return { valid: false, error: `Parameter "${key}" must be a finite number.` };
        }
        if (expectedType === 'integer' && !Number.isInteger(num)) {
          return { valid: false, error: `Parameter "${key}" must be an integer.` };
        }
        if (typeof propSchema.minimum === 'number' && num < propSchema.minimum) {
          return { valid: false, error: `Parameter "${key}" must be >= ${propSchema.minimum}.` };
        }
        if (typeof propSchema.maximum === 'number' && num > propSchema.maximum) {
          return { valid: false, error: `Parameter "${key}" must be <= ${propSchema.maximum}.` };
        }
        sanitizedArgs[key] = num;
      } else if (expectedType === 'boolean') {
        if (typeof val !== 'boolean') {
          return { valid: false, error: `Parameter "${key}" must be a boolean.` };
        }
        sanitizedArgs[key] = val;
      } else if (expectedType === 'array') {
        if (!Array.isArray(val)) {
          return { valid: false, error: `Parameter "${key}" must be an array.` };
        }
        sanitizedArgs[key] = val;
      } else {
        sanitizedArgs[key] = val;
      }
    }

    return { valid: true, sanitizedArgs };
  }

  /**
   * Execute a registered tool with allowlist check, risk block, permission guard,
   * schema validation, hard timeout, and safe error redaction.
   */
  async executeTool(toolName, rawArgs = {}, executionContext = {}) {
    const startTime = Date.now();
    const tool = this._tools.get(toolName);

    if (!tool) {
      return {
        ok: false,
        toolName: String(toolName || ''),
        data: null,
        sources: [],
        latencyMs: Date.now() - startTime,
        error: `Tool "${String(toolName || '')}" is not registered or not allowed.`,
      };
    }

    if (tool.riskLevel === RISK_LEVELS.HIGH) {
      return {
        ok: false,
        toolName: tool.name,
        data: null,
        sources: [],
        latencyMs: Date.now() - startTime,
        error: `Tool "${tool.name}" is blocked by high-risk policy.`,
      };
    }

    const validation = this.validateArgs(tool.parameters, rawArgs);
    if (!validation.valid) {
      return {
        ok: false,
        toolName: tool.name,
        data: null,
        sources: [],
        latencyMs: Date.now() - startTime,
        error: validation.error,
      };
    }

    if (typeof tool.permissionGuard === 'function') {
      try {
        const perm = await tool.permissionGuard(executionContext, validation.sanitizedArgs);
        if (!perm || perm.allowed !== true) {
          return {
            ok: false,
            toolName: tool.name,
            data: null,
            sources: [],
            latencyMs: Date.now() - startTime,
            error: perm?.reason || 'Permission denied for this tool.',
          };
        }
      } catch (permErr) {
        return {
          ok: false,
          toolName: tool.name,
          data: null,
          sources: [],
          latencyMs: Date.now() - startTime,
          error: String(redactSensitiveData(permErr?.message || 'Permission check failed.')),
        };
      }
    }

    let timerId = null;
    try {
      const timeoutPromise = new Promise((_, reject) => {
        timerId = setTimeout(() => {
          reject(new Error(`Tool "${tool.name}" timed out after ${tool.timeoutMs}ms.`));
        }, tool.timeoutMs);
      });

      const result = await Promise.race([
        Promise.resolve(tool.execute(validation.sanitizedArgs, executionContext)),
        timeoutPromise,
      ]);

      const rawSources = Array.isArray(result?.sources) ? result.sources : [];
      const normalizedSources = rawSources
        .filter((s) => s && s.sourceId)
        .map((s) => ({
          sourceId: String(s.sourceId),
          title: String(s.title || s.sourceId),
          type: String(s.type || 'knowledge'),
          verified: s.verified !== false,
        }));

      return {
        ok: true,
        toolName: tool.name,
        data: result?.data ?? result ?? null,
        sources: normalizedSources,
        latencyMs: Date.now() - startTime,
      };
    } catch (err) {
      return {
        ok: false,
        toolName: tool.name,
        data: null,
        sources: [],
        latencyMs: Date.now() - startTime,
        error: String(redactSensitiveData(err?.message || 'Tool execution failed.')),
      };
    } finally {
      if (timerId) clearTimeout(timerId);
    }
  }
}

export function createToolRegistry() {
  return new ToolRegistry();
}
