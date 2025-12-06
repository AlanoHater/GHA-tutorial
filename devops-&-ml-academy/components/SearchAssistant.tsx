import React, { useState } from 'react';
import { performGroundedSearch } from '../services/geminiService';
import { SearchResult } from '../types';
import { Search, Loader2, Globe, ChevronRight } from './Icons';
import ReactMarkdown from 'react-markdown';

const SearchAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);
    const data = await performGroundedSearch(query);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 p-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
          <Globe className="w-5 h-5 text-blue-400" />
          Research Assistant
        </h2>
        <p className="text-slate-300 text-sm mb-4">
          Ask complex questions about GitHub Actions or ML Ops and get answers grounded in real-time Google Search data.
        </p>
        
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g., What is the latest syntax for GitHub Actions concurrency?"
            className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
          <button 
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
          </button>
        </form>
      </div>

      {result && (
        <div className="p-6 bg-slate-50 border-t border-slate-100">
          <div className="prose prose-sm max-w-none text-slate-800">
            <ReactMarkdown>{result.text}</ReactMarkdown>
          </div>
          
          {result.sources && result.sources.length > 0 && (
            <div className="mt-6">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Sources</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {result.sources.map((source, idx) => (
                  source.web && (
                    <a 
                      key={idx} 
                      href={source.web.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 bg-white rounded border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm group"
                    >
                      <Globe className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                      <span className="truncate text-gray-600 group-hover:text-blue-700 font-medium">
                        {source.web.title}
                      </span>
                      <ChevronRight className="w-3 h-3 text-gray-300 ml-auto group-hover:text-blue-400" />
                    </a>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAssistant;
