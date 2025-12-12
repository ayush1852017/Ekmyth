import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export interface Reference {
  id: string;
  domain: string;
  snippet: string;
  url: string;
}

interface ReferenceCardProps {
  reference: Reference;
}

export const ReferenceCard: React.FC<ReferenceCardProps> = ({ reference }) => {
  return (
    <Card className="border-border">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="font-semibold text-sm text-foreground mb-1">{reference.domain}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">{reference.snippet}</p>
          </div>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 shrink-0" asChild>
            <a href={reference.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
