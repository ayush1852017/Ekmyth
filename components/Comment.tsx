import React, { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export interface CommentType {
  id: string;
  username: string;
  content: string;
  votes: number;
  replies: CommentType[];
  timestamp: string;
}

interface CommentProps {
  comment: CommentType;
  depth?: number;
  onVote: (id: string, type: 'up' | 'down') => void;
  onReply: (id: string) => void;
}

export const Comment: React.FC<CommentProps> = ({ comment, depth = 0, onVote, onReply }) => {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={`${depth > 0 ? 'ml-6 border-l-2 border-border pl-4' : ''}`}>
      <div className="flex gap-3 mb-3">
        <Avatar className="w-8 h-8">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">
            {comment.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-foreground">{comment.username}</span>
            <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
          </div>
          <p className="text-sm text-foreground mb-2">{comment.content}</p>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2"
              onClick={() => onVote(comment.id, 'up')}
            >
              <ThumbsUp className="w-3 h-3" />
              <span className="text-xs">{comment.votes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 px-2"
              onClick={() => onVote(comment.id, 'down')}
            >
              <ThumbsDown className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs"
              onClick={() => onReply(comment.id)}
            >
              Reply
            </Button>
          </div>
        </div>
      </div>
      {comment.replies.length > 0 && (
        <div className="mt-3">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs mb-2"
            onClick={() => setShowReplies(!showReplies)}
          >
            {showReplies ? 'Hide' : 'Show'} {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
          </Button>
          {showReplies && (
            <div className="space-y-3">
              {comment.replies.map((reply) => (
                <Comment
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  onVote={onVote}
                  onReply={onReply}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
