// ─── ERROR LOG ENGINE (The "Black Book") ──────────────────────────────────────
// This engine manages a persistent log of questions the user answered incorrectly.

const STORAGE_KEY = 'gre_errorLog';

const loadLog = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
};

const saveLog = (log) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
  // Dispatch event so UI can update reactively if needed
  window.dispatchEvent(new Event('gre_errorLog_updated'));
};

/**
 * Logs a mistake into the error log.
 * @param {Object} question - The full question object (including explanation, options, etc.)
 * @param {String|Array} userAnswer - What the user selected.
 * @param {String} subject - 'verbal' or 'quant'
 */
export function logMistake(question, userAnswer, subject) {
  const log = loadLog();
  
  // Prevent duplicate exact questions from piling up endlessly (if user gets it wrong 5 times in a row)
  // We'll update the timestamp and userAnswer instead.
  const existingIdx = log.findIndex(entry => entry.q.id === question.id && entry.subject === subject);
  
  const newEntry = {
    id: `err_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    q: question,
    userAnswer,
    subject, // 'verbal' | 'quant'
    topic: question.type || question.topic || 'unknown', 
    timestamp: new Date().toISOString(),
    resolved: false
  };

  if (existingIdx >= 0) {
    // If it's already resolved, mark it unresolved again and update
    log[existingIdx] = newEntry;
  } else {
    log.unshift(newEntry); // Add to beginning (newest first)
  }

  saveLog(log);
}

export function resolveMistake(errorId) {
  const log = loadLog();
  const entry = log.find(e => e.id === errorId);
  if (entry) {
    entry.resolved = true;
    entry.resolvedAt = new Date().toISOString();
    saveLog(log);
  }
}

export function getErrorLog(subjectFilter = 'all', includeResolved = false) {
  let log = loadLog();
  
  if (!includeResolved) {
    log = log.filter(e => !e.resolved);
  }
  
  if (subjectFilter !== 'all') {
    log = log.filter(e => e.subject === subjectFilter);
  }
  
  return log;
}

export function getErrorLogStats() {
  const log = loadLog();
  const unresolved = log.filter(e => !e.resolved);
  const resolved = log.filter(e => e.resolved);
  
  const byTopic = {};
  unresolved.forEach(e => {
    byTopic[e.topic] = (byTopic[e.topic] || 0) + 1;
  });

  return {
    totalUnresolved: unresolved.length,
    totalResolved: resolved.length,
    byTopic,
  };
}
