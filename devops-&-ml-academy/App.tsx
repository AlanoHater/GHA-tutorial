import React, { useState } from 'react';
import { CURRICULUM } from './constants';
import { Chapter, Topic } from './types';
import {
  BookOpen,
  CheckCircle,
  Circle,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  Award,
  Moon,
  Sun,
  Zap
} from './components/Icons';
import LessonView from './components/LessonView';
import ChatInterface from './components/ChatInterface';
import SearchAssistant from './components/SearchAssistant';

const App: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<Topic>(CURRICULUM[0].topics[0]);
  const [activeChapter, setActiveChapter] = useState<Chapter>(CURRICULUM[0]);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set(['ch2']));
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'learn' | 'research'>('learn');
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleTopicSelect = (chapter: Chapter, topic: Topic) => {
    setActiveChapter(chapter);
    setActiveTopic(topic);
    setViewMode('learn');
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const handleTopicComplete = (topicId: string) => {
    setCompletedTopics(prev => new Set(prev).add(topicId));
  };

  const totalXp = Array.from(completedTopics).reduce((acc: number, topicId) => {
    const topic = CURRICULUM.flatMap(c => c.topics).find(t => t.id === topicId);
    return acc + (topic ? topic.xp : 0);
  }, 0);

  const calculateProgress = (chapter: Chapter) => {
    const chapterTopics = chapter.topics;
    const completedInChapter = chapterTopics.filter(t => completedTopics.has(t.id));
    return Math.round((completedInChapter.length / chapterTopics.length) * 100);
  };

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300 ${isDarkMode ? 'bg-slate-900' : 'bg-gray-50'}`}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && window.innerWidth < 1024 && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-80 border-r transform transition-all duration-300 ease-in-out flex flex-col ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}
      >
        <div className={`h-16 flex items-center px-6 border-b transition-colors duration-300 ${
          isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-gray-200 bg-white'
        }`}>
          <div className="flex items-center gap-2 font-bold text-xl text-indigo-700">
            <BookOpen className="w-6 h-6" />
            <span>DevOps Academy</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-slate-700 text-yellow-300 hover:bg-slate-600'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              title={isDarkMode ? 'Modo claro' : 'Modo oscuro'}
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className={`lg:hidden transition-colors duration-200 ${
                isDarkMode ? 'text-slate-400 hover:text-slate-300' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto p-4 space-y-2 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          {/* Global User XP Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-4 text-white shadow-md mb-6 animate-pulse">
            <div className="flex justify-between items-start mb-2">
              <span className="text-indigo-100 text-sm font-medium">Progreso Total</span>
              <Award className="w-5 h-5 text-yellow-300 animate-bounce" />
            </div>
            <div className="text-3xl font-bold mb-1">{totalXp} XP</div>
            <div className="text-xs text-indigo-200">¡Mantén el impulso!</div>
          </div>
          
          <div className="mb-2">
            <h3 className={`text-xs font-semibold uppercase tracking-wider px-2 mb-2 transition-colors duration-300 ${
              isDarkMode ? 'text-slate-400' : 'text-gray-400'
            }`}>Material del Curso</h3>
            <button
               onClick={() => setViewMode('research')}
               className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-200 hover:scale-105 ${
                 viewMode === 'research'
                 ? (isDarkMode ? 'bg-blue-900/50 text-blue-300' : 'bg-blue-50 text-blue-700')
                 : (isDarkMode ? 'text-slate-300 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100')
               }`}
            >
               <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
               Centro de Investigación
            </button>
          </div>

          {CURRICULUM.map((chapter) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const progress = calculateProgress(chapter);
            
            return (
              <div key={chapter.id} className="mb-4">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className={`w-full flex items-center justify-between px-2 py-2 text-left rounded-lg transition-all duration-200 group hover:scale-[1.02] ${
                    isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <span className={`font-semibold text-sm transition-colors duration-200 ${
                      isDarkMode ? 'text-slate-200' : 'text-gray-800'
                    }`}>Capítulo {chapter.number}</span>
                    <span className={`text-xs transition-colors duration-200 ${
                      isDarkMode ? 'text-slate-400' : 'text-gray-500'
                    }`}>{chapter.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-medium transition-colors duration-200 ${
                      isDarkMode ? 'text-slate-500' : 'text-gray-400'
                    }`}>{progress}%</span>
                    {isExpanded ?
                      <ChevronDown className={`w-4 h-4 transition-colors duration-200 ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-400'
                      }`} /> :
                      <ChevronRight className={`w-4 h-4 transition-colors duration-200 ${
                        isDarkMode ? 'text-slate-400' : 'text-gray-400'
                      }`} />
                    }
                  </div>
                </button>

                {isExpanded && (
                  <div className="mt-2 space-y-1 ml-2 border-l-2 border-gray-100 pl-2">
                    {chapter.topics.map((topic) => {
                      const isCompleted = completedTopics.has(topic.id);
                      const isActive = activeTopic.id === topic.id && viewMode === 'learn';
                      
                      return (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicSelect(chapter, topic)}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 hover:scale-[1.01] ${
                            isActive
                              ? (isDarkMode
                                  ? 'bg-indigo-900/50 text-indigo-300 font-medium border border-indigo-700'
                                  : 'bg-indigo-50 text-indigo-700 font-medium border border-indigo-100')
                              : (isDarkMode
                                  ? 'text-slate-300 hover:bg-slate-700 hover:text-slate-100'
                                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-4 h-4 text-green-500 shrink-0 animate-pulse" />
                          ) : (
                            <Circle className={`w-4 h-4 shrink-0 transition-colors duration-200 ${
                              isActive
                                ? 'text-indigo-500'
                                : (isDarkMode ? 'text-slate-500' : 'text-gray-300')
                            }`} />
                          )}
                          <span className="truncate text-left">{topic.title}</span>
                          <span className={`ml-auto text-xs transition-colors duration-200 ${
                            isActive
                              ? 'text-indigo-400'
                              : (isDarkMode ? 'text-slate-500' : 'text-gray-300')
                          }`}>{topic.xp} XP</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Bar (Mobile Only) */}
        <div className={`lg:hidden h-16 border-b flex items-center px-4 justify-between shrink-0 transition-colors duration-300 ${
          isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className={`p-2 -ml-2 rounded-md transition-colors duration-200 ${
                isDarkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className={`font-semibold truncate transition-colors duration-200 ${
              isDarkMode ? 'text-slate-200' : 'text-gray-800'
            }`}>
               {viewMode === 'learn' ? activeChapter.title : 'Centro de Investigación'}
            </span>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-12 scroll-smooth">
          {viewMode === 'research' ? (
             <SearchAssistant />
          ) : (
             <LessonView 
               chapter={activeChapter}
               topic={activeTopic}
               onComplete={handleTopicComplete}
               isCompleted={completedTopics.has(activeTopic.id)}
             />
          )}
        </div>
      </main>

      {/* Chatbot Overlay */}
      <ChatInterface 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(!isChatOpen)} 
      />
    </div>
  );
};

export default App;