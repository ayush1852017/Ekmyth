import React, { useState } from 'react';
import { MythSubmission, VerdictType, Comment } from '../types';

interface MythDetailProps {
  myth: MythSubmission;
  onBack: () => void;
  onAddComment: (mythId: string, text: string) => void;
}

const MythDetail: React.FC<MythDetailProps> = ({ myth, onBack, onAddComment }) => {
  const [newComment, setNewComment] = useState('');

  const handlePostComment = () => {
    if (!newComment.trim()) return;
    onAddComment(myth.id, newComment);
    setNewComment('');
  };

  const getVerdictBadge = (verdict: VerdictType) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-bold tracking-wide flex items-center gap-2 w-fit";
    switch (verdict) {
      case VerdictType.VERIFIED:
        return <div className={`${baseClasses} bg-truth-500 text-white`}><i className="fa-solid fa-check"></i> VERIFIED FACT</div>;
      case VerdictType.BUSTED:
        return <div className={`${baseClasses} bg-myth-500 text-white`}><i className="fa-solid fa-xmark"></i> DEBUNKED MYTH</div>;
      default:
        return <div className={`${baseClasses} bg-gray-500 text-white`}><i className="fa-solid fa-scale-balanced"></i> {verdict}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={onBack}
          className="mb-6 text-gray-500 hover:text-brand-600 transition-colors flex items-center gap-2 font-medium"
        >
          <i className="fa-solid fa-arrow-left"></i> Back to Feed
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          {/* Header */}
          <div className="p-8 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              {getVerdictBadge(myth.aiVerdict)}
              <div className="text-sm text-gray-500 flex items-center gap-4">
                 <span><i className="fa-regular fa-clock mr-1"></i> {new Date(myth.submittedAt).toLocaleDateString()}</span>
                 <span><i className="fa-regular fa-folder mr-1"></i> {myth.category}</span>
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-6">{myth.title}</h1>
            
            {/* The Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-xl border border-red-100">
                 <h3 className="text-myth-500 font-bold uppercase tracking-wider mb-3 text-sm flex items-center gap-2">
                   <i className="fa-solid fa-triangle-exclamation"></i> The Myth
                 </h3>
                 <p className="text-gray-800 text-lg leading-relaxed font-medium">
                   "{myth.mythClaim}"
                 </p>
              </div>
              <div className="bg-green-50 p-6 rounded-xl border border-green-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4 opacity-10">
                   <i className="fa-solid fa-check-double text-6xl text-truth-600"></i>
                 </div>
                 <h3 className="text-truth-600 font-bold uppercase tracking-wider mb-3 text-sm flex items-center gap-2">
                   <i className="fa-solid fa-lightbulb"></i> The Reality
                 </h3>
                 <p className="text-gray-800 text-lg leading-relaxed relative z-10">
                   {myth.factReality}
                 </p>
              </div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div className="bg-slate-50 p-8 border-b border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <i className="fa-solid fa-robot text-brand-600 text-xl"></i>
              <h3 className="text-lg font-bold text-gray-900">AI Verification Report</h3>
            </div>
            <div className="prose prose-sm max-w-none text-gray-600 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-medium text-gray-800 mb-2">Verdict Reason:</p>
              <p>{myth.aiReasoning}</p>
              
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-xs text-gray-500 uppercase tracking-wide font-bold">
                   <span>Trust Score</span>
                   <span>{myth.aiConfidenceScore}/100</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-brand-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${myth.aiConfidenceScore}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Sources */}
            <div className="mt-6">
               <h4 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider">Reference Sources</h4>
               <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                 {[...myth.userSources, ...(myth.aiSuggestedSources || []).map(s => s.url)].map((src, idx) => (
                   src && (
                    <li key={idx} className="flex items-center gap-2 text-sm text-brand-600 bg-white px-3 py-2 rounded border border-gray-200 hover:border-brand-300 transition-colors">
                      <i className="fa-solid fa-link text-gray-400"></i>
                      <a href={src} target="_blank" rel="noreferrer" className="truncate hover:underline">
                        {src}
                      </a>
                    </li>
                   )
                 ))}
                 {myth.userSources.length === 0 && (!myth.aiSuggestedSources || myth.aiSuggestedSources.length === 0) && (
                   <li className="text-sm text-gray-400 italic">No external sources linked.</li>
                 )}
               </ul>
            </div>
          </div>

          {/* Discussion */}
          <div className="p-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Discussion ({myth.comments.length})</h3>
            
            <div className="mb-8 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold flex-shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-shadow"
                  rows={2}
                  placeholder="Join the discussion... Be respectful."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <div className="flex justify-end mt-2">
                  <button 
                    onClick={handlePostComment}
                    disabled={!newComment.trim()}
                    className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {myth.comments.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No comments yet. Be the first!</p>
              ) : (
                myth.comments.map((comment) => (
                  <div key={comment.id} className="flex gap-4 animate-fade-in">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs flex-shrink-0">
                      {comment.author.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-sm text-gray-900">{comment.author}</span>
                        <span className="text-xs text-gray-400">{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MythDetail;