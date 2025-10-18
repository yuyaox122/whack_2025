'use client';

import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import BubbleMap from "../../components/ui/bubble-map";
import { StaggeredContainer, StaggeredItem, FadeInUp, SlideInFromLeft, SlideInFromRight } from "../../components/ui/page-transition";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' or 'bubble'
  
  // Mock data for development
  const items = [
    {
      id: '1',
      title: 'Global Climate Accord Reached',
      description: 'Leaders from around the world signed a landmark agreement to combat climate change.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-green-500/40 to-green-600/80">
          <div className="text-white/80 font-semibold text-lg">Environment</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-green-500">
          E
        </div>
      ),
      category: 'Environment',
      color: '#10b981',
      relevance_score: 9.2,
      trending_score: 8.5,
      keywords: ['climate', 'accord', 'global'],
      sources_count: 15,
    },
    {
      id: '2',
      title: 'New AI Breakthrough in Healthcare',
      description: 'Researchers developed an AI model that can predict disease outbreaks with high accuracy.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-blue-500/40 to-blue-600/80">
          <div className="text-white/80 font-semibold text-lg">Technology</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-blue-500">
          T
        </div>
      ),
      category: 'Technology',
      color: '#3b82f6',
      relevance_score: 9.5,
      trending_score: 9.1,
      keywords: ['AI', 'healthcare', 'breakthrough'],
      sources_count: 22,
    },
    {
      id: '3',
      title: 'Economic Stimulus Package Approved',
      description: 'Government passes a new bill aimed at boosting the national economy.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-yellow-500/40 to-yellow-600/80">
          <div className="text-white/80 font-semibold text-lg">Economics</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-yellow-500">
          E
        </div>
      ),
      category: 'Economics',
      color: '#f59e0b',
      relevance_score: 8.8,
      trending_score: 7.9,
      keywords: ['economy', 'stimulus', 'government'],
      sources_count: 18,
    },
    {
      id: '4',
      title: 'Mars Rover Discovers Ancient Water Traces',
      description: 'NASA\'s latest rover mission finds compelling evidence of past liquid water on Mars.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/40 to-purple-600/80">
          <div className="text-white/80 font-semibold text-lg">Science</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-purple-500">
          S
        </div>
      ),
      category: 'Science',
      color: '#8b5cf6',
      relevance_score: 9.0,
      trending_score: 8.2,
      keywords: ['Mars', 'NASA', 'space'],
      sources_count: 12,
    },
    {
      id: '5',
      title: 'International Sports Tournament Kicks Off',
      description: 'Athletes from various nations gather for the highly anticipated global sports event.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-orange-500/40 to-orange-600/80">
          <div className="text-white/80 font-semibold text-lg">Sports</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-orange-500">
          S
        </div>
      ),
      category: 'Sports',
      color: '#f97316',
      relevance_score: 7.5,
      trending_score: 7.0,
      keywords: ['sports', 'tournament', 'athletes'],
      sources_count: 10,
    },
    {
      id: '6',
      title: 'New Policy on Digital Privacy Announced',
      description: 'Governments worldwide are implementing stricter regulations to protect user data.',
      header: (
        <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-red-500/40 to-red-600/80">
          <div className="text-white/80 font-semibold text-lg">Politics</div>
        </div>
      ),
      icon: (
        <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-red-500">
          P
        </div>
      ),
      category: 'Politics',
      color: '#ef4444',
      relevance_score: 8.7,
      trending_score: 8.0,
      keywords: ['privacy', 'digital', 'policy'],
      sources_count: 14,
    },
  ];

  const handleItemClick = (item) => {
    // Navigate directly to event details page
    window.location.href = `/events/${item.id}`;
  };


  // Transform items for bubblemap
  const bubbleData = items.map((item, index) => ({
    id: index.toString(),
    title: item.title,
    description: item.description,
    value: item.sources_count,
    category: item.category,
    color: item.color,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] dark:from-[#071018] dark:to-[#0f1720]">
        {/* Navbar */}
        <FadeInUp delay={0.1}>
          <nav className="bg-black/80 dark:bg-black/80 backdrop-blur-md border-b border-emerald-500/20 dark:border-emerald-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                <SlideInFromLeft delay={0.2}>
                  <h1 className="text-2xl relative z-20 font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                      <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-1 from-emerald-400 via-lime-300 to-emerald-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className=""></span>
                      </div>
                      <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-emerald-700 via-lime-200 to-emerald-800 py-1">
                        <span className="">Metra</span>
                      </div>
                    </div>
              </h1>
                </SlideInFromLeft>
                <SlideInFromRight delay={0.3}>
              <div className="flex items-center gap-4">
                {/* Layout Toggle Button */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      layoutMode === 'grid'
                            ? 'bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 text-white shadow-lg'
                            : 'text-emerald-300 dark:text-emerald-400 hover:text-emerald-200 dark:hover:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Grid
                  </button>
                  <button
                    onClick={() => setLayoutMode('bubble')}
                    className={`flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      layoutMode === 'bubble'
                            ? 'bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 text-white shadow-lg'
                            : 'text-emerald-300 dark:text-emerald-400 hover:text-emerald-200 dark:hover:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                    </svg>
                    Bubble
                  </button>
                </div>
                    <div className="w-px h-6 bg-emerald-500/30 dark:bg-emerald-500/30 opacity-50"></div>
                <Link 
                  href="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-300 dark:text-emerald-400 hover:text-emerald-200 dark:hover:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10 rounded-lg transition-all duration-200"
                >
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
                    />
                  </svg>
                  Home
                </Link>
              </div>
                </SlideInFromRight>
            </div>
          </div>
        </nav>
        </FadeInUp>

        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Grid Layout */}
            <div className={layoutMode === 'grid' ? 'block' : 'hidden'}>
              <StaggeredContainer>
              <BentoGrid className="max-w-4xl mx-auto">
                {items.map((item, i) => (
                    <StaggeredItem key={i} delay={i * 0.1}>
                  <div
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer"
                  >
                    <BentoGridItem
                      title={item.title}
                      description={item.description}
                      header={item.header}
                      icon={item.icon}
                      className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                    />
                  </div>
                    </StaggeredItem>
                ))}
              </BentoGrid>
              </StaggeredContainer>
            </div>

            {/* Bubble Layout */}
            <div className={layoutMode === 'bubble' ? 'block' : 'hidden'}>
              <StaggeredContainer>
                <StaggeredItem>
              <div className="flex flex-col items-center">
                    <div className="bg-black/40 dark:bg-black/40 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-emerald-500/20 dark:border-emerald-500/20">
                  <BubbleMap
                    data={bubbleData}
                    width={800}
                    height={600}
                    onItemClick={handleItemClick}
                  />
                </div>
              </div>
                </StaggeredItem>
              </StaggeredContainer>
            </div>
          </div>
        </div>

        {/* Footer with Source List Button */}
        <div className="mt-8 mb-16 flex justify-center bg-gradient-to-br from-[#071018] to-[#0f1720] min-h-32">
          <FadeInUp delay={0.3}>
            <Link
              href="/sources"
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 text-white rounded-lg hover:from-emerald-500 hover:via-lime-300 hover:to-emerald-600 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Source List
            </Link>
          </FadeInUp>
        </div>


    </div>
  );
}