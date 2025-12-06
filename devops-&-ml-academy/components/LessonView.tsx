import React, { useEffect, useState } from 'react';
import { generateLessonContent } from '../services/geminiService';
import { Chapter, Topic, LessonContent, QuizQuestion, QuizType } from '../types';
import { Loader2, CheckCircle, Award, ChevronRight, Circle, X, BookOpen, Target, Lightbulb, Code, AlertTriangle, Clock, Check, Zap, Star } from './Icons';
import ReactMarkdown from 'react-markdown';

interface LessonViewProps {
  chapter: Chapter;
  topic: Topic;
  onComplete: (topicId: string) => void;
  isCompleted: boolean;
}

const STORAGE_PREFIX = 'devops_academy_lesson_';

const LessonSkeleton = () => (
  <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
    <div className="border-b border-gray-200 pb-6">
      <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      <div className="h-40 bg-gray-200 rounded w-full mt-6"></div>
      <div className="h-4 bg-gray-200 rounded w-full"></div>
      <div className="h-4 bg-gray-200 rounded w-4/5"></div>
    </div>
  </div>
);

const LessonView: React.FC<LessonViewProps> = ({ chapter, topic, onComplete, isCompleted }) => {
  const [data, setData] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Quiz State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]); // Stores index of selected answer per question
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [totalPossiblePoints, setTotalPossiblePoints] = useState(0);
  const [questionResults, setQuestionResults] = useState<boolean[]>([]);

  // Load Content (Cache First, then API)
  useEffect(() => {
    const loadContent = async () => {
      // Reset State
      setError(null);
      setCurrentQuestionIndex(0);
      setSelectedAnswers([]);
      setShowExplanation(false);
      setQuizCompleted(false);
      setScore(0);
      setTotalPossiblePoints(0);
      setQuestionResults([]);
      
      const cacheKey = `${STORAGE_PREFIX}${topic.id}`;
      const cachedData = localStorage.getItem(cacheKey);

      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          setData(parsedData);
          setTotalPossiblePoints(parsedData.quizzes.reduce((total: number, q: QuizQuestion) => total + q.points, 0));
          setLoading(false);
          return;
        } catch (e) {
          console.error("Cache parsing error", e);
          localStorage.removeItem(cacheKey);
        }
      }

      // Fetch from API if no cache
      setLoading(true);
      setData(null);
      
      try {
        const content = await generateLessonContent(chapter.title, topic.title);
        setData(content);
        setTotalPossiblePoints(content.quizzes.reduce((total: number, q: QuizQuestion) => total + q.points, 0));
        localStorage.setItem(cacheKey, JSON.stringify(content));
      } catch (err) {
        setError('Failed to load lesson content. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, [topic.id, chapter.title, topic.title]);

  const handleOptionSelect = (optionIndex: number) => {
    if (showExplanation || quizCompleted) return;
    
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleCheckAnswer = () => {
    if (!data) return;
    setShowExplanation(true);

    const currentQ = data.quizzes[currentQuestionIndex];
    const userAns = selectedAnswers[currentQuestionIndex];
    const isCorrect = userAns === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + currentQ.points);
    }

    setQuestionResults(prev => [...prev, isCorrect]);
  };

  const handleNextQuestion = () => {
    if (!data) return;
    
    if (currentQuestionIndex < data.quizzes.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      // Mark as complete if score passes a threshold (e.g., > 0 for now to encourage engagement)
      onComplete(topic.id);
    }
  };

  if (loading) return <LessonSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500 bg-red-50 rounded-xl border border-red-100 p-8">
        <p className="font-semibold text-lg mb-2">Oops!</p>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-6 px-6 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data) return null;

  const currentQuiz: QuizQuestion = data.quizzes[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === data.quizzes.length - 1;
  const hasSelected = selectedAnswers[currentQuestionIndex] !== undefined;

  const getQuizTypeIcon = (type: QuizType) => {
    switch (type) {
      case 'multiple-choice': return '📝';
      case 'true-false': return '✓✗';
      case 'code-completion': return '💻';
      case 'matching': return '🔗';
      default: return '❓';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 rounded-2xl border border-indigo-100 p-8 shadow-sm">
        <div className="flex items-center gap-2 text-sm text-indigo-600 font-semibold mb-3 uppercase tracking-wide">
          <BookOpen className="w-4 h-4" />
          <span>Capítulo {chapter.number}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-bold">{topic.xp} XP</span>
        </div>
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight leading-tight mb-4">{data.title || topic.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Objetivo: Dominar {topic.title}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-green-500" />
            <span>~15 min de lectura</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <article className="prose prose-xl prose-slate max-w-none text-gray-700 leading-relaxed">
        <ReactMarkdown
          components={{
            h1: ({children, ...props}) => (
              <h1 className="text-3xl font-bold text-gray-900 mt-12 mb-6 first:mt-0 flex items-center gap-2" {...props}>
                <Lightbulb className="w-6 h-6 text-yellow-500" />
                {children}
              </h1>
            ),
            h2: ({children, ...props}) => (
              <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-2" {...props}>
                <Target className="w-5 h-5 text-indigo-500" />
                {children}
              </h2>
            ),
            h3: ({children, ...props}) => (
              <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-3" {...props} />
            ),
            code({node, className, children, ...props}) {
               return (
                 <code className={`${className} bg-slate-100 text-pink-600 rounded px-2 py-1 text-sm font-mono border`} {...props}>
                   {children}
                 </code>
               )
            },
            pre({node, children, ...props}) {
              return (
                <div className="relative my-8">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <pre className="bg-slate-900 text-slate-100 p-6 pt-12 rounded-xl overflow-x-auto shadow-xl border border-slate-700" {...props}>
                    {children}
                  </pre>
                </div>
              )
            },
            blockquote: ({children, ...props}) => (
              <blockquote className="border-l-4 border-indigo-500 bg-indigo-50 pl-6 py-4 my-6 rounded-r-lg italic text-indigo-900" {...props}>
                <div className="flex gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span className="font-semibold text-indigo-800 uppercase text-sm tracking-wide">Nota Importante</span>
                </div>
                {children}
              </blockquote>
            ),
            ul: ({children, ...props}) => (
              <ul className="space-y-2 my-6" {...props}>
                {children}
              </ul>
            ),
            li: ({children, ...props}) => (
              <li className="flex items-start gap-3" {...props}>
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-3 flex-shrink-0"></div>
                <span>{children}</span>
              </li>
            )
          }}
        >
          {data.content}
        </ReactMarkdown>
      </article>

      {/* Quiz Section */}
      <div className="mt-16 bg-gradient-to-br from-slate-50 to-indigo-50 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden ring-1 ring-slate-300/50">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                  <Award className="w-7 h-7 text-yellow-300" />
                </div>
                Verificación de Conocimientos
              </h2>
              <div className="text-right">
                <span className="bg-white/20 px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border border-white/30">
                  Pregunta {currentQuestionIndex + 1} de {data.quizzes.length}
                </span>
                <div className="text-xs text-indigo-100 mt-1">Progreso de la lección</div>
              </div>
            </div>
            <div className="w-full bg-black/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-700 ease-out shadow-lg"
                style={{ width: `${((currentQuestionIndex + (quizCompleted ? 1 : 0)) / data.quizzes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <div className="p-8">
          {!quizCompleted ? (
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-2xl">{getQuizTypeIcon(currentQuiz.type)}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getDifficultyColor(currentQuiz.difficulty)}`}>
                        {currentQuiz.difficulty.toUpperCase()}
                      </span>
                      <span className="text-sm font-semibold text-indigo-600">
                        {currentQuiz.points} puntos
                      </span>
                    </div>
                    <p className="text-xl font-semibold text-gray-900 leading-relaxed">{currentQuiz.question}</p>
                  </div>
                </div>

                {currentQuiz.codeSnippet && (
                  <div className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto shadow-lg border border-slate-700 mt-4">
                    <pre className="text-sm font-mono">{currentQuiz.codeSnippet}</pre>
                  </div>
                )}

                <div className="text-sm text-gray-600 font-medium mt-3">
                  {currentQuiz.type === 'true-false' ? 'Verdadero o Falso' : 'Selecciona la respuesta correcta'}
                </div>
              </div>

              <div className="space-y-4">
                {currentQuiz.options.map((option, idx) => {
                  let btnClass = "w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 flex justify-between items-center group relative overflow-hidden ";
                  const isSelected = selectedAnswers[currentQuestionIndex] === idx;

                  if (showExplanation) {
                    if (idx === currentQuiz.correctIndex) {
                      btnClass += "border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 text-green-900 ring-2 ring-green-500 shadow-lg transform scale-[1.02]";
                    } else if (isSelected) {
                      btnClass += "border-red-500 bg-gradient-to-r from-red-50 to-pink-50 text-red-900 shadow-md";
                    } else {
                      btnClass += "border-gray-100 text-gray-400 opacity-50 bg-gray-50";
                    }
                  } else {
                    if (isSelected) {
                      btnClass += "border-indigo-600 bg-gradient-to-r from-indigo-50 to-blue-50 text-indigo-900 shadow-xl transform scale-[1.02] ring-2 ring-indigo-200";
                    } else {
                      btnClass += "border-gray-200 hover:border-indigo-300 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-blue-50 text-gray-700 hover:shadow-lg hover:transform hover:scale-[1.01] bg-white";
                    }
                  }

                  const optionLabels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(idx)}
                      disabled={showExplanation}
                      className={btnClass}
                    >
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                          showExplanation
                            ? (idx === currentQuiz.correctIndex
                                ? 'bg-green-600 text-white'
                                : isSelected
                                  ? 'bg-red-600 text-white'
                                  : 'bg-gray-300 text-gray-500')
                            : (isSelected
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-600 group-hover:bg-indigo-100 group-hover:text-indigo-700')
                        }`}>
                          {optionLabels[idx]}
                        </div>
                        <span className="font-medium text-left">{option}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {showExplanation && idx === currentQuiz.correctIndex && (
                          <>
                            <CheckCircle className="w-6 h-6 text-green-600" />
                            <span className="text-green-700 font-semibold text-sm">Correcto</span>
                          </>
                        )}
                        {showExplanation && isSelected && idx !== currentQuiz.correctIndex && (
                          <>
                            <X className="w-6 h-6 text-red-600" />
                            <span className="text-red-700 font-semibold text-sm">Incorrecto</span>
                          </>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation Box */}
              {showExplanation && (
                 <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl text-blue-900 shadow-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-sm uppercase tracking-wide text-blue-600 mb-1">Explicación Detallada</p>
                        <p className="text-blue-800 leading-relaxed">{currentQuiz.explanation}</p>
                      </div>
                    </div>
                 </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-center pt-8 mt-6 border-t border-slate-200">
                {!showExplanation ? (
                  <button
                    onClick={handleCheckAnswer}
                    disabled={!hasSelected}
                    className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-300 hover:shadow-2xl hover:shadow-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all transform active:scale-95 text-lg"
                  >
                    Verificar Respuesta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl hover:from-slate-900 hover:to-black transition-all transform active:scale-95 text-lg"
                  >
                    {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
               <div className="relative mb-8">
                 <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                   <Award className="w-16 h-16" />
                 </div>
                 <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                   <span className="text-2xl">⭐</span>
                 </div>
               </div>

               <h3 className="text-4xl font-bold text-gray-900 mb-4">¡Lección Completada!</h3>

               <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-8 max-w-md mx-auto">
                 <div className="text-3xl font-bold text-indigo-600 mb-2">
                   {score}/{totalPossiblePoints}
                 </div>
                 <div className="text-gray-600 mb-4">Puntos obtenidos</div>
                 <div className="w-full bg-gray-200 rounded-full h-3">
                   <div
                     className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full transition-all duration-1000"
                     style={{ width: `${(score / totalPossiblePoints) * 100}%` }}
                   ></div>
                 </div>
                 <div className="text-sm text-gray-500 mt-2">
                   {Math.round((score / totalPossiblePoints) * 100)}% de puntuación
                 </div>
                 <div className="text-xs text-gray-400 mt-1">
                   {questionResults.filter(Boolean).length} de {data.quizzes.length} preguntas correctas
                 </div>
               </div>

               {score === data.quizzes.length ? (
                 <div className="mb-8">
                   <p className="text-emerald-600 font-bold text-xl mb-2">¡Puntuación perfecta! 🎉</p>
                   <p className="text-gray-600">Has dominado completamente este tema.</p>
                 </div>
               ) : score >= data.quizzes.length * 0.7 ? (
                 <div className="mb-8">
                   <p className="text-blue-600 font-bold text-xl mb-2">¡Excelente trabajo! 👏</p>
                   <p className="text-gray-600">Has comprendido muy bien el contenido.</p>
                 </div>
               ) : (
                 <div className="mb-8">
                   <p className="text-orange-600 font-bold text-xl mb-2">Buen esfuerzo 📚</p>
                   <p className="text-gray-600">Revisa el contenido para obtener una puntuación perfecta la próxima vez.</p>
                 </div>
               )}

               <div className="flex gap-4 justify-center">
                 <button
                   onClick={() => window.location.reload()}
                   className="px-6 py-3 bg-slate-600 text-white rounded-xl font-semibold shadow-lg hover:bg-slate-700 transition-all"
                 >
                   Repasar Lección
                 </button>
                 <button
                   onClick={() => onComplete(topic.id)}
                   className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                 >
                   Continuar Aprendiendo →
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonView;