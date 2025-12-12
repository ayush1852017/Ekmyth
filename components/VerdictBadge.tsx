import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export type Verdict = 'verified' | 'busted' | 'needs-evidence';

interface VerdictBadgeProps {
  verdict: Verdict;
}

export const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict }) => {
  const config = {
    verified: { label: 'Verified', color: 'bg-green-500', icon: CheckCircle2 },
    busted: { label: 'Busted', color: 'bg-red-500', icon: XCircle },
    'needs-evidence': { label: 'Needs Evidence', color: 'bg-yellow-500', icon: AlertCircle },
  };

  const { label, color, icon: Icon } = config[verdict] || config['needs-evidence'];

  return (
    <Badge className={`${color} text-white border-0 gap-1`}>
      <Icon className="w-3 h-3" />
      {label}
    </Badge>
  );
};
