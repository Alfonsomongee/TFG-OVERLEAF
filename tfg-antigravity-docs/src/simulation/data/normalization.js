/**
 * Normalization utilities for telemetry data
 */

/**
 * Normalizes absolute timestamps to T-0 relative seconds
 * @param {string|number} timestamp - ISO string or unix epoch
 * @param {string|number} tZero - ISO string or unix epoch of the incident
 * @returns {number} Seconds relative to T-0
 */
export function normalizeTimeToRelative(timestamp, tZero) {
  const t1 = new Date(timestamp).getTime();
  const t0 = new Date(tZero).getTime();
  return (t1 - t0) / 1000;
}

/**
 * Safely computes ROCOF given two frequency points and a time delta
 * @param {number} f1 - Initial frequency
 * @param {number} f2 - Final frequency
 * @param {number} dt - Time delta in seconds
 * @returns {number} Rate of Change of Frequency in Hz/s
 */
export function computeRocof(f1, f2, dt) {
  if (dt === 0) return 0;
  return (f2 - f1) / dt;
}

/**
 * Normalizes a node's voltage to per-unit (pu) given its base voltage
 * @param {number} voltageKV - Actual voltage in kV
 * @param {number} baseKV - Base voltage in kV (e.g., 400, 220)
 * @returns {number} Per-unit voltage
 */
export function normalizeVoltagePU(voltageKV, baseKV) {
  if (baseKV === 0) return 0;
  return voltageKV / baseKV;
}
