import React, { useState, useMemo } from 'react';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  category: 'Economics' | 'Technical' | 'History' | 'Privacy';
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  color: string;
  icon: string;
  url: string;
  coverUrl: string;
}

const BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Bitcoin Standard',
    author: 'Saifedean Ammous',
    description: 'The definitive guide to the economics of Bitcoin. Understand why hard money is essential for civilization and how Bitcoin solves the flaws of central banking.',
    category: 'Economics',
    difficulty: 'Beginner',
    color: 'from-orange-500 to-red-600',
    icon: 'savings',
    url: 'https://saifedean.com/tbs',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781119473862-L.jpg'
  },
  {
    id: '2',
    title: 'Mastering Bitcoin',
    author: 'Andreas M. Antonopoulos',
    description: 'The technical bible for developers. Learn how the blockchain, keys, addresses, and scripts work at the byte level. Mandatory for engineers.',
    category: 'Technical',
    difficulty: 'Expert',
    color: 'from-blue-500 to-indigo-600',
    icon: 'terminal',
    url: 'https://github.com/bitcoinbook/bitcoinbook',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781491954386-L.jpg'
  },
  {
    id: '3',
    title: 'The Blocksize War',
    author: 'Jonathan Bier',
    description: 'A gripping history of the 2015-2017 civil war for Bitcoin\'s soul. Understand who controls the protocol: the miners, the companies, or the users?',
    category: 'History',
    difficulty: 'Intermediate',
    color: 'from-slate-500 to-slate-700',
    icon: 'history_edu',
    url: 'https://blog.bitmex.com/the-blocksize-war-chapter-1-first-strike/',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9798620392549-L.jpg'
  },
  {
    id: '4',
    title: 'Grokking Bitcoin',
    author: 'Kalle Rosenbaum',
    description: 'A visual, conceptual guide to Bitcoin\'s architecture. Less code, more diagrams. Perfect for understanding the "Why" behind the "How".',
    category: 'Technical',
    difficulty: 'Intermediate',
    color: 'from-emerald-500 to-teal-600',
    icon: 'schema',
    url: 'https://rosenbaum.se/book/',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781617294631-L.jpg'
  },
  {
    id: '5',
    title: 'Inventing Bitcoin',
    author: 'Yan Pritzker',
    description: 'The best short technical intro. Explain the "Four Pillars" of Bitcoin consensus in under 2 hours of reading.',
    category: 'Technical',
    difficulty: 'Beginner',
    color: 'from-pink-500 to-purple-600',
    icon: 'lightbulb',
    url: 'https://www.swanbitcoin.com/inventing-bitcoin/',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781795604192-L.jpg'
  },
  {
    id: '6',
    title: 'Layered Money',
    author: 'Nik Bhatia',
    description: 'Bitcoin viewed through the lens of the history of money. From gold coins to central bank ledgers to the Lightning Network.',
    category: 'Economics',
    difficulty: 'Beginner',
    color: 'from-amber-500 to-yellow-600',
    icon: 'layers',
    url: 'https://www.layeredmoney.com/',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781736110522-L.jpg'
  },
  {
    id: '7',
    title: 'Programming Bitcoin',
    author: 'Jimmy Song',
    description: 'Build a Bitcoin library from scratch in Python. Validating ECC math, parsing transactions, and creating blocks manually.',
    category: 'Technical',
    difficulty: 'Expert',
    color: 'from-cyan-500 to-blue-600',
    icon: 'code',
    url: 'https://github.com/jimmysong/programmingbitcoin',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781492031499-L.jpg'
  },
  {
    id: '8',
    title: 'Cypherpunks',
    author: 'Julian Assange',
    description: 'Freedom and the Future of the Internet. Contextualizes the privacy wars that birthed Bitcoin.',
    category: 'Privacy',
    difficulty: 'Intermediate',
    color: 'from-gray-700 to-black',
    icon: 'vpn_key',
    url: 'https://www.orbooks.com/catalog/cypherpunks/',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781939293008-L.jpg'
  }
];

export const Resources: React.FC = () => {
  const [filter, setFilter] = useState<string>('All');

  const categories = ['All', 'Technical', 'Economics', 'History', 'Privacy'];
  
  const filteredBooks = filter === 'All' 
    ? BOOKS 
    : BOOKS.filter(b => b.category === filter);

  const stats = useMemo(() => {
      const technicalCount = BOOKS.filter(b => b.category === 'Technical').length;
      const econCount = BOOKS.filter(b => b.category === 'Economics').length;
      const totalAuthors = new Set(BOOKS.map(b => b.author)).size;
      return { technicalCount, econCount, totalAuthors };
  }, []);

  // Pick a random featured book or a specific one
  const featuredBook = BOOKS.find(b => b.id === '2'); // Mastering Bitcoin

  return (
    <div className="flex flex-col h-full bg-background-dark overflow-y-auto custom-scrollbar animate-in fade-in duration-500 p-6 md:p-8">
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
            <div className="size-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
                <span className="material-symbols-outlined text-2xl">library_books</span>
            </div>
            <div>
                <h1 className="text-3xl font-bold text-white font-display">The Signal Library</h1>
                <p className="text-text-muted">Curated high-signal resources for protocol mastery.</p>
            </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/5 rounded-lg text-white"><span className="material-symbols-outlined text-lg">auto_stories</span></div>
                  <span className="text-xs font-bold uppercase text-text-muted">Total Volumes</span>
              </div>
              <span className="text-2xl font-bold text-white">{BOOKS.length}</span>
          </div>
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400"><span className="material-symbols-outlined text-lg">terminal</span></div>
                  <span className="text-xs font-bold uppercase text-text-muted">Technical Docs</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats.technicalCount}</span>
          </div>
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-500/10 rounded-lg text-orange-400"><span className="material-symbols-outlined text-lg">paid</span></div>
                  <span className="text-xs font-bold uppercase text-text-muted">Economics</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats.econCount}</span>
          </div>
          <div className="bg-surface-dark border border-white/5 p-4 rounded-xl flex flex-col justify-between hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400"><span className="material-symbols-outlined text-lg">group</span></div>
                  <span className="text-xs font-bold uppercase text-text-muted">Unique Minds</span>
              </div>
              <span className="text-2xl font-bold text-white">{stats.totalAuthors}</span>
          </div>
      </div>

      {/* Featured Book */}
      {featuredBook && (
          <div className="mb-10 relative group overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-surface-dark to-black">
              <div className="absolute top-0 right-0 p-32 bg-blue-500/10 blur-[100px] rounded-full pointer-events-none"></div>
              <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/3 p-8 flex items-center justify-center relative overflow-hidden bg-black/20">
                        {/* Background Blur of Cover */}
                        <div 
                            className="absolute inset-0 bg-cover bg-center blur-3xl opacity-40 scale-125"
                            style={{ backgroundImage: `url(${featuredBook.coverUrl})` }}
                        ></div>
                        <div className="relative z-10 text-center">
                            <span className="inline-block bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white mb-4 border border-white/10 shadow-xl">Essential Reading</span>
                            <img 
                                src={featuredBook.coverUrl} 
                                alt={featuredBook.title}
                                className="w-32 md:w-40 rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.5)] transform rotate-3 hover:rotate-0 transition-transform duration-500"
                            />
                        </div>
                  </div>
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                      <h3 className="text-2xl md:text-3xl font-bold text-white font-display mb-2">{featuredBook.title}</h3>
                      <p className="text-sm font-medium text-blue-400 mb-4">{featuredBook.author}</p>
                      <p className="text-text-muted leading-relaxed mb-8 max-w-xl">{featuredBook.description}</p>
                      <div className="flex gap-4">
                          <a 
                            href={featuredBook.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="px-6 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center gap-2"
                          >
                              Start Reading
                              <span className="material-symbols-outlined text-lg">arrow_outward</span>
                          </a>
                          <div className="px-4 py-3 border border-white/10 rounded-xl text-white text-sm font-bold flex items-center gap-2">
                              <span className="material-symbols-outlined text-yellow-500 text-lg">star</span>
                              5.0 Signal
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map(cat => (
                <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                        filter === cat 
                            ? 'bg-white text-black border-white' 
                            : 'bg-surface-dark text-text-muted border-white/5 hover:border-white/20 hover:text-white'
                    }`}
                >
                    {cat}
                </button>
            ))}
        </div>
        <div className="hidden md:flex text-xs text-text-muted font-mono uppercase tracking-wider">
            Showing {filteredBooks.length} Resources
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-10">
        {filteredBooks.map((book) => (
            <div 
                key={book.id} 
                className="group bg-surface-dark border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 hover:shadow-2xl transition-all duration-300 flex flex-col h-full"
            >
                {/* Visual Cover */}
                <div className="relative h-48 overflow-hidden bg-black/20 group">
                    {/* Blured Background */}
                    <div 
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 transition-transform duration-700 group-hover:scale-125"
                        style={{ backgroundImage: `url(${book.coverUrl})` }}
                    />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 z-20">
                        <div className="inline-block bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 shadow-lg">
                            {book.category}
                        </div>
                    </div>

                    {/* Actual Cover */}
                    <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
                        <img 
                            src={book.coverUrl} 
                            alt={book.title} 
                            className="h-full w-auto object-contain rounded shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                        />
                    </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white font-display leading-tight mb-1 group-hover:text-primary transition-colors">
                        {book.title}
                    </h3>
                    <p className="text-white/60 text-xs font-medium mb-3">{book.author}</p>
                    
                    <p className="text-text-muted text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                        {book.description}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded border ${
                            book.difficulty === 'Beginner' ? 'bg-success/10 text-success border-success/20' :
                            book.difficulty === 'Intermediate' ? 'bg-warning/10 text-warning border-warning/20' :
                            'bg-error/10 text-error border-error/20'
                        }`}>
                            {book.difficulty}
                        </span>
                        
                        <a 
                            href={book.url} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="flex items-center gap-2 text-xs font-bold text-white hover:text-primary transition-colors group-hover:underline"
                        >
                            Locate
                            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">open_in_new</span>
                        </a>
                    </div>
                </div>
            </div>
        ))}
      </div>

      <div className="mt-auto border-t border-white/5 pt-8 text-center text-text-muted text-xs">
        <p>This library is opinionated. Low-signal content is filtered out.</p>
        <p className="mt-2">Have a suggestion? <span className="text-white cursor-pointer hover:underline">Submit via Nostr</span></p>
      </div>

    </div>
  );
};