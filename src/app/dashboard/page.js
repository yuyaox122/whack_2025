'use client';

import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import BubbleMap from "@/components/ui/bubble-map";
import ExpandableCard from "@/components/ui/expandable-card";
import { StaggeredContainer, StaggeredItem, FadeInUp, SlideInFromLeft, SlideInFromRight } from "@/components/ui/page-transition";
import Link from "next/link";
import { useState } from "react";

export default function Dashboard() {
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' or 'bubble'
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCardOpen, setIsCardOpen] = useState(false);

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setIsCardOpen(true);
  };

  const handleCloseCard = () => {
    setIsCardOpen(false);
    setSelectedItem(null);
  };
  const items = [
    {
      title: "The Dawn of Innovation",
      description: "Explore the birth of groundbreaking ideas and inventions.",
      header: <div className="h-32 w-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-blue-500 rounded-full"></div>,
      value: 120,
      category: "Innovation",
      color: "#8b5cf6",
    },
    {
      title: "The Digital Revolution",
      description: "Dive into the transformative power of technology.",
      header: <div className="h-32 w-full bg-gradient-to-r from-green-500 to-blue-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-green-500 rounded-full"></div>,
      value: 180,
      category: "Technology",
      color: "#10b981",
    },
    {
      title: "The Art of Design",
      description: "Discover the beauty of thoughtful and functional design.",
      header: <div className="h-32 w-full bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-yellow-500 rounded-full"></div>,
      value: 150,
      category: "Design",
      color: "#f59e0b",
    },
    {
      title: "The Power of Communication",
      description: "Understand the impact of effective communication in our lives.",
      header: <div className="h-32 w-full bg-gradient-to-r from-red-500 to-pink-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-red-500 rounded-full"></div>,
      value: 200,
      category: "Communication",
      color: "#ef4444",
    },
    {
      title: "The Pursuit of Knowledge",
      description: "Join the quest for understanding and enlightenment.",
      header: <div className="h-32 w-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-indigo-500 rounded-full"></div>,
      value: 160,
      category: "Education",
      color: "#6366f1",
    },
    {
      title: "The Joy of Creation",
      description: "Experience the thrill of bringing ideas to life.",
      header: <div className="h-32 w-full bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-teal-500 rounded-full"></div>,
      value: 140,
      category: "Creativity",
      color: "#14b8a6",
    },
    {
      title: "The Spirit of Adventure",
      description: "Embark on exciting journeys and thrilling discoveries.",
      header: <div className="h-32 w-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-lg"></div>,
      icon: <div className="h-8 w-8 bg-violet-500 rounded-full"></div>,
      value: 170,
      category: "Adventure",
      color: "#a855f7",
    },
  ];

  // Transform items for bubblemap
  const bubbleData = items.map((item, index) => ({
    id: index.toString(),
    title: item.title,
    description: item.description,
    value: item.value,
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

        {/* Expandable Card */}
        <ExpandableCard
          item={selectedItem}
          isOpen={isCardOpen}
          onClose={handleCloseCard}
        />
    </div>
  );
}
