import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from 'lucide-react';
import { VerdictBadge, Verdict } from './VerdictBadge';

export interface Myth {
  id: string;
  title: string;
  verdict: Verdict;
  category: string;
  votes: number;
  comments: number;
  bookmarked: boolean;
  username: string;
  confidence: number;
  snippet?: string;
}

interface MythCardProps {
  myth: Myth;
  onVote: (id: string, type: 'up' | 'down') => void;
  onBookmark: (id: string) => void;
  onClick: (id: string) => void;
}

export const MythCard: React.FC<MythCardProps> = ({ myth, onVote, onBookmark, onClick }) => {
  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1" onClick={() => onClick(myth.id)}>
            <h3 className="font-semibold text-foreground mb-2 text-lg">{myth.title}</h3>
            <div className="flex items-center gap-2 mb-2">
              <VerdictBadge verdict={myth.verdict} />
              <Badge variant="outline" className="text-xs">{myth.category}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">by {myth.username}</p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onVote(myth.id, 'up');
              }}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-xs">{myth.votes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 h-8"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs">{myth.comments}</span>
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(myth.id);
              }}
            >
              <Bookmark className={`w-4 h-4 ${myth.bookmarked ? 'fill-current' : ''}`} />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};