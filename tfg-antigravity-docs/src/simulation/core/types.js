/**
 * Core domain types and abstractions for the Week 3 Cascade Engine.
 * Prepared in Week 2.5 architecture consolidation.
 */

/**
 * @typedef {Object} TimelineEvent
 * @property {number} id - Unique identifier
 * @property {number} timestamp - Time in seconds relative to T-0
 * @property {string} type - 'generation_loss' | 'line_trip' | 'ufls_activation' | 'protection_trip'
 * @property {string} description - Forensic description of the event
 * @property {Object} metadata - Additional context
 */

/**
 * @typedef {Object} TelemetryFrame
 * @property {number} timestamp - Time in seconds
 * @property {number} systemFrequency - Global or reference frequency in Hz
 * @property {number} globalRocof - Global Rate of Change of Frequency in Hz/s
 * @property {Object.<string, NodeState>} nodes - Map of node IDs to their states
 */

/**
 * @typedef {Object} NodeState
 * @property {string} id - Node identifier (e.g. 'ES-SUR')
 * @property {number} voltage - Voltage in pu (per-unit)
 * @property {number} frequency - Local frequency in Hz
 * @property {number} activePower - Active power injection in MW
 * @property {number} reactivePower - Reactive power injection in MVAr
 * @property {boolean} isConnected - Grid connection status
 */

/**
 * @typedef {Object} CascadeEvent
 * @property {string} sourceNodeId - Where the cascade step originated
 * @property {string[]} affectedNodeIds - Nodes impacted by this step
 * @property {string} mechanism - 'voltage_collapse' | 'overload' | 'angular_instability'
 * @property {number} severity - 1 to 5 scale
 */
