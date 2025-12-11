import React, { useState } from 'react';
import { verifyMythWithAI } from '../services/geminiService';
import { MythSubmission, VerdictType, AIAnalysisResult } from '../types';

interface SubmitProps {
  onSubmit: (submission: MythSubmission) => void;
  onCancel: () => void;
}

const Submit: React.FC<SubmitProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [mythClaim, setMythClaim] = useState('');
  const [factReality, setFactReality] = useState('');
  const [sourcesInput, setSourcesInput] = useState('');

  // Analysis Result State
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!title || !mythClaim || !factReality) {
      setError("Please fill in all required fields.");
      return;
    }
    setError(null);
    setIsLoading(true);

    const sourcesList = sourcesInput.split('\n').filter(s => s.trim() !== '');

    try {
      const result = await verifyMythWithAI(mythClaim, factReality, sourcesList);
      setAnalysis(result);
      setStep(2);
    } catch (e) {
      setError("AI Service unavailable. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    if (!analysis) return;

    const newMyth: MythSubmission = {
      id: Date.now().toString(),
      title,
      mythClaim,
      factReality,
      category,
      userSources: sourcesInput.split('\n').filter(s => s.trim() !== ''),
      submittedAt: Date.now(),
      author: 'Anonymous User', // In a real app, from auth context
      isVerified: true, // It has passed the AI check step
      aiVerdict: analysis.verdict,
      aiConfidenceScore: analysis.confidence,
      aiReasoning: analysis.reasoning,
      aiSuggestedSources: analysis.suggestedSources || [],
      comments: [],
      upvotes: 0,
    };

    onSubmit(newMyth);
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Progress Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10"></div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Draft</span>
            <span>AI Review</span>
            <span>Publish</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-brand-900 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">
              {step === 1 ? 'Submit a Myth-Bust' : step === 2 ? 'AI Review' : 'Success'}
            </h2>
            <p className="text-brand-100 text-sm mt-1">
              Help us keep the internet fact-checked.
            </p>
          </div>

          <div className="p-8">
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none"
                    placeholder="e.g., Humans only use 10% of their brains"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select 
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none"
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option>General</option>
                      <option>Science</option>
                      <option>History</option>
                      <option>Health</option>
                      <option>Tech</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-myth-500 mb-1">The Myth (False Claim)</label>
                  <textarea
                    rows={3}
                    className="w-full rounded-md border border-red-200 bg-red-50 px-4 py-2 focus:ring-2 focus:ring-myth-500 outline-none"
                    placeholder="Describe the false claim clearly..."
                    value={mythClaim}
                    onChange={e => setMythClaim(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-truth-500 mb-1">The Reality (Fact)</label>
                  <textarea
                    rows={4}
                    className="w-full rounded-md border border-green-200 bg-green-50 px-4 py-2 focus:ring-2 focus:ring-truth-500 outline-none"
                    placeholder="What is the actual truth? Explain it."
                    value={factReality}
                    onChange={e => setFactReality(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sources (Optional but Recommended)</label>
                  <textarea
                    rows={2}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-brand-500 outline-none text-sm"
                    placeholder="Paste URLs here, one per line..."
                    value={sourcesInput}
                    onChange={e => setSourcesInput(e.target.value)}
                  />
                  <p className="text-xs text-gray-400 mt-1">Our AI will also search the web to cross-reference.</p>
                </div>

                {error && <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded">{error}</div>}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                  <button 
                    onClick={handleAnalyze}
                    disabled={isLoading}
                    className="px-6 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin"></i>
                        AI Analyzing...
                      </>
                    ) : (
                      <>
                        Review with AI <i className="fa-solid fa-arrow-right"></i>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {step === 2 && analysis && (
              <div className="space-y-6 animate-fade-in">
                <div className="flex items-center gap-4 bg-brand-50 p-4 rounded-xl border border-brand-100">
                  <div className="p-3 bg-white rounded-full shadow-sm">
                    <i className="fa-solid fa-robot text-2xl text-brand-600"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Analysis Complete</h3>
                    <p className="text-sm text-gray-600">Ekmyth's Truth Arbiter has reviewed your submission.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Verdict</p>
                    <div className="flex items-center gap-2 mb-4">
                      {analysis.verdict === VerdictType.VERIFIED && <i className="fa-solid fa-check-circle text-green-500 text-2xl"></i>}
                      {analysis.verdict === VerdictType.BUSTED && <i className="fa-solid fa-times-circle text-red-500 text-2xl"></i>}
                      {analysis.verdict === VerdictType.PARTIALLY_TRUE && <i className="fa-solid fa-exclamation-circle text-yellow-500 text-2xl"></i>}
                      {analysis.verdict === VerdictType.UNCERTAIN && <i className="fa-solid fa-question-circle text-gray-500 text-2xl"></i>}
                      <span className="text-2xl font-bold text-gray-900">{analysis.verdict.replace('_', ' ')}</span>
                    </div>
                    
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Confidence Score</p>
                    <div className="flex items-end gap-2">
                      <span className={`text-4xl font-extrabold ${getConfidenceColor(analysis.confidence)}`}>
                        {analysis.confidence}%
                      </span>
                      <span className="text-gray-400 mb-1 text-sm">certainty</span>
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">AI Reasoning</p>
                    <p className="text-gray-700 italic">"{analysis.reasoning}"</p>
                    
                    {analysis.suggestedSources && analysis.suggestedSources.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Found Sources</p>
                         <ul className="text-xs space-y-1">
                           {analysis.suggestedSources.slice(0, 3).map((s, idx) => (
                             <li key={idx} className="truncate text-brand-600">
                               <a href={s.url} target="_blank" rel="noreferrer" className="hover:underline">
                                 <i className="fa-solid fa-link mr-1"></i> {s.title || s.url}
                               </a>
                             </li>
                           ))}
                         </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 flex gap-3">
                  <i className="fa-solid fa-shield-halved text-yellow-600 mt-1"></i>
                  <div>
                    <h4 className="font-bold text-yellow-800 text-sm">Does this look right?</h4>
                    <p className="text-yellow-700 text-sm">
                      If the AI Confidence score is low, please ensure your "Reality" description is detailed and check your sources. High confidence submissions are prioritized on the feed.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-100">
                  <button onClick={() => setStep(1)} className="text-gray-500 hover:text-gray-700 font-medium">
                    <i className="fa-solid fa-arrow-left mr-2"></i> Edit Content
                  </button>
                  <button 
                    onClick={handleFinalSubmit}
                    className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-bold shadow-lg transform transition hover:-translate-y-1"
                  >
                    Publish to Ekmyth
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submit;