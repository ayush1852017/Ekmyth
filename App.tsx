import React, { useState, useEffect, createContext, useContext } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ThumbsUp, MessageCircle, Bookmark, Share2, Search, TrendingUp, 
  CheckCircle2, XCircle, AlertCircle, ExternalLink, Send, Flame, 
  Award, Target, Home, Compass, PlusCircle, User, ChevronRight,
  Menu, Bell, Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { RavenMascot as OriginalRavenMascot } from '@/components/mascot/RavenMascot';

// --- CONTEXT & TYPES ---

interface Myth {
  id: string;
  title: string;
  verdict: 'verified' | 'busted' | 'needs-evidence';
  category: string;
  votes: number;
  comments: number;
  bookmarked: boolean;
  username: string;
  confidence: number;
  snippet?: string;
}

// Global Store for "Production" feel (Persisting state across pages)
const AppContext = createContext<{
  myths: Myth[];
  toggleVote: (id: string) => void;
  toggleBookmark: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
} | null>(null);

// --- COMPONENTS ---

// 1. THE RAVEN MASCOT ADAPTER
// We are adapting the provided detailed RavenMascot implementation to the requested interface
// or using it directly where appropriate while keeping the simpler requested inline version as a fallback/alternative variation.
// To respect the user's specific request for the new "Production Code" structure but essentially keeping the "soul" of the Raven we just built:
// We will use the user's provided simplified RavenMascot code for this specific App.tsx implementation as requested,
// but we'll adapt it to use our existing RavenMascot component where it makes sense for better visuals, or stick to the requested simple one if preferred.
// The user explicitly provided code for RavenMascot in the prompt. I should use THAT code to match their "Production Code" request exactly.
// However, the user's prompt code for RavenMascot is simplified.
// I will implement the requested "Production Code" exactly as provided in the prompt to ensure it matches their expectations for this step.

const RavenMascot = ({ variant, message }: { variant: 'idle' | 'skeptical' | 'triumphant' | 'guiding', message?: string }) => {
  // In production, these would be high-quality SVGs or Lottie files
  const getIcon = () => {
    switch (variant) {
      case 'triumphant': return <XCircle className="w-8 h-8 text-red-500 animate-bounce" />;
      case 'skeptical': return <Search className="w-8 h-8 text-yellow-500 animate-pulse" />;
      case 'guiding': return <Target className="w-8 h-8 text-blue-500 animate-spin-slow" />;
      default: return <div className="text-2xl">🐦</div>;
    }
  };

  return (
    <div className="relative group z-50">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, y: [0, -5, 0] }}
        transition={{ y: { duration: 3, repeat: Infinity, ease: "easeInOut" } }}
        className="flex items-end justify-center"
      >
        {getIcon()}
      </motion.div>
      {message && (
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute right-full mr-2 bottom-0 w-32 bg-popover text-popover-foreground text-xs p-2 rounded-lg shadow-lg border border-border"
        >
          {message}
          <div className="absolute right-0 bottom-2 -mr-1 w-2 h-2 bg-popover transform rotate-45 border-r border-b border-border"></div>
        </motion.div>
      )}
    </div>
  );
};

// 2. ANIMATED BACKGROUND
const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-[0.03]">
      <motion.div 
        animate={{ 
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0"
        style={{
          backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      {/* Floating Elements */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-current"
          style={{
            width: Math.random() * 100 + 50,
            height: Math.random() * 100 + 50,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, Math.random() * 100 - 50],
            x: [0, Math.random() * 100 - 50],
            rotate: [0, 360]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );
};

// 3. UI COMPONENTS
const VerdictBadge = ({ verdict }: { verdict: Myth['verdict'] }) => {
  const config = {
    verified: { label: 'Verified', color: 'bg-green-500/10 text-green-600 border-green-200', icon: CheckCircle2 },
    busted: { label: 'Busted', color: 'bg-red-500/10 text-red-600 border-red-200', icon: XCircle },
    'needs-evidence': { label: 'Needs Evidence', color: 'bg-yellow-500/10 text-yellow-600 border-yellow-200', icon: AlertCircle },
  };
  const { label, color, icon: Icon } = config[verdict];
  return (
    <Badge variant="outline" className={`${color} border gap-1.5 py-1 px-2`}>
      <Icon className="w-3.5 h-3.5" />
      {label}
    </Badge>
  );
};

const MythCard = ({ myth, compact = false }: { myth: Myth, compact?: boolean }) => {
  const { toggleVote, toggleBookmark } = useContext(AppContext)!;
  const navigate = useNavigate();

  return (
    <motion.div 
      layoutId={`card-${myth.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-md transition-shadow border-border/60 bg-card/50 backdrop-blur-sm"
        onClick={() => navigate(`/myth/${myth.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <VerdictBadge verdict={myth.verdict} />
                <span className="text-xs text-muted-foreground">• {myth.category}</span>
              </div>
              <h3 className={cn("font-semibold leading-tight", compact ? "text-base" : "text-lg")}>
                {myth.title}
              </h3>
              {!compact && <p className="text-xs text-muted-foreground">by {myth.username}</p>}
            </div>
            {/* Contextual Raven for specific cards if needed, otherwise simplified */}
          </div>

          <Separator className="my-3" />

          <div className="flex items-center justify-between">
            <div className="flex gap-4">
              <Button 
                variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground hover:text-primary"
                onClick={(e) => { e.stopPropagation(); toggleVote(myth.id); }}
              >
                <ThumbsUp className={cn("w-4 h-4", myth.votes > 0 ? "fill-primary/20 text-primary" : "")} />
                <span className="text-xs">{myth.votes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="h-8 gap-1.5 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span className="text-xs">{myth.comments}</span>
              </Button>
            </div>
            <Button 
              variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
              onClick={(e) => { e.stopPropagation(); toggleBookmark(myth.id); }}
            >
              <Bookmark className={cn("w-4 h-4", myth.bookmarked ? "fill-current text-primary" : "")} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// --- PAGES ---

// --- PAGES ---

const HomePage = () => {
  const { myths, searchQuery, setSearchQuery } = useContext(AppContext)!;
  const filteredMyths = myths.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6 pb-24">
      {/* Header with Raven */}
      <div className="flex justify-between items-end mb-6 sticky top-0 bg-background/80 backdrop-blur-md p-4 -mx-4 z-40 border-b">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">EKMYTH</h1>
          <p className="text-xs text-muted-foreground">Truth through verification</p>
        </div>
        <div className="flex items-center gap-3">
          <RavenMascot variant="idle" message="Question everything." />
          <Button variant="ghost" size="icon"><Bell className="w-5 h-5" /></Button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input 
          placeholder="Search for myths..." 
          className="pl-10 bg-muted/40 border-border/60"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Trending Card */}
      <motion.div whileHover={{ scale: 1.01 }} className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/20 to-indigo-500/10 border border-primary/20 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="bg-background/50 p-3 rounded-full backdrop-blur-sm">
            <TrendingUp className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Trending Today</h3>
            <p className="text-sm text-muted-foreground">512 myths verified in 24h</p>
          </div>
        </div>
        <div className="absolute right-0 top-0 -mt-4 -mr-4 w-24 h-24 bg-primary/20 rounded-full blur-2xl" />
      </motion.div>

      {/* Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-500" /> TruthStream Feed
          </h2>
        </div>
        {filteredMyths.length > 0 ? (
          filteredMyths.map((myth) => (
            <MythCard key={myth.id} myth={myth} />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No myths found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
};

const ExplorePage = () => {
  const { myths } = useContext(AppContext)!;
  const categories = ['History', 'Science', 'Health', 'Tech', 'Culture', 'Politics'];
  
  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-lg">
        <Search className="w-4 h-4 text-muted-foreground ml-2" />
        <Input placeholder="Search categories..." className="border-none bg-transparent shadow-none focus-visible:ring-0 h-8" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {categories.map((cat, i) => (
          <motion.div 
            key={cat}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <span className="font-medium">{cat}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Restored Feed List */}
      <div className="space-y-4 pt-4 border-t border-border/40">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Compass className="w-4 h-4 text-primary" /> Discover More
          </h2>
        </div>
        {myths.slice(0, 5).map((myth) => (
          <MythCard key={myth.id} myth={myth} />
        ))}
      </div>
    </div>
  );
};

const SubmitPage = () => {
  const [step, setStep] = useState(0);
  
  // Dynamic Raven Guidance
  const getRavenMsg = () => {
    if (step === 0) return "Don't accept ignorance. Write it down.";
    if (step === 1) return "Got credible backup? We need sources.";
    return "Let's unleash the AI on this.";
  };

  return (
    <div className="space-y-6 pb-24 pt-4">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Submit Myth</h2>
          <p className="text-muted-foreground text-sm">Help us verify the truth</p>
        </div>
        <RavenMascot variant="guiding" message={getRavenMsg()} />
      </div>

      <Card className="border-border">
        <CardContent className="p-6">
          <div className="mb-8">
            <Progress value={(step + 1) * 33} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Claim</span>
              <span>Source</span>
              <span>Verify</span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {step === 0 && (
                <div className="space-y-4">
                  <Textarea placeholder="E.g., Cracking knuckles causes arthritis..." className="min-h-[150px] text-lg resize-none" />
                  <Button className="w-full" onClick={() => setStep(1)}>Next Step</Button>
                </div>
              )}
              {step === 1 && (
                <div className="space-y-4">
                  <Input placeholder="https://..." />
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                    <Button className="flex-1" onClick={() => setStep(2)}>Next Step</Button>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Target className="w-8 h-8 text-primary animate-pulse" />
                  </div>
                  <h3>Ready to Verify</h3>
                  <Button className="w-full" onClick={() => setStep(0)}>Submit for Analysis</Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

const ProfilePage = () => {
  return (
    <div className="space-y-6 pb-24 pt-4">
      <Card className="border-none bg-gradient-to-b from-muted/50 to-transparent">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="relative mb-4">
            <Avatar className="w-24 h-24 border-4 border-background shadow-xl">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">TS</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2">
              <RavenMascot variant="idle" />
            </div>
          </div>
          <h2 className="text-xl font-bold">TruthSeeker42</h2>
          <p className="text-sm text-muted-foreground">Level 5 Myth Slayer</p>
          
          <div className="grid grid-cols-3 gap-8 mt-6 w-full max-w-sm text-center">
            <div><div className="font-bold text-xl">127</div><div className="text-xs text-muted-foreground">Myths</div></div>
            <div><div className="font-bold text-xl">15</div><div className="text-xs text-muted-foreground">Streak</div></div>
            <div><div className="font-bold text-xl">8</div><div className="text-xs text-muted-foreground">Badges</div></div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="saved" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="saved">Saved</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="saved" className="mt-4 space-y-4">
           {/* Placeholder for saved content */}
           <div className="text-center py-8 text-muted-foreground text-sm">
             Your saved myths appear here.
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const MythDetail = () => {
    // A simplified detail view
    const navigate = useNavigate();
    return (
        <div className="pt-4 pb-24 space-y-6">
            <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:bg-transparent">
                <ChevronRight className="rotate-180 w-4 h-4"/> Back
            </Button>
            <div className="space-y-4">
                <Badge className="bg-red-500 text-white hover:bg-red-600">Busted</Badge>
                <h1 className="text-3xl font-bold">The Great Wall of China is visible from space</h1>
                
                <Card className="bg-muted/50 border-none">
                    <CardContent className="p-4 flex gap-4">
                        <RavenMascot variant="triumphant" />
                        <div className="text-sm">
                            <span className="font-bold block mb-1">Raven's Take:</span>
                            "Another comforting lie demolished. Astronauts have confirmed repeatedly that it's barely visible, unlike highways and airports."
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

// --- APP SHELL & ROUTING ---

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const navItems = [
    { id: '/', icon: Home, label: 'Home' },
    { id: '/explore', icon: Compass, label: 'Explore' },
    { id: '/submit', icon: PlusCircle, label: 'Submit' },
    { id: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-lg border-t z-50 pb-safe">
      <div className="flex justify-around items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
            const isActive = location.pathname === item.id;
            return (
                <button
                    key={item.id}
                    onClick={() => navigate(item.id)}
                    className={cn(
                        "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors relative",
                        isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    <item.icon className={cn("w-6 h-6 transition-transform", isActive ? "scale-110" : "")} />
                    <span className="text-[10px] font-medium">{item.label}</span>
                    {isActive && (
                        <motion.div 
                            layoutId="nav-indicator"
                            className="absolute -top-[1px] w-12 h-1 bg-primary rounded-full"
                        />
                    )}
                </button>
            )
        })}
      </div>
    </div>
  );
};

const AppContent = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">
      <AnimatedBackground />
      
      <div className="max-w-md mx-auto min-h-screen relative z-10 bg-background/40 backdrop-blur-[2px] shadow-2xl px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/submit" element={<SubmitPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/myth/:id" element={<MythDetail />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </div>

      <BottomNav />
    </div>
  );
};

export default function App() {
  // Mock Data State
  const [myths, setMyths] = useState<Myth[]>([
    { id: '1', title: 'Drinking 8 glasses of water daily is essential', verdict: 'needs-evidence', category: 'Health', votes: 142, comments: 23, bookmarked: false, username: 'TruthSeeker', confidence: 65 },
    { id: '2', title: 'The Great Wall of China is visible from space', verdict: 'busted', category: 'History', votes: 289, comments: 45, bookmarked: true, username: 'MythBuster', confidence: 95 },
    { id: '3', title: 'Eating carrots gives you night vision', verdict: 'busted', category: 'Health', votes: 850, comments: 120, bookmarked: false, username: 'Visionary', confidence: 99 },
    { id: '4', title: 'Humans only use 10% of their brains', verdict: 'busted', category: 'Science', votes: 1200, comments: 340, bookmarked: true, username: 'NeuroNerd', confidence: 98 },
    { id: '5', title: 'Sugar causes hyperactivity in children', verdict: 'needs-evidence', category: 'Health', votes: 432, comments: 89, bookmarked: false, username: 'ParentalGuide', confidence: 60 },
    { id: '6', title: 'Napoleon was short', verdict: 'busted', category: 'History', votes: 670, comments: 55, bookmarked: false, username: 'HistoryBuff', confidence: 92 },
    { id: '7', title: 'Bulls are enraged by the color red', verdict: 'busted', category: 'Science', votes: 340, comments: 28, bookmarked: false, username: 'FactFinder', confidence: 96 },
    { id: '8', title: 'Vikings wore horned helmets', verdict: 'busted', category: 'History', votes: 560, comments: 76, bookmarked: true, username: 'NorseMyth', confidence: 97 },
    { id: '9', title: 'Goldfish have a 3-second memory', verdict: 'busted', category: 'Science', votes: 890, comments: 112, bookmarked: false, username: 'BioGeek', confidence: 94 },
    { id: '10', title: 'Cracking knuckles causes arthritis', verdict: 'busted', category: 'Health', votes: 1500, comments: 230, bookmarked: true, username: 'KnuckleCracker', confidence: 99 },
    { id: '11', title: 'Lightning never strikes the same place twice', verdict: 'busted', category: 'Science', votes: 780, comments: 90, bookmarked: false, username: 'StormChaser', confidence: 98 },
    { id: '12', title: 'Bats are blind', verdict: 'busted', category: 'Science', votes: 450, comments: 45, bookmarked: false, username: 'BatMan', confidence: 95 },
  ]);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleVote = (id: string) => {
    setMyths(prev => prev.map(m => m.id === id ? { ...m, votes: m.votes + 1 } : m));
  };
  
  const toggleBookmark = (id: string) => {
    setMyths(prev => prev.map(m => m.id === id ? { ...m, bookmarked: !m.bookmarked } : m));
  };

  return (
    <AppContext.Provider value={{ myths, toggleVote, toggleBookmark, searchQuery, setSearchQuery }}>
      <Router>
        <AppContent />
      </Router>
    </AppContext.Provider>
  );
}