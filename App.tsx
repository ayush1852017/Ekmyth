import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Submit from './pages/Submit';
import MythDetail from './pages/MythDetail';
import { MythSubmission, VerdictType } from './types';

// Mock Data for initial state
const INITIAL_MYTHS: MythSubmission[] = [
  {
    id: '1',
    title: 'Do Carrots Improve Night Vision?',
    category: 'Health',
    mythClaim: 'Eating large amounts of carrots will give you the ability to see in the dark.',
    factReality: 'While carrots contain Vitamin A which is good for eye health, they cannot give you superhuman night vision. This myth was actually propaganda from WWII to hide the invention of radar.',
    userSources: ['https://www.smithsonianmag.com/arts-culture/a-wwii-propaganda-campaign-popularized-the-myth-that-carrots-help-you-see-in-the-dark-28812484/'],
    submittedAt: 1678886400000,
    author: 'HistoryBuff',
    isVerified: true,
    aiVerdict: VerdictType.BUSTED,
    aiConfidenceScore: 98,
    aiReasoning: 'Historical records confirm the British Royal Air Force started this rumor to mask their use of radar technologies. Biologically, Vitamin A deficiency causes night blindness, but excess does not grant night vision.',
    aiSuggestedSources: [],
    comments: [
      { id: 'c1', author: 'DrVision', text: 'Optometrist here. Can confirm!', timestamp: 1678972800000 }
    ],
    upvotes: 124
  },
  {
    id: '2',
    title: 'The Great Wall of China Visibility',
    category: 'Science',
    mythClaim: 'The Great Wall of China is the only man-made structure visible from space with the naked eye.',
    factReality: 'The Great Wall is very difficult to see from low Earth orbit without aid, and impossible to see from the Moon. Highways and cities are much more visible.',
    userSources: [],
    submittedAt: 1689990000000,
    author: 'SpaceNerd',
    isVerified: true,
    aiVerdict: VerdictType.BUSTED,
    aiConfidenceScore: 95,
    aiReasoning: 'NASA astronauts have repeatedly stated the wall is not visible to the naked eye from orbit due to its color blending with the terrain.',
    aiSuggestedSources: [],
    comments: [],
    upvotes: 89
  }
];

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedMythId, setSelectedMythId] = useState<string | null>(null);
  const [myths, setMyths] = useState<MythSubmission[]>(INITIAL_MYTHS);

  // Load from local storage on mount (simple persistence)
  useEffect(() => {
    const saved = localStorage.getItem('ekmyth_data');
    if (saved) {
      try {
        setMyths(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved myths");
      }
    }
  }, []);

  // Save to local storage on update
  useEffect(() => {
    localStorage.setItem('ekmyth_data', JSON.stringify(myths));
  }, [myths]);

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleMythClick = (id: string) => {
    setSelectedMythId(id);
    navigateTo('detail');
  };

  const handleSubmitMyth = (submission: MythSubmission) => {
    setMyths(prev => [submission, ...prev]);
    navigateTo('home');
  };

  const handleAddComment = (mythId: string, text: string) => {
    setMyths(prev => prev.map(myth => {
      if (myth.id === mythId) {
        return {
          ...myth,
          comments: [
            ...myth.comments,
            {
              id: Date.now().toString(),
              author: 'You', // Simplified auth
              text,
              timestamp: Date.now()
            }
          ]
        };
      }
      return myth;
    }));
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return <Home myths={myths} onMythClick={handleMythClick} />;
      case 'submit':
        return <Submit onSubmit={handleSubmitMyth} onCancel={() => navigateTo('home')} />;
      case 'detail':
        const selectedMyth = myths.find(m => m.id === selectedMythId);
        if (selectedMyth) {
          return (
            <MythDetail 
              myth={selectedMyth} 
              onBack={() => navigateTo('home')} 
              onAddComment={handleAddComment}
            />
          );
        }
        return <Home myths={myths} onMythClick={handleMythClick} />;
      default:
        return <Home myths={myths} onMythClick={handleMythClick} />;
    }
  };

  return (
    <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
      <Navbar activePage={currentPage} onNavigate={navigateTo} />
      <main>
        {renderContent()}
      </main>
      
      <footer className="bg-white border-t border-gray-200 mt-auto py-8 text-center">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Ekmyth. Built for Truth.
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Disclaimer: AI analysis is an assistant tool. Always verify with multiple primary sources.
        </p>
      </footer>
    </div>
  );
};

export default App;