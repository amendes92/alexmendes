import React, { useState } from 'react';
import { DoctorData } from '../types';
import { analyzeDoctorPerformance } from '../services/geminiService';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface GeminiAdvisorProps {
  data: DoctorData;
}

export const GeminiAdvisor: React.FC<GeminiAdvisorProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    const result = await analyzeDoctorPerformance(data);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="p-8 overflow-y-auto h-full bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4 text-white">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Gemini AI Consultant</h2>
          <p className="text-slate-600 max-w-xl mx-auto">
            Leverage Google's generative AI to analyze your practice's technical performance and market positioning against competitors.
          </p>
        </header>

        {!analysis && (
          <div className="flex justify-center">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full text-lg font-semibold shadow-xl hover:bg-slate-800 hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing Data...
                </>
              ) : (
                <>
                  Generate Practice Report
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}

        {analysis && (
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-fade-in-up">
            <div className="bg-slate-900 p-4 flex items-center justify-between">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <FileText size={14} />
                Report Generated via gemini-2.5-flash
              </span>
              <button 
                onClick={() => setAnalysis(null)}
                className="text-slate-400 hover:text-white text-sm"
              >
                Clear
              </button>
            </div>
            <div className="p-8 prose prose-slate max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-a:text-indigo-600">
               <ReactMarkdown>{analysis}</ReactMarkdown>
            </div>
          </div>
        )}
        
        {/* Helper Context for the User */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-600">
                <strong className="block text-slate-900 mb-1">Context Loaded</strong>
                Data from Cloud Firestore regarding page speed, security, and competitor analysis.
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-600">
                <strong className="block text-slate-900 mb-1">Model</strong>
                gemini-2.5-flash-latest used for high-speed reasoning and strategy formulation.
            </div>
            <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm text-sm text-slate-600">
                <strong className="block text-slate-900 mb-1">Goal</strong>
                To provide actionable ROI improvements for Dr. Alexandre's digital clinic.
            </div>
        </div>
      </div>
    </div>
  );
};