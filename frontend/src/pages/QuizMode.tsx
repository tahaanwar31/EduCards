import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Clock, CheckCircle2, XCircle, Trophy, RotateCcw, Target, Zap, Sparkles, WifiOff } from 'lucide-react';
import { fetchFlashcards, generateQuiz } from '../lib/api';
import { motion, AnimatePresence } from 'motion/react';

interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function QuizMode() {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizDone, setQuizDone] = useState(false);
  const [error, setError] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [aiPowered, setAiPowered] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (topicId) loadQuiz();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [topicId]);

  useEffect(() => {
    if (loading || quizDone || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setQuizDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [loading, quizDone, questions.length]);

  async function loadQuiz() {
    try {
      setLoading(true);
      const data = await fetchFlashcards(topicId!);
      if (data.length < 2) {
        setError('You need at least 2 flashcards to take a quiz. Go back and add more flashcards first.');
        setLoading(false);
        return;
      }
      const result = await generateQuiz(data);
      setQuestions(result.questions);
      setAiPowered(result.aiPowered);
      setAnswers(new Array(result.questions.length).fill(null));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleAnswer(optionIndex: number) {
    if (quizDone || showFeedback) return;
    setSelectedOption(optionIndex);
    setShowFeedback(true);

    const newAnswers = [...answers];
    newAnswers[currentQ] = optionIndex;
    setAnswers(newAnswers);

    setTimeout(() => {
      if (currentQ < questions.length - 1) {
        setCurrentQ((c) => c + 1);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setQuizDone(true);
        if (timerRef.current) clearInterval(timerRef.current);
      }
    }, 1000);
  }

  function restartQuiz() {
    setQuizDone(false);
    setCurrentQ(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeLeft(60);
    setError('');
    loadQuiz();
  }

  const score = answers.reduce((acc: number, ans, i) => {
    if (ans !== null && ans === questions[i]?.correctIndex) return acc + 1;
    return acc;
  }, 0);

  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  // Loading
  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="w-12 h-12 border-4 border-red-600/30 border-t-red-600 rounded-full animate-spin"></div>
        <p className="text-white/50 font-medium animate-pulse">Generating your quiz...</p>
      </div>
    );

  // Error
  if (error) {
    const isAiUnavailable = error.includes('unavailable');
    return (
      <div className="max-w-2xl mx-auto space-y-8 py-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto ${
            isAiUnavailable ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-red-500/10'
          }`}>
            {isAiUnavailable ? (
              <WifiOff className="w-11 h-11 text-yellow-400" />
            ) : (
              <XCircle className="w-11 h-11 text-red-400" />
            )}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {isAiUnavailable ? 'Quiz Unavailable' : 'Something went wrong'}
            </h2>
            <p className="text-white/40 max-w-sm mx-auto leading-relaxed">
              {isAiUnavailable
                ? 'The AI service is temporarily down. Quizzes require AI to generate intelligent answer options. Please try again later.'
                : error}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-semibold transition-all active:scale-[0.97]"
            >
              <ArrowLeft className="w-5 h-5" /> Go Back
            </button>
            {isAiUnavailable && (
              <button
                onClick={restartQuiz}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 rounded-2xl font-semibold shadow-lg shadow-red-600/20 transition-all active:scale-[0.97]"
              >
                <RotateCcw className="w-5 h-5" /> Retry
              </button>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // Results
  if (quizDone)
    return (
      <div className="max-w-2xl mx-auto space-y-10 py-8">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
            className="relative inline-block"
          >
            <div
              className={`w-36 h-36 mx-auto rounded-full flex items-center justify-center ${
                percentage >= 70 ? 'bg-green-500/20 shadow-[0_0_60px_-15px_rgba(34,197,94,0.4)]' : percentage >= 40 ? 'bg-yellow-500/20 shadow-[0_0_60px_-15px_rgba(234,179,8,0.4)]' : 'bg-red-500/20 shadow-[0_0_60px_-15px_rgba(239,68,68,0.4)]'
              }`}
            >
              <Trophy
                className={`w-16 h-16 ${percentage >= 70 ? 'text-green-400' : percentage >= 40 ? 'text-yellow-400' : 'text-red-400'}`}
              />
            </div>
          </motion.div>

          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-6xl font-extrabold text-white mb-3"
            >
              {percentage}%
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-xl text-white/60">
              You scored <span className="text-white font-bold">{score}</span> out of{' '}
              <span className="text-white font-bold">{questions.length}</span>
            </motion.p>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-white/40 mt-2 text-lg">
              {percentage >= 80
                ? 'Outstanding! You really know your stuff!'
                : percentage >= 60
                ? 'Great job! Keep reviewing to improve.'
                : percentage >= 40
                ? 'Good effort! A bit more practice will help.'
                : "Don't give up! Review your flashcards and try again."}
            </motion.p>
            {timeLeft === 0 && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-red-500 text-sm mt-3 font-medium">
                Time ran out!
              </motion.p>
            )}
          </div>

          {/* Answers breakdown */}
          <div className="space-y-3 text-left">
            <h3 className="text-lg font-bold text-white/80 mb-4">Answer Breakdown</h3>
            {questions.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correctIndex;
              const wasAnswered = userAnswer !== null;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.05 }}
                  className={`p-4 rounded-2xl border ${
                    !wasAnswered
                      ? 'bg-white/5 border-white/10'
                      : isCorrect
                      ? 'bg-green-500/5 border-green-500/20'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {!wasAnswered ? (
                      <Clock className="w-5 h-5 text-white/30 mt-0.5 shrink-0" />
                    ) : isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 shrink-0" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-400 mt-0.5 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white/80 font-medium text-sm">{q.question}</p>
                      {wasAnswered && !isCorrect && (
                        <p className="text-green-400/80 text-xs mt-1.5">
                          Correct answer: {q.options[q.correctIndex]}
                        </p>
                      )}
                      {!wasAnswered && <p className="text-white/30 text-xs mt-1.5">Not answered (time ran out)</p>}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex justify-center gap-4 pt-6">
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5 inline mr-2" /> Back to Cards
            </button>
            <button
              onClick={restartQuiz}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:opacity-90 rounded-2xl font-bold shadow-lg shadow-red-600/20 transition-all active:scale-95"
            >
              <RotateCcw className="w-5 h-5 inline mr-2" /> Try Again
            </button>
          </div>
        </motion.div>
      </div>
    );

  // Quiz UI
  const q = questions[currentQ];
  const timerPercent = (timeLeft / 60) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2.5 hover:bg-white/10 rounded-xl transition-colors text-white/60 hover:text-white"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-red-500" />
              <span className="text-sm font-bold text-white/60">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
                <Sparkles className="w-3 h-3" /> AI Powered
              </span>
            </div>
            <div
              className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold ${
                timeLeft <= 10
                  ? 'bg-red-500/20 text-red-400 animate-pulse'
                  : timeLeft <= 30
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-white/10 text-white/80'
              }`}
            >
              <Clock className="w-4 h-4" />
              {timeLeft}s
            </div>
          </div>
          {/* Timer bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full transition-colors ${
                timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 30 ? 'bg-yellow-500' : 'bg-gradient-to-r from-red-600 to-red-800'
              }`}
              initial={false}
              animate={{ width: `${timerPercent}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="p-8 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Question</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed">{q.question}</h2>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 gap-3">
            {q.options.map((option, i) => {
              let optionStyle = 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20';

              if (showFeedback) {
                if (i === q.correctIndex) {
                  optionStyle = 'bg-green-500/15 border-green-500/40';
                } else if (i === selectedOption && i !== q.correctIndex) {
                  optionStyle = 'bg-red-500/15 border-red-500/40';
                } else {
                  optionStyle = 'bg-white/[0.02] border-white/5 opacity-40';
                }
              }

              return (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => handleAnswer(i)}
                  disabled={showFeedback}
                  className={`w-full text-left p-5 border rounded-2xl font-medium transition-all ${optionStyle} ${
                    !showFeedback ? 'active:scale-[0.98] cursor-pointer' : 'cursor-default'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
                        showFeedback && i === q.correctIndex
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : showFeedback && i === selectedOption && i !== q.correctIndex
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-white/5 text-white/50 border border-white/10'
                      }`}
                    >
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="text-white/90 flex-1">{option}</span>
                    {showFeedback && i === q.correctIndex && <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />}
                    {showFeedback && i === selectedOption && i !== q.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex justify-center gap-2 pt-4">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              i === currentQ
                ? 'bg-red-500 scale-125 shadow-[0_0_8px_rgba(220,38,38,0.5)]'
                : answers[i] !== null
                ? answers[i] === questions[i].correctIndex
                  ? 'bg-green-500'
                  : 'bg-red-500'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
