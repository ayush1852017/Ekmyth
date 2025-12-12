import React, { useState } from 'react';
import { verifyMythWithAI } from '../services/geminiService';
import { MythSubmission, VerdictType, AIAnalysisResult } from '../types';

interface SubmitProps {
  onSubmit: (submission: MythSubmission) => void;
  onCancel: () => void;
}

const Submit: React.FC<SubmitProps> = ({ onSubmit, onCancel }) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [mythClaim, setMythClaim] = useState('');
  const [factReality, setFactReality] = useState('');
  const [sourcesInput, setSourcesInput] = useState('');

  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!title || !mythClaim || !factReality || !sourcesInput.trim()) {
      setError("Please fill in all required fields, including sources.");
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
      author: 'Anonymous User',
      isVerified: true,
      aiVerdict: analysis.verdict,
      aiConfidenceScore: analysis.confidence,
      aiReasoning: analysis.reasoning,
      aiSuggestedSources: analysis.suggestedSources || [],
      comments: [],
      upvotes: 0,
    };

    onSubmit(newMyth);
  };

  if (isLoading) {
    return (
      <div className="submit-container" style={{textAlign: 'center', minHeight: '60vh', display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
        <div className="scanning-orb" style={{marginBottom: '2rem'}}></div>
        <h2 style={{fontSize: '1.5rem', fontWeight: 700}}>AI Verification in Progress</h2>
        <p style={{color: 'var(--color-text-secondary)'}}>Scanning databases for truth patterns...</p>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', padding: '2rem 1rem'}}>
      <div className="submit-container">
        
        {/* Header */}
        <div style={{textAlign: 'center', marginBottom: '2rem'}}>
          <h2 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', background: 'var(--gradient-truth)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
            {step === 1 ? 'Submit a Myth' : 'AI Analysis Results'}
          </h2>
          <p style={{color: 'var(--color-text-secondary)'}}>
            {step === 1 ? 'Contribute to the grand library of truth.' : 'Here is what our AI found.'}
          </p>
        </div>

        {step === 1 && (
          <div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g., Humans only use 10% of their brains"
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{position: 'relative'}}>
                 <select 
                  className="form-input"
                  style={{appearance: 'none'}}
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                >
                  <option>General</option>
                  <option>Science</option>
                  <option>History</option>
                  <option>Health</option>
                  <option>Tech</option>
                </select>
                <div style={{position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none'}}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{color: 'var(--color-myth-red)'}}>The Myth (False Claim)</label>
              <textarea
                rows={3}
                className="form-textarea"
                style={{borderColor: 'rgba(255, 78, 87, 0.3)', background: '#FFF5F5'}}
                placeholder="Describe the false claim clearly..."
                value={mythClaim}
                onChange={e => setMythClaim(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" style={{color: 'var(--color-verified-green)'}}>The Reality (Fact)</label>
              <textarea
                rows={4}
                className="form-textarea"
                style={{borderColor: 'rgba(31, 199, 124, 0.3)', background: '#F0FBF6'}}
                placeholder="What is the actual truth? Explain it."
                value={factReality}
                onChange={e => setFactReality(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Sources (Required)</label>
              <textarea
                rows={2}
                className="form-textarea"
                placeholder="Paste URLs here, one per line..."
                value={sourcesInput}
                onChange={e => setSourcesInput(e.target.value)}
              />
            </div>

            {error && <div style={{color: 'var(--color-myth-red)', padding: '1rem', background: '#FFF5F5', borderRadius: '8px', marginBottom: '1rem'}}>{error}</div>}

            <div style={{display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem'}}>
              <button onClick={onCancel} className="btn btn-secondary">Cancel</button>
              <button onClick={handleAnalyze} className="btn btn-primary">
                Verify with AI
              </button>
            </div>
          </div>
        )}

        {step === 2 && analysis && (
          <div className="animate-fade-in">
            <div style={{padding: '1.5rem', background: 'var(--color-background)', borderRadius: 'var(--radius-lg)', marginBottom: '1.5rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
                <span style={{fontWeight: 700, color: 'var(--color-text-secondary)'}}>VERDICT</span>
                <span className={`badge ${analysis.verdict === VerdictType.VERIFIED ? 'badge-verified' : analysis.verdict === VerdictType.BUSTED ? 'badge-busted' : 'badge-pending'}`} style={{fontSize: '1rem'}}>
                  {analysis.verdict}
                </span>
              </div>
              
              <div style={{display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '1rem'}}>
                <span style={{fontSize: '3rem', fontWeight: 800, color: 'var(--color-truth-blue)'}}>{analysis.confidence}%</span>
                <span style={{color: 'var(--color-text-secondary)'}}>Confidence Score</span>
              </div>

              <div>
                <strong style={{display: 'block', marginBottom: '0.5rem'}}>AI Reasoning:</strong>
                <p style={{lineHeight: 1.6}}>{analysis.reasoning}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-6">
              {analysis.suggestedSources && analysis.suggestedSources.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Found Sources</p>
                   <ul className="text-xs space-y-1">
                     {analysis.suggestedSources.map((s, idx) => (
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

            <div style={{display: 'flex', justifyContent: 'space-between', marginTop: '2rem'}}>
              <button onClick={() => setStep(1)} className="btn btn-secondary">Edit</button>
              <button onClick={handleFinalSubmit} className="btn btn-primary">Publish to TruthStream</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Submit;