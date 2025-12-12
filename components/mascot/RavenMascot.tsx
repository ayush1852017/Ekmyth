import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Bird, Archive as ArchiveIcon, Search, Trophy, Lightbulb, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

// --- Placeholder SVG Components ---
// In a real scenario, these would be proper SVG imports.
// We use Lucide icons with some styling to represent the different Raven moods.

const RavenBase = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("relative flex items-center justify-center p-2 rounded-full", className)}>
     {children}
  </div>
);

export const RavenIdle = ({ className }: { className?: string }) => (
  <RavenBase className={cn("text-primary", className)}>
    <Bird className="w-full h-full" strokeWidth={1.5} />
  </RavenBase>
);

export const RavenSkeptical = ({ className }: { className?: string }) => (
  <RavenBase className={cn("text-orange-500", className)}>
    <Search className="w-full h-full" strokeWidth={1.5} />
  </RavenBase>
);

export const RavenTriumphant = ({ className }: { className?: string }) => (
  <RavenBase className={cn("text-green-600", className)}>
    <Trophy className="w-full h-full" strokeWidth={1.5} />
  </RavenBase>
);

export const RavenGuiding = ({ className }: { className?: string }) => (
  <RavenBase className={cn("text-blue-500", className)}>
    <Lightbulb className="w-full h-full" strokeWidth={1.5} />
  </RavenBase>
);

export const RavenCompanion = ({ className }: { className?: string }) => (
    <RavenBase className={cn("text-purple-500", className)}>
      <Bird className="w-full h-full" strokeWidth={1.5} />
    </RavenBase>
  );

// --- Component Definition ---

export type RavenVariant = 'idle' | 'skeptical' | 'triumphant' | 'guiding' | 'companion';

interface RavenMascotProps {
  variant: RavenVariant;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-24 h-24',
};

export const RavenMascot: React.FC<RavenMascotProps> = ({
  variant = 'idle',
  message,
  className,
  size = 'md',
  onClick,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const renderIcon = () => {
    switch (variant) {
      case 'idle':
        return <RavenIdle />;
      case 'skeptical':
        return <RavenSkeptical />;
      case 'triumphant':
        return <RavenTriumphant />;
      case 'guiding':
        return <RavenGuiding />;
      case 'companion':
        return <RavenCompanion />;
      default:
        return <RavenIdle />;
    }
  };

  return (
    <div
      className={cn(
        "relative flex flex-col items-center group cursor-pointer animate-float z-50",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Speech Bubble */}
      {message && (
        <div
          className={cn(
            "absolute bottom-full mb-2 w-max max-w-[200px] bg-popover text-popover-foreground text-xs md:text-sm px-3 py-2 rounded-xl shadow-md border border-border transition-all duration-300 ease-in-out opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 z-50",
            // Keep visible if guiding or triumphant for emphasis in specific contexts if needed,
            // but for now relying on hover or explicit parent control logic if we wanted.
            // As per requirements: "preferably appear on hover, or be unobtrusive if permanent."
            // We'll stick to hover for the Component, but parent usage could force it if we modified props.
            "text-center font-medium"
          )}
        >
          {message}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-popover" />
        </div>
      )}

      {/* Mascot Icon */}
      <div
        className={cn(
          "transition-transform duration-300 ease-spring hover:scale-110 drop-shadow-sm",
           sizeClasses[size]
        )}
      >
        {renderIcon()}
      </div>
    </div>
  );
};
