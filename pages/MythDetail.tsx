import React, { useState } from 'react';
import { MythSubmission, VerdictType } from '../types';

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

  const getVerdictLabel = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.VERIFIED: return 'VERIFIED FACT';
      case VerdictType.BUSTED: return 'BUSTED MYTH';
      case VerdictType.PARTIALLY_TRUE: return 'COMPLEX';
      default: return 'UNCERTAIN';
    }
  };

  const getVerdictClass = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.VERIFIED: return 'badge-verified';
      case VerdictType.BUSTED: return 'badge-busted';
      default: return 'badge-pending';
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return 'Source';
    }
  };

  return (
    <div style={{minHeight: '100vh', padding: '2rem 1rem 6rem'}}>
      <div className="home-container" style={{background: 'none', boxShadow: 'none', padding: 0}}>
        <button 
          onClick={onBack}
          className="btn btn-secondary"
          style={{marginBottom: '1.5rem', border: 'none', paddingLeft: 0, justifyContent: 'flex-start', background: 'transparent', boxShadow: 'none'}}
        >
          <i className="fas fa-arrow-left" style={{ marginRight: '0.5rem' }}></i> Back to Stream
        </button>

        <div className="card" style={{padding: '0', overflow: 'hidden', borderBottomWidth: '6px' }}>
          {/* Header */}
          <div style={{padding: '2rem', borderBottom: '2px solid var(--color-divider)'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem'}}>
              <span className={`badge ${getVerdictClass(myth.aiVerdict)}`} style={{fontSize: '1rem', padding: '0.5rem 1rem'}}>
                {getVerdictLabel(myth.aiVerdict)}
              </span>
              <div style={{color: 'var(--color-text-secondary)', fontSize: '0.9rem', display: 'flex', gap: '1rem', fontWeight: 600}}>
                 <span><i className="far fa-calendar-alt"></i> {new Date(myth.submittedAt).toLocaleDateString()}</span>
                 <span>#{myth.category}</span>
              </div>
            </div>
            <h1 style={{fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem', lineHeight: 1.2, color: 'var(--color-ink-black)' }}>{myth.title}</h1>
            
            {/* The Comparison */}
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem'}}>
              <div className="comparison-box myth">
                 <h3 className="comparison-label" style={{fontSize: '1rem', marginBottom: '0.5rem'}}>THE MYTH</h3>
                 <p style={{fontSize: '1.1rem', lineHeight: 1.6}}>"{myth.mythClaim}"</p>
              </div>
              <div className="comparison-box fact">
                 <h3 className="comparison-label" style={{fontSize: '1rem', marginBottom: '0.5rem'}}>THE REALITY</h3>
                 <p style={{fontSize: '1.1rem', lineHeight: 1.6}}>{myth.factReality}</p>
              </div>
            </div>
          </div>

          {/* AI Analysis Section */}
          <div style={{padding: '2rem', background: 'var(--color-background)', borderBottom: '2px solid var(--color-divider)'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem'}}>
              <div style={{ padding: '0.5rem', background: 'var(--color-truth-blue)', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
                  <i className="fas fa-robot"></i>
              </div>
              <h3 style={{fontSize: '1.25rem', fontWeight: 800}}>AI Verification Report</h3>
            </div>
            
            <div style={{background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '2px solid var(--color-divider)'}}>
              <p style={{marginBottom: '1rem', lineHeight: 1.6, color: 'var(--color-ink-black)'}}>{myth.aiReasoning}</p>
              
              <div style={{marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed var(--color-divider)'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-text-secondary)'}}>
                   <span>TRUST SCORE</span>
                   <span>{myth.aiConfidenceScore}/100</span>
                </div>
                <div style={{width: '100%', height: '12px', background: 'var(--color-divider)', borderRadius: '999px', overflow: 'hidden'}}>
                  <div 
                    style={{
                      height: '100%', 
                      background: 'var(--color-truth-blue)', 
                      width: `${myth.aiConfidenceScore}%`,
                      transition: 'width 1s ease',
                      borderRadius: '999px'
                    }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Sources */}
            <div style={{marginTop: '2rem'}}>
               <h4 style={{fontSize: '0.9rem', fontWeight: 800, color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '1rem'}}>Reference Sources</h4>
               <ul style={{display: 'grid', gap: '0.75rem'}}>
                 {[...myth.userSources, ...(myth.aiSuggestedSources || []).map(s => s.url)].map((src, idx) => (
                   src && (
                    <li key={idx}>
                      <a href={src} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{
                          display: 'flex', 
                          justifyContent: 'flex-start',
                          padding: '1rem', 
                          borderRadius: 'var(--radius-md)', 
                          textAlign: 'left',
                          width: '100%',
                          fontSize: '0.95rem',
                          textTransform: 'none',
                          fontWeight: 600
                      }}>
                        <i className="fas fa-external-link-alt" style={{ marginRight: '0.75rem', color: 'var(--color-text-secondary)' }}></i>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)', textTransform: 'uppercase', marginBottom: '2px' }}>{getDomain(src)}</div>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100%' }}>Read Full Article</div>
                        </div>
                      </a>
                    </li>
                   )
                 ))}
                 {myth.userSources.length === 0 && (!myth.aiSuggestedSources || myth.aiSuggestedSources.length === 0) && (
                   <li style={{color: 'var(--color-text-tertiary)', fontStyle: 'italic'}}>No external sources linked.</li>
                 )}
               </ul>
            </div>
          </div>

          {/* Discussion */}
          <div style={{padding: '2rem'}}>
            <h3 style={{fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem'}}>Discussion ({myth.comments.length})</h3>
            
            <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
              <div style={{width: '48px', height: '48px', borderRadius: '50%', background: 'var(--color-divider)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                 <i className="fas fa-user" style={{ color: 'var(--color-text-light)' }}></i>
              </div>
              <div style={{flex: 1}}>
                <textarea
                  className="form-textarea"
                  rows={3}
                  placeholder="Join the discussion..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ marginBottom: '0.5rem' }}
                />
                <div style={{display: 'flex', justifyContent: 'flex-end'}}>
                  <button onClick={handlePostComment} disabled={!newComment.trim()} className="btn btn-primary">
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
              {myth.comments.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)' }}>
                    <p style={{color: 'var(--color-text-secondary)', fontWeight: 600 }}>No comments yet.</p>
                    <p style={{ fontSize: '0.9rem', color: 'var(--color-text-tertiary)' }}>Be the first to share your thoughts!</p>
                </div>
              ) : (
                myth.comments.map((comment) => (
                  <div key={comment.id} style={{display: 'flex', gap: '1rem'}}>
                    <div style={{width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-divider)', color: 'var(--color-text-secondary)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800}}>
                      {comment.author.charAt(0)}
                    </div>
                    <div style={{ background: 'var(--color-surface-hover)', padding: '1rem', borderRadius: 'var(--radius-md)', flex: 1 }}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem'}}>
                        <span style={{fontWeight: 800, color: 'var(--color-ink-black)'}}>{comment.author}</span>
                        <span style={{color: 'var(--color-text-secondary)', fontSize: '0.75rem', fontWeight: 600}}>{new Date(comment.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p style={{lineHeight: 1.5, color: 'var(--color-text-primary)'}}>{comment.text}</p>
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