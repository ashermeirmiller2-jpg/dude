// SRS (Spaced Repetition System) using SM-2 algorithm
// Simpler than FSRS for MVP, well-tested and understood

// Word states
export const WORD_STATES = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  SOLID: 'solid',
  MASTERED: 'mastered'
};

// Sentence states
export const SENTENCE_STATES = {
  NEW: 'new',
  LEARNING: 'learning',
  REVIEW: 'review',
  MASTERED: 'mastered'
};

// SM-2 Algorithm parameters
const DEFAULT_EASE = 2.5;
const MIN_EASE = 1.3;

/**
 * Calculate the next review interval using SM-2 algorithm
 * @param {number} quality - Quality of recall (0-5): 0=blackout, 3=hard, 4=good, 5=easy
 * @param {number} ease - Ease factor (default 2.5)
 * @param {number} interval - Current interval in days
 * @param {number} repetitions - Number of successful repetitions
 * @returns {object} - { interval: number, ease: number, repetitions: number }
 */
export function calculateSM2(quality, ease = DEFAULT_EASE, interval = 0, repetitions = 0) {
  let newEase = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  newEase = Math.max(MIN_EASE, newEase);
  
  let newRepetitions = repetitions;
  let newInterval = interval;
  
  if (quality >= 3) {
    newRepetitions = repetitions + 1;
    if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEase);
    }
  } else {
    newRepetitions = 0;
    newInterval = 1;
  }
  
  return {
    interval: newInterval,
    ease: newEase,
    repetitions: newRepetitions
  };
}

/**
 * Determine word state based on SRS metrics
 * @param {number} stability - Stability score (days until 50% forgetting)
 * @param {number} repetitions - Number of successful reviews
 * @returns {string} - Word state
 */
export function getWordState(stability, repetitions) {
  if (repetitions === 0) return WORD_STATES.NEW;
  if (stability < 3) return WORD_STATES.LEARNING;
  if (stability < 14) return WORD_STATES.REVIEW;
  if (stability < 60) return WORD_STATES.SOLID;
  return WORD_STATES.MASTERED;
}

/**
 * Determine sentence state based on SRS metrics
 * @param {number} stability - Stability score
 * @param {number} repetitions - Number of successful reviews
 * @returns {string} - Sentence state
 */
export function getSentenceState(stability, repetitions) {
  if (repetitions === 0) return SENTENCE_STATES.NEW;
  if (stability < 3) return SENTENCE_STATES.LEARNING;
  if (stability < 14) return SENTENCE_STATES.REVIEW;
  return SENTENCE_STATES.MASTERED;
}

/**
 * Calculate due date from interval
 * @param {number} intervalDays - Interval in days
 * @returns {Date} - Due date
 */
export function calculateDueDate(intervalDays) {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + intervalDays);
  return dueDate;
}

/**
 * Check if a word/sentence is due for review
 * @param {Date} dueDate - The due date
 * @returns {boolean}
 */
export function isDue(dueDate) {
  return new Date(dueDate) <= new Date();
}

/**
 * Get items that are due for review
 * @param {Array} items - Array of items with due_date property
 * @returns {Array} - Items that are due
 */
export function getDueItems(items) {
  const now = new Date();
  return items.filter(item => new Date(item.due_date) <= now);
}

/**
 * Session construction algorithm
 * Builds a session from due words and appropriate sentences
 * @param {Array} userWords - User's word states
 * @param {Array} userSentences - User's sentence states
 * @param {Array} allSentences - All available sentences
 * @param {number} maxItems - Maximum items in session (default 15)
 * @returns {Array} - Session items to review
 */
export function buildSession(userWords, userSentences, allSentences, maxItems = 15) {
  const session = [];
  const knownWordIds = userWords
    .filter(uw => uw.state !== WORD_STATES.NEW && !isDue(new Date(uw.due_date)))
    .map(uw => uw.word_id);
  
  // 1. Pull all words due for review
  const dueWords = getDueItems(userWords);
  dueWords.forEach(wordState => {
    if (session.length >= maxItems) return;
    session.push({ type: 'word', ...wordState });
  });
  
  // 2. For each due word, find sentences containing it with 70%+ known words
  dueWords.forEach(wordState => {
    if (session.length >= maxItems) return;
    
    const matchingSentences = allSentences.filter(sentence => 
      sentence.word_ids.includes(wordState.word_id) &&
      getWordCoverage(sentence.word_ids, knownWordIds) >= 0.7
    );
    
    // Pick 1-2 sentences per due word
    matchingSentences.slice(0, 2).forEach(sentence => {
      if (session.length >= maxItems) return;
      
      const sentenceState = userSentences.find(us => us.sentence_id === sentence.id);
      if (!sentenceState || isDue(new Date(sentenceState.due_date))) {
        session.push({ type: 'sentence', sentence, wordState: sentenceState });
      }
    });
  });
  
  // 3. Fill remaining slots with new words (up to 10) and new sentences
  const newWords = userWords.filter(uw => uw.state === WORD_STATES.NEW).slice(0, 10);
  newWords.forEach(wordState => {
    if (session.length >= maxItems) return;
    session.push({ type: 'word_introduction', ...wordState });
  });
  
  // Shuffle session to avoid predictable order
  shuffleArray(session);
  
  return session;
}

/**
 * Calculate word coverage percentage
 * @param {Array} sentenceWordIds - Word IDs in the sentence
 * @param {Array} knownWordIds - Word IDs the user knows
 * @returns {number} - Coverage percentage (0-1)
 */
export function getWordCoverage(sentenceWordIds, knownWordIds) {
  if (sentenceWordIds.length === 0) return 0;
  const knownCount = sentenceWordIds.filter(id => knownWordIds.includes(id)).length;
  return knownCount / sentenceWordIds.length;
}

/**
 * Fisher-Yates shuffle
 * @param {Array} array - Array to shuffle
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * Grade quality from user performance
 * @param {boolean} correct - Was the answer correct?
 * @param {boolean} usedHint - Did the user use a hint?
 * @param {number} timeTaken - Time taken in seconds
 * @returns {number} - Quality score (0-5)
 */
export function gradeQuality(correct, usedHint, timeTaken) {
  if (!correct) return 0;
  if (usedHint) return 3;
  if (timeTaken < 5) return 5;
  if (timeTaken < 15) return 4;
  return 3;
}

export default {
  WORD_STATES,
  SENTENCE_STATES,
  calculateSM2,
  getWordState,
  getSentenceState,
  calculateDueDate,
  isDue,
  getDueItems,
  buildSession,
  getWordCoverage,
  gradeQuality
};
