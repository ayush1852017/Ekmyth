import React from 'react';
import { MythSubmission, VerdictType } from '../types';

interface MythCardProps {
  myth: MythSubmission;
  onClick: (id: string) => void;
}

const MythCard: React.FC<MythCardProps> = ({ myth, onClick }) => {
  const getVerdictStyle = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.VERIFIED:
        return 'bg-truth-500 text-white';
      case VerdictType.BUSTED:
        return 'bg-myth-500 text-white'; // Means the "Fact" proposed was wrong
      case VerdictType.PARTIALLY_TRUE:
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const getVerdictLabel = (verdict: VerdictType) => {
    switch (verdict) {
      case VerdictType.VERIFIED:
        return 'VERIFIED FACT';
      case VerdictType.BUSTED:
        return 'FALSE CLAIM';
      case VerdictType.PARTIALLY_TRUE:
        return 'COMPLEX';
      default:
        return 'UNCERTAIN';
    }
  };

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(myth.id)}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-2 py-1 rounded text-xs font-bold tracking-wider ${getVerdictStyle(myth.aiVerdict)}`}>
            {getVerdictLabel(myth.aiVerdict)}
          </span>
          <span className="text-gray-400 text-xs">
            {new Date(myth.submittedAt).toLocaleDateString()}
          </span>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-brand-600 transition-colors">
          {myth.title}
        </h3>

        <div className="space-y-3 mb-4">
          <div className="bg-red-50 p-3 rounded-lg border-l-4 border-myth-500">
            <p className="text-xs font-bold text-myth-500 uppercase mb-1">Myth</p>
            <p className="text-gray-800 text-sm line-clamp-2">{myth.mythClaim}</p>
          </div>
          <div className="bg-green-50 p-3 rounded-lg border-l-4 border-truth-500">
            <p className="text-xs font-bold text-truth-500 uppercase mb-1">Reality</p>
            <p className="text-gray-800 text-sm line-clamp-2">{myth.factReality}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-robot text-brand-500"></i>
            <span className="font-medium">AI Confidence: {myth.aiConfidenceScore}%</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 hover:text-brand-600">
              <i className="fa-regular fa-comment"></i>
              {myth.comments.length}
            </span>
            <span className="flex items-center gap-1 hover:text-brand-600">
              <i className="fa-solid fa-arrow-up"></i>
              {myth.upvotes}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MythCard;