export interface Topic {
  id: string;
  title: string;
  xp: number;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  topics: Topic[];
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

export type QuizType = 'multiple-choice' | 'true-false' | 'code-completion' | 'matching';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  codeSnippet?: string;
  points: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LessonContent {
  title: string;
  content: string; // Markdown content
  quizzes: QuizQuestion[];
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  text: string;
  sources: GroundingSource[];
}