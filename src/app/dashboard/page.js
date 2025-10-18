'use client';

import { BentoGrid, BentoGridItem } from "../../components/ui/bento-grid";
import BubbleMap from "../../components/ui/bubble-map";
import { StaggeredContainer, StaggeredItem, FadeInUp, SlideInFromLeft, SlideInFromRight } from "../../components/ui/page-transition";
import { TextHoverEffect } from "../../components/ui/text-hover-effect";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";

// Separate component for the add event form to isolate form state
function AddEventForm({ isOpen, onClose, onSubmit, submitting }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({ title: '', description: '', category: '' });
  };

  const handleClose = () => {
    onClose();
    setFormData({ title: '', description: '', category: '' });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#071018] to-[#0f1720] rounded-2xl p-6 sm:p-8 w-full max-w-md border border-emerald-500/20 shadow-2xl">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Add New Event</h2>
          <button
            onClick={handleClose}
            className="text-white/60 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white/80 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 bg-black/40 border border-emerald-500/30 rounded-lg text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors duration-200"
              placeholder="Enter event title"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white/80 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-black/40 border border-emerald-500/30 rounded-lg text-white placeholder-white/40 focus:border-emerald-500 focus:outline-none transition-colors duration-200 resize-none"
              placeholder="Describe the event"
            />
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-white/80 mb-2">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 bg-black/40 border border-emerald-500/30 rounded-lg text-white focus:border-emerald-500 focus:outline-none transition-colors duration-200"
            >
              <option value="">Select a category</option>
              <option value="Environment">Environment</option>
              <option value="Technology">Technology</option>
              <option value="Health">Health</option>
              <option value="Sports">Sports</option>
              <option value="Politics">Politics</option>
              <option value="Economy">Economy</option>
              <option value="Science">Science</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          
          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [layoutMode, setLayoutMode] = useState('grid'); // 'grid' or 'bubble'
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [useMockData, setUseMockData] = useState(true);
  const [bubbleWidth, setBubbleWidth] = useState(800);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Mock data for development
  const mockItems = [
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

  // Set bubble width based on window width
  useEffect(() => {
    const updateBubbleWidth = () => {
      const isMobile = window.innerWidth < 640; // sm breakpoint
      const width = isMobile 
        ? Math.min(window.innerWidth * 0.95, 400) // More width on mobile
        : Math.min(window.innerWidth * 0.98, 2000); // Much wider on desktop
      setBubbleWidth(width);
    };

    // Set initial width
    updateBubbleWidth();

    // Update on window resize
    window.addEventListener('resize', updateBubbleWidth);
    
    return () => {
      window.removeEventListener('resize', updateBubbleWidth);
    };
  }, []);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      
      try {
        if (useMockData) {
          // Use mock data
          setEvents(mockItems);
        } else {
          // Fetch from FastAPI
          console.log('Fetching events from FastAPI...');
          const response = await fetch('http://127.0.0.1:8000/events');
          console.log('Events response status:', response.status);
          if (!response.ok) {
            throw new Error('Failed to fetch events');
          }
          const result = await response.json();
          console.log('Events API result:', result);
          // Transform API data to match expected format
          const transformedEvents = result.events || result || [];
          setEvents(transformedEvents);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        // Fallback to mock data on error
        setEvents(mockItems);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [useMockData]);

  const handleItemClick = (item) => {
    // Navigate directly to event details page
    window.location.href = `/events/${item.id}`;
  };

  const handleSubmitEvent = async (formData) => {
    setSubmitting(true);
    
    try {
      if (useMockData) {
        // Add to mock data for development
        const newEvent = {
          id: (events.length + 1).toString(),
          title: formData.title,
          description: formData.description,
          header: (
            <div className="h-32 w-full rounded-lg flex items-center justify-center bg-gradient-to-br from-purple-500/40 to-purple-600/80">
              <div className="text-white/80 font-semibold text-lg">{formData.category || 'Custom'}</div>
            </div>
          ),
          icon: (
            <div className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-sm bg-purple-500">
              C
            </div>
          ),
          category: formData.category || 'Custom',
          color: '#8b5cf6',
          relevance_score: 7.0,
          trending_score: 6.5,
          keywords: formData.title.toLowerCase().split(' '),
          sources_count: 5,
        };
        setEvents(prev => [...prev, newEvent]);
      } else {
        // Submit to FastAPI backend
        const response = await fetch('http://127.0.0.1:8000/events', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          // Refresh events after successful submission
          const response = await fetch('http://127.0.0.1:8000/events');
          if (response.ok) {
            const data = await response.json();
            setEvents(data.result || data);
          }
        } else {
          console.error('Failed to add event:', response.status);
        }
      }
      
      // Close modal
      setShowAddEventForm(false);
    } catch (error) {
      console.error('Error adding event:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAddEventForm = () => {
    setShowAddEventForm(false);
  };

  // Stable callback to prevent unnecessary re-renders
  const handleAddEvent = useCallback(() => {
    setShowAddEventForm(true);
  }, []);


  // Transform events for bubblemap (memoized to prevent unnecessary re-renders)
  const bubbleData = useMemo(() => events.map((item, index) => ({
    id: index.toString(),
    title: item.title,
    description: item.description,
    value: item.sources_count,
    category: item.category,
    color: item.color,
  })), [events]);

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] dark:from-[#071018] dark:to-[#0f1720]">
        {/* Navbar */}
        <FadeInUp delay={0.1}>
          <nav className="bg-black/80 dark:bg-black/80 backdrop-blur-md border-b border-emerald-500/20 dark:border-emerald-500/20 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
                <SlideInFromLeft delay={0.2}>
                  <h1 className="text-xl sm:text-2xl relative z-20 font-bold text-center text-black dark:text-white font-sans tracking-tight">
                    <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
                      <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-1 from-emerald-400 via-lime-300 to-emerald-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
                        <span className=""></span>
                      </div>
                      <div className="relative py-1">
                        <TextHoverEffect text="Metra" duration={0.5} />
                      </div>
                    </div>
              </h1>
                </SlideInFromLeft>
                <SlideInFromRight delay={0.3}>
              <div className="flex items-center gap-4">
                {/* Layout Toggle Button */}
                <div className="flex items-center gap-1 sm:gap-2">
                  <button
                    onClick={() => setLayoutMode('grid')}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                      layoutMode === 'grid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-emerald-300 dark:text-emerald-400 hover:text-emerald-200 dark:hover:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span className="hidden sm:inline">Grid</span>
                  </button>
                  <button
                    onClick={() => setLayoutMode('bubble')}
                    className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
                      layoutMode === 'bubble'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'text-emerald-300 dark:text-emerald-400 hover:text-emerald-200 dark:hover:text-emerald-300 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/10'
                    }`}
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="8" />
                    </svg>
                    <span className="hidden sm:inline">Bubble</span>
                  </button>
                </div>
                <button
                  onClick={() => setUseMockData(!useMockData)}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1 sm:gap-2 ${
                    useMockData 
                      ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                      : 'bg-green-500/20 text-green-400 border border-green-500/30'
                  }`}
                >
                  {!useMockData && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                  <span className="hidden sm:inline">{useMockData ? 'Mock Data' : 'Live Data'}</span>
                  <span className="sm:hidden">{useMockData ? 'Mock' : 'Live'}</span>
                </button>
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
            {/* Status Banner */}
            {useMockData && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-400 text-center">
                  <strong>Development Mode:</strong> Using mock data. Connect your FastAPI backend to see real events.
                </p>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                  <p className="text-white/80">Loading events...</p>
                </div>
              </div>
            ) : (
              <>
            {/* Grid Layout */}
            <div className={layoutMode === 'grid' ? 'block' : 'hidden'}>
              <StaggeredContainer>
              <BentoGrid className="max-w-4xl mx-auto px-4 sm:px-0">
                {events.map((item, i) => (
                    <StaggeredItem key={i} delay={i * 0.1}>
                  <div
                    onClick={() => handleItemClick(item)}
                    className="cursor-pointer"
                  >
                    <BentoGridItem
                      title={item.title}
                      description={item.description}
                      header={item.header}
                      className={i === 3 || i === 6 ? "md:col-span-2" : ""}
                    />
                  </div>
                    </StaggeredItem>
                ))}
                
                {/* Add Event Button */}
                <StaggeredItem delay={events.length * 0.1}>
                  <div
                    onClick={handleAddEvent}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200"
                  >
                    <div className="group relative h-full min-h-[250px] sm:min-h-[300px] rounded-xl border border-dashed border-emerald-500/30 bg-black/20 dark:bg-black/20 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center hover:border-emerald-500/60 hover:bg-emerald-500/10 transition-all duration-300">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 group-hover:bg-emerald-500/30 transition-all duration-300 mb-4">
                        <svg className="w-8 h-8 text-emerald-400 group-hover:text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-emerald-300 transition-colors duration-300">
                        Add Event
                      </h3>
                      <p className="text-sm text-white/60 text-center group-hover:text-white/80 transition-colors duration-300">
                        Create a new custom event
                      </p>
                    </div>
                  </div>
                </StaggeredItem>
              </BentoGrid>
              </StaggeredContainer>
            </div>

            {/* Bubble Layout */}
            <div className={layoutMode === 'bubble' ? 'block' : 'hidden'}>
              <StaggeredContainer>
                 <StaggeredItem>
                   <div className="flex flex-col items-center px-4 sm:px-0">
                     <div className="bg-black/40 dark:bg-black/40 backdrop-blur-md rounded-2xl p-4 sm:p-8 shadow-2xl border border-emerald-500/20 dark:border-emerald-500/20 w-full">
                  <BubbleMap
                    data={bubbleData}
                    width={bubbleWidth}
                    height={700}
                    onItemClick={handleItemClick}
                  />
                </div>
              </div>
                 </StaggeredItem>
              </StaggeredContainer>
            </div>
              </>
            )}
          </div>
        </div>

        {/* Footer with Source List and Add Event Buttons */}
        <div className="mt-8 sm:mt-12 mb-8 flex justify-center bg-gradient-to-t from-[#071018] via-[#0a1419] to-transparent min-h-32 sm:min-h-40 px-4">
          <FadeInUp delay={0.3}>
            <div className="flex gap-4">
              <Link
                href="/sources"
                className="px-4 sm:px-6 py-2 sm:py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                Source List
              </Link>
              {layoutMode === 'bubble' && (
                <button
                  onClick={handleAddEvent}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300 font-semibold text-sm sm:text-base flex items-center justify-center"
                  title="Add Event"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              )}
            </div>
          </FadeInUp>
        </div>

        {/* Add Event Form */}
        <AddEventForm
          isOpen={showAddEventForm}
          onClose={closeAddEventForm}
          onSubmit={handleSubmitEvent}
          submitting={submitting}
        />

    </div>

    {/* Team Footer - Outside main container */}
    <p className="text-white/60 text-xs sm:text-sm text-center mt-6 sm:mt-8 mb-8 sm:mb-12 px-4">
      Made with ❤️ from Necirvan, Yuyao, Cindy and Rayan.
    </p>
    </>
  );
}