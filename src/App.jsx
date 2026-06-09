import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { BookOpen, Library, BarChart3, Settings as SettingsIcon, Home, ArrowRight, Check, X, Volume2, HelpCircle } from 'lucide-react';
import { WORDS, getFirstNWords, getWordById } from './data/words';
import { SENTENCES, getAllSentences, getSentenceById, getChunkById } from './data/sentences';
import { WORD_STATES, SENTENCE_STATES, calculateSM2, gradeQuality, buildSession, getWordCoverage } from './lib/srs';

// Word Popup Component - Global clickable word system
function WordPopup({ word, onClose, onAddToReview }) {
  if (!word) return null;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-center">
          <p className="aramaic-text text-4xl font-bold text-gray-900 dark:text-white mb-2">
            {word.nikud || word.aramaic}
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-300 italic mb-4">
            {word.transliteration}
          </p>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4 mb-4">
            <p className="font-semibold text-gray-900 dark:text-white">{word.definition_primary}</p>
            {word.definition_secondary && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{word.definition_secondary}</p>
            )}
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200 rounded-full text-sm font-medium">
              {word.word_type}
            </span>
            {word.argument_function && (
              <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
                {word.argument_function}
              </span>
            )}
          </div>
          
          {word.tier && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Tier {word.tier} • Frequency Rank #{word.frequency_rank}
            </p>
          )}
          
          <button
            onClick={onAddToReview}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Add to Review Queue
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="mt-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          Close
        </button>
      </div>
    </div>
  );
}

// Clickable Aramaic Text Component
function ClickableAramaic({ text, onWordClick }) {
  // Simple word splitter - in production this would be more sophisticated
  const words = text.split(' ').map((word, index) => ({
    text: word,
    id: `word-${index}`
  }));
  
  return (
    <div className="aramaic-text text-3xl md:text-4xl leading-relaxed">
      {words.map((word, idx) => (
        <span
          key={word.id}
          onClick={() => onWordClick && onWordClick(word.text)}
          className="inline-block cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded px-1 mx-0.5 transition-colors"
        >
          {word.text}
        </span>
      ))}
    </div>
  );
}

// Tile Arrange Mode Component
function TileMode({ sentence, correctTranslation, onComplete, onHint }) {
  const [selectedTiles, setSelectedTiles] = useState([]);
  const [availableTiles, setAvailableTiles] = useState([]);
  const [feedback, setFeedback] = useState(null);
  
  useEffect(() => {
    // Create tiles from translation words + distractors
    const correctWords = correctTranslation.split(' ');
    const distractors = ['the', 'and', 'but', 'that', 'from', 'with'].filter(
      d => !correctWords.includes(d)
    ).slice(0, 2);
    
    const allTiles = [...correctWords, ...distractors];
    // Shuffle tiles
    const shuffled = allTiles.sort(() => Math.random() - 0.5);
    setAvailableTiles(shuffled);
  }, [correctTranslation]);
  
  const handleTileClick = (tile, index) => {
    if (feedback) return; // Don't allow changes after submission
    
    setSelectedTiles([...selectedTiles, tile]);
    setAvailableTiles(availableTiles.filter((_, i) => i !== index));
  };
  
  const handleRemoveTile = (index) => {
    if (feedback) return;
    
    const removed = selectedTiles[index];
    setSelectedTiles(selectedTiles.filter((_, i) => i !== index));
    setAvailableTiles([...availableTiles, removed]);
  };
  
  const checkAnswer = () => {
    const isCorrect = selectedTiles.join(' ') === correctTranslation;
    setFeedback(isCorrect ? 'correct' : 'wrong');
    
    setTimeout(() => {
      onComplete(isCorrect, selectedTiles.join(' '));
    }, 1500);
  };
  
  const giveHint = () => {
    onHint && onHint();
    // Show first word of correct answer
    const firstWord = correctTranslation.split(' ')[0];
    if (!selectedTiles.includes(firstWord)) {
      const idx = availableTiles.indexOf(firstWord);
      if (idx >= 0) {
        handleTileClick(firstWord, idx);
      }
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Aramaic sentence */}
      <div className="text-center py-6">
        <ClickableAramaic text={sentence.aramaic} />
        {sentence.transliteration && (
          <p className="text-gray-500 dark:text-gray-400 mt-3 italic">
            {sentence.transliteration}
          </p>
        )}
      </div>
      
      {/* Selected tiles area */}
      <div className="min-h-[60px] bg-gray-100 dark:bg-gray-700 rounded-lg p-3 flex flex-wrap gap-2 justify-center">
        {selectedTiles.length === 0 ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">Tap tiles below to build your translation</p>
        ) : (
          selectedTiles.map((tile, idx) => (
            <button
              key={idx}
              onClick={() => handleRemoveTile(idx)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {tile}
            </button>
          ))
        )}
      </div>
      
      {/* Available tiles */}
      <div className="flex flex-wrap gap-2 justify-center">
        {availableTiles.map((tile, idx) => (
          <button
            key={idx}
            onClick={() => handleTileClick(tile, idx)}
            className="px-4 py-2 bg-white dark:bg-gray-600 border-2 border-gray-300 dark:border-gray-500 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors shadow-sm"
          >
            {tile}
          </button>
        ))}
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 justify-center pt-4">
        <button
          onClick={giveHint}
          className="px-6 py-3 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg font-medium transition-colors"
        >
          💡 Hint
        </button>
        <button
          onClick={checkAnswer}
          disabled={selectedTiles.length === 0}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          Check Answer
        </button>
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div className={`text-center p-4 rounded-lg ${
          feedback === 'correct' 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {feedback === 'correct' ? '✓ Correct!' : `✗ The correct answer was: "${correctTranslation}"`}
        </div>
      )}
    </div>
  );
}

// Free Type Mode Component
function FreeTypeMode({ sentence, correctTranslation, onComplete, onShowTiles }) {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [isGrading, setIsGrading] = useState(false);
  
  const handleSubmit = async () => {
    setIsGrading(true);
    
    // Simulate AI grading (in production, call Anthropic API)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const normalizedAnswer = answer.toLowerCase().trim();
    const normalizedCorrect = correctTranslation.toLowerCase().trim();
    
    let score = 0;
    let feedbackText = '';
    
    if (normalizedAnswer === normalizedCorrect) {
      score = 1;
      feedbackText = 'Perfect!';
    } else if (normalizedAnswer.includes(normalizedCorrect.split(' ')[0])) {
      score = 0.5;
      feedbackText = 'Partially correct - close!';
    } else {
      score = 0;
      feedbackText = `The correct answer was: "${correctTranslation}"`;
    }
    
    setFeedback({ score, text: feedbackText });
    setIsGrading(false);
    
    setTimeout(() => {
      onComplete(score >= 0.5, answer);
    }, 1500);
  };
  
  return (
    <div className="space-y-6">
      {/* Aramaic sentence */}
      <div className="text-center py-6">
        <ClickableAramaic text={sentence.aramaic} />
        {sentence.transliteration && (
          <p className="text-gray-500 dark:text-gray-400 mt-3 italic">
            {sentence.transliteration}
          </p>
        )}
      </div>
      
      {/* Text input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Type your translation:
        </label>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Enter the English translation..."
          className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
          rows={3}
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-3 justify-center pt-4">
        <button
          onClick={onShowTiles}
          className="px-6 py-3 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg font-medium transition-colors"
        >
          📝 Show Tiles (Hint)
        </button>
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || isGrading}
          className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
        >
          {isGrading ? 'Grading...' : 'Submit'}
        </button>
      </div>
      
      {/* Feedback */}
      {feedback && (
        <div className={`text-center p-4 rounded-lg ${
          feedback.score >= 0.5
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' 
            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
        }`}>
          {feedback.text}
        </div>
      )}
    </div>
  );
}

// Predict What's Next Mode Component
function PredictMode({ sentence, onComplete }) {
  const [prediction, setPrediction] = useState('');
  const [revealed, setRevealed] = useState(false);
  
  const handleReveal = () => {
    setRevealed(true);
  };
  
  const handleSubmit = () => {
    onComplete(true, prediction);
  };
  
  return (
    <div className="space-y-6">
      {/* Partial sentence */}
      <div className="text-center py-6">
        <ClickableAramaic text={sentence.aramaic} />
        <p className="text-blue-600 dark:text-blue-400 mt-4 font-medium">
          {sentence.prediction_hint}
        </p>
      </div>
      
      {!revealed ? (
        <div className="text-center">
          <button
            onClick={handleReveal}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Reveal Answer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Complete translation:</p>
            <p className="text-lg font-medium text-gray-900 dark:text-white">{sentence.translation}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              What would you expect to come next?
            </label>
            <textarea
              value={prediction}
              onChange={(e) => setPrediction(e.target.value)}
              placeholder="Type your prediction..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:bg-gray-700 dark:text-white transition-all"
              rows={3}
            />
          </div>
          
          <div className="text-center">
            <button
              onClick={handleSubmit}
              className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Session Screen Component
function SessionScreen({ onCompleteSession }) {
  const [session, setSession] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mode, setMode] = useState('tile'); // 'tile', 'free', 'predict'
  const [stats, setStats] = useState({ correct: 0, total: 0 });
  const [showWordPopup, setShowWordPopup] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);
  
  useEffect(() => {
    // Initialize session with sentences
    const initialSession = SENTENCES.slice(0, 10).map(s => ({
      type: 'sentence',
      sentence: s,
      mode: s.difficulty_tier <= 2 ? 'tile' : s.difficulty_tier <= 3 ? 'free' : 'predict'
    }));
    setSession(initialSession);
  }, []);
  
  const handleItemComplete = (correct, answer) => {
    setStats(prev => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1
    }));
    
    if (currentIndex < session.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Session complete
      onCompleteSession(stats);
    }
  };
  
  const handleWordClick = (wordText) => {
    // Find matching word in database
    const word = WORDS.find(w => w.aramaic === wordText || w.nikud === wordText);
    if (word) {
      setSelectedWord(word);
      setShowWordPopup(true);
    }
  };
  
  if (session.length === 0) {
    return <div className="p-8 text-center">Loading session...</div>;
  }
  
  const currentItem = session[currentIndex];
  const sentence = currentItem.sentence;
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Question {currentIndex + 1} of {session.length}</span>
          <span>{stats.correct}/{stats.total} correct</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-300"
            style={{ width: `${((currentIndex) / session.length) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Mode indicator */}
      <div className="text-center mb-4">
        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
          {currentItem.mode === 'tile' ? '🧩 Tile Mode' : currentItem.mode === 'free' ? '⌨️ Type Mode' : '🔮 Predict Mode'}
        </span>
      </div>
      
      {/* Main content based on mode */}
      {currentItem.mode === 'tile' && (
        <TileMode
          sentence={sentence}
          correctTranslation={sentence.translation}
          onComplete={handleItemComplete}
          onHint={() => {}}
        />
      )}
      
      {currentItem.mode === 'free' && (
        <FreeTypeMode
          sentence={sentence}
          correctTranslation={sentence.translation}
          onComplete={handleItemComplete}
          onShowTiles={() => setMode('tile')}
        />
      )}
      
      {currentItem.mode === 'predict' && (
        <PredictMode
          sentence={sentence}
          onComplete={handleItemComplete}
        />
      )}
      
      {/* Word popup */}
      {showWordPopup && selectedWord && (
        <WordPopup
          word={selectedWord}
          onClose={() => setShowWordPopup(false)}
          onAddToReview={() => setShowWordPopup(false)}
        />
      )}
    </div>
  );
}

// Word Library Screen
function WordLibrary() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState(null);
  
  const filteredWords = WORDS.filter(word => {
    const matchesSearch = word.aramaic.includes(searchTerm) || 
                         word.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.definition_primary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier ? word.tier === selectedTier : true;
    return matchesSearch && matchesTier;
  });
  
  const tierCounts = {
    1: WORDS.filter(w => w.tier === 1).length,
    2: WORDS.filter(w => w.tier === 2).length,
    3: WORDS.filter(w => w.tier === 3).length
  };
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Word Library</h1>
      
      {/* Stats overview */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{WORDS.length}</p>
          <p className="text-sm opacity-90">Total Words</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{tierCounts[1]}</p>
          <p className="text-sm opacity-90">Tier 1</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-4 text-center">
          <p className="text-3xl font-bold">{tierCounts[2] + tierCounts[3]}</p>
          <p className="text-sm opacity-90">Tiers 2-3</p>
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search words..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <select
          value={selectedTier || ''}
          onChange={(e) => setSelectedTier(e.target.value ? parseInt(e.target.value) : null)}
          className="px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:bg-gray-700 dark:text-white"
        >
          <option value="">All Tiers</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </select>
      </div>
      
      {/* Word list */}
      <div className="space-y-2">
        {filteredWords.map(word => (
          <div
            key={word.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="aramaic-text text-xl font-bold text-gray-900 dark:text-white">{word.nikud || word.aramaic}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">{word.transliteration}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{word.definition_primary}</p>
            </div>
            <div className="text-right">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded text-xs font-medium">
                Tier {word.tier}
              </span>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">#{word.frequency_rank}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Habit Tracker / Dashboard Screen
function Dashboard() {
  const today = new Date();
  const streak = 5; // Mock data
  const wordsKnown = 23; // Mock data
  const sentencesCompleted = 47; // Mock data
  
  // Generate last 7 days for heatmap
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return {
      date,
      active: Math.random() > 0.3 // Mock activity
    };
  });
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Your Progress</h1>
      
      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{streak}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-green-600">{wordsKnown}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Words Known</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-purple-600">{sentencesCompleted}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Sentences</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-orange-600">12</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Due Today</p>
        </div>
      </div>
      
      {/* Activity heatmap */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h2>
        <div className="flex gap-2">
          {last7Days.map((day, idx) => (
            <div key={idx} className="flex-1 text-center">
              <div className={`aspect-square rounded-lg mb-2 ${
                day.active 
                  ? 'bg-green-500' 
                  : 'bg-gray-200 dark:bg-gray-700'
              }`} />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {day.date.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Motivational message */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <p className="text-lg font-medium">
          🎉 Great work! You've learned {wordsKnown} words so far. Keep going - you're {Math.round((wordsKnown / 300) * 100)}% of the way to mastering the core Talmudic vocabulary!
        </p>
      </div>
    </div>
  );
}

// Home Screen with Start Session
function HomeScreen({ onStartSession }) {
  const dueCount = 12; // Mock data
  
  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="py-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Jewoulingo</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Learn Talmudic Aramaic, One Sentence at a Time</p>
      </div>
      
      {/* Main CTA */}
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 text-white mb-8 shadow-lg">
        <p className="text-2xl font-bold mb-2">{dueCount} Items Due</p>
        <p className="text-green-100 mb-6">You have {dueCount} words and sentences to review</p>
        <button
          onClick={onStartSession}
          className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-colors shadow-md"
        >
          Start Session →
        </button>
      </div>
      
      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/library"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <Library className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="font-medium text-gray-900 dark:text-white">Word Library</p>
        </Link>
        <Link
          to="/dashboard"
          className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
        >
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-600" />
          <p className="font-medium text-gray-900 dark:text-white">Progress</p>
        </Link>
      </div>
    </div>
  );
}

// Navigation Component
function Navigation() {
  const location = useLocation();
  
  const isActive = (path) => location.pathname === path;
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 md:relative md:border-t-0 md:border-r md:w-64 md:h-screen">
      <div className="flex md:flex-col justify-around md:justify-start md:p-4">
        <Link
          to="/"
          className={`flex flex-col items-center p-3 md:flex-row md:gap-3 md:rounded-lg transition-colors ${
            isActive('/') 
              ? 'text-blue-600 md:bg-blue-50 dark:md:bg-blue-900/20' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs md:text-sm mt-1 md:mt-0">Home</span>
        </Link>
        <Link
          to="/library"
          className={`flex flex-col items-center p-3 md:flex-row md:gap-3 md:rounded-lg transition-colors ${
            isActive('/library') 
              ? 'text-blue-600 md:bg-blue-50 dark:md:bg-blue-900/20' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Library className="w-6 h-6" />
          <span className="text-xs md:text-sm mt-1 md:mt-0">Words</span>
        </Link>
        <Link
          to="/dashboard"
          className={`flex flex-col items-center p-3 md:flex-row md:gap-3 md:rounded-lg transition-colors ${
            isActive('/dashboard') 
              ? 'text-blue-600 md:bg-blue-50 dark:md:bg-blue-900/20' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <BarChart3 className="w-6 h-6" />
          <span className="text-xs md:text-sm mt-1 md:mt-0">Progress</span>
        </Link>
        <Link
          to="/settings"
          className={`flex flex-col items-center p-3 md:flex-row md:gap-3 md:rounded-lg transition-colors ${
            isActive('/settings') 
              ? 'text-blue-600 md:bg-blue-50 dark:md:bg-blue-900/20' 
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
          }`}
        >
          <Settings className="w-6 h-6" />
          <span className="text-xs md:text-sm mt-1 md:mt-0">Settings</span>
        </Link>
      </div>
    </nav>
  );
}

// Settings Screen
function Settings() {
  const [nikudEnabled, setNikudEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Settings</h1>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Show Vowels (Nikud)</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Display vowel marks on Aramaic text</p>
          </div>
          <button
            onClick={() => setNikudEnabled(!nikudEnabled)}
            className={`w-12 h-6 rounded-full transition-colors ${
              nikudEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              nikudEnabled ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
        
        <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div>
            <p className="font-medium text-gray-900 dark:text-white">Dark Mode</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme</p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-12 h-6 rounded-full transition-colors ${
              darkMode ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${
              darkMode ? 'translate-x-6' : 'translate-x-0.5'
            }`} />
          </button>
        </div>
      </div>
    </div>
  );
}

// Session Complete Screen
function SessionComplete({ stats, onContinue }) {
  return (
    <div className="max-w-2xl mx-auto p-4 text-center">
      <div className="py-8">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Session Complete!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">Great work on your practice today</p>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-green-600">{stats.correct}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
          <p className="text-3xl font-bold text-purple-600">
            {stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0}%
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accuracy</p>
        </div>
      </div>
      
      <button
        onClick={onContinue}
        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-colors shadow-md"
      >
        Continue
      </button>
    </div>
  );
}

// Main App Component
function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [sessionStats, setSessionStats] = useState(null);
  const [inSession, setInSession] = useState(false);
  
  const handleStartSession = () => {
    setInSession(true);
  };
  
  const handleCompleteSession = (stats) => {
    setSessionStats(stats);
    setInSession(false);
  };
  
  const handleContinue = () => {
    setSessionStats(null);
    setCurrentScreen('home');
  };
  
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
        <Navigation />
        
        <main className="flex-1 pb-20 md:pb-0">
          <Routes>
            <Route path="/" element={
              inSession ? (
                <SessionScreen onCompleteSession={handleCompleteSession} />
              ) : sessionStats ? (
                <SessionComplete stats={sessionStats} onContinue={handleContinue} />
              ) : (
                <HomeScreen onStartSession={handleStartSession} />
              )
            } />
            <Route path="/library" element={<WordLibrary />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
