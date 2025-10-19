'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { StaggeredContainer, StaggeredItem, FadeInUp } from '../../../components/ui/page-transition';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(false);
  const [findingSources, setFindingSources] = useState(false);
  const [abortController, setAbortController] = useState(null);

  // Mock data for development
  const mockEvent = {
    id: eventId,
    title: 'Global Climate Accord Reached',
    description: 'Leaders from around the world have signed a landmark agreement to combat climate change, setting ambitious targets for carbon reduction and renewable energy adoption.',
    category: 'Environment',
    cluster_size: 15,
    relevance_score: 9.2,
    trending_score: 8.5,
    keywords: ['climate', 'accord', 'global', 'environment'],
    reliability_sources: [
      { name: 'The New York Times', score: 9.5, url: 'nytimes.com' },
      { name: 'BBC News', score: 9.3, url: 'bbc.com' },
      { name: 'Reuters', score: 9.7, url: 'reuters.com' },
      { name: 'Associated Press', score: 9.6, url: 'ap.org' },
      { name: 'The Guardian', score: 8.9, url: 'theguardian.com' }
    ],
    neutrality_sources: [
      { name: 'Reuters', score: 9.8, url: 'reuters.com' },
      { name: 'Associated Press', score: 9.5, url: 'ap.org' },
      { name: 'BBC News', score: 9.2, url: 'bbc.com' },
      { name: 'The New York Times', score: 8.7, url: 'nytimes.com' },
      { name: 'Bloomberg', score: 8.4, url: 'bloomberg.com' }
    ],
    accuracy_sources: [
      { name: 'Nature', score: 9.9, url: 'nature.com' },
      { name: 'Scientific American', score: 9.7, url: 'scientificamerican.com' },
      { name: 'The New York Times', score: 9.4, url: 'nytimes.com' },
      { name: 'BBC News', score: 9.1, url: 'bbc.com' },
      { name: 'Reuters', score: 8.9, url: 'reuters.com' }
    ],
    metric_here_sources: [
      { name: 'Example Source 1', score: 8.5, url: 'example1.com' },
      { name: 'Example Source 2', score: 7.8, url: 'example2.com' },
      { name: 'Example Source 3', score: 8.2, url: 'example3.com' },
      { name: 'Example Source 4', score: 7.9, url: 'example4.com' }
    ],
    created_at: '2024-01-15T10:30:00Z',
    updated_at: '2024-01-15T14:20:00Z'
  };

  useEffect(() => {
    const fetchEventDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (useMockData) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setEvent(mockEvent);
        } else {
          const data = JSON.parse(localStorage.getItem('eventsCache'));

          // Real FastAPI call - get all events and find the matching cluster

          // const data = await response.json();
          
          // Find the event cluster that matches the eventId
          const clusterLabel = data.cluster_labels.find(cl => cl.cluster_id === parseInt(eventId));
          
          if (!clusterLabel) {
            throw new Error('Event not found');
          }
          
          // Get all headlines for this cluster
          const clusterHeadlines = data.headlines.filter(h => h.cluster === parseInt(eventId));
          console.log(clusterHeadlines);
          // Transform the data to match your component's expected format
          const transformedEvent = {
            id: eventId,
            title: clusterLabel.generated_headline,
            description: clusterLabel.generated_headline, // You might want to generate a better description
            category: 'News', // You can categorize based on sentiment or other metrics
            cluster_size: clusterHeadlines.length,
            keywords: [], // Extract from headlines if needed
            // Group sources by metrics - you'll need to calculate these based on your data
            reliability_sources: clusterHeadlines.slice(0, 5).map((h, idx) => ({
              name: h.source_id || `Source ${idx + 1}`,
              score: h.metrics?.reliability || 6.7,
              url: h.link || '#'
            })),
            neutrality_sources: clusterHeadlines.slice(0, 5).map((h, idx) => ({
              name: h.source_id || `Source ${idx + 1}`,
              score: h.sentiment?.neutrality || 6.9,
              url: h.link || '#'
            })),
            accuracy_sources: clusterHeadlines.slice(0, 5).map((h, idx) => ({
              name: h.source_id || `Source ${idx + 1}`,
              score: h.metrics?.accuracy || 7.1,
              url: h.link || '#'
            })),
            metric_here_sources: clusterHeadlines.slice(0, 5).map((h, idx) => ({
              name: h.source_id || `Source ${idx + 1}`,
              score: ((h.metrics?.reliability ||8.10) + (h.sentiment?.neutrality || 9.1) + (h.metrics?.accuracy || 0)) / 3,
              url: h.link || '#'
            })),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          
          setEvent(transformedEvent);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data on error
        setEvent(mockEvent);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventDetail();
    }
  }, [eventId, useMockData]);

  // Cleanup effect to abort ongoing requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  const findMoreSources = async () => {
    if (!event || findingSources) return;
    
    setFindingSources(true);
    
    // Store the AbortController to allow cancellation
    const controller = new AbortController();
    setAbortController(controller);
    
    try {
      const response = await fetch('/api/find-sources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: event.headline ,
          eventId: event.id
        }),
        signal: controller.signal, // Allow cancellation
      });

      if (!response.ok) {
        throw new Error('Failed to find more sources');
      }

      const newSources = await response.json();
      
      // Add new sources to existing sources
      setEvent(prevEvent => ({
        ...prevEvent,
        reliability_sources: [...prevEvent.reliability_sources, ...newSources.reliability_sources],
        engagement_sources: [...prevEvent.engagement_sources, ...newSources.engagement_sources],
        metric_here_sources: [...prevEvent.metric_here_sources, ...newSources.metric_here_sources]
      }));
      
    } catch (error) {
      // Only log error if it's not an abort error
      if (error.name !== 'AbortError') {
        console.error('Error finding more sources:', error);
        // Could add a toast notification here
      }
    } finally {
      setFindingSources(false);
      setAbortController(null);
    }
  };

  const getScoreColor = (score) => {
    if (score > 8.5) return 'text-green-400';
    if (score > 7) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score > 8.5) return 'bg-green-500/20';
    if (score > 7) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white/80">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Event</h2>
          <p className="text-white/80 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Event Not Found</h2>
          <p className="text-white/80 mb-4">The event you are looking for does not exist.</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] p-4 sm:p-8">
      <FadeInUp delay={0.1}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-4xl font-bold text-white mb-2">{event.title}</h1>
              <p className="text-white/80 text-sm sm:text-base">Event ID: {event.id}</p>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={toggleDataSource}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${
                  useMockData 
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                    : 'bg-green-500/20 text-green-400 border border-green-500/30'
                }`}
              >
                {!useMockData && (
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                )}
                <span>{useMockData ? 'Mock Data' : 'Live Data'}</span>
              </button>
              <Link
                href="/dashboard"
                className="px-4 sm:px-6 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300 font-semibold text-sm sm:text-base"
              >
                <span className="hidden sm:inline">← Back to Dashboard</span>
                <span className="sm:hidden">← Back</span>
              </Link>
            </div>
          </div>

          {/* Status Banner */}
          {useMockData && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
              <p className="text-yellow-400 text-center">
                <strong>Development Mode:</strong> Using mock data. Connect your FastAPI backend to see real event details.
              </p>
            </div>
          )}

          {/* Event Description */}
          <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-6 mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Event Description</h2>
            <p className="text-white/80 text-lg leading-relaxed">{event.description}</p>
          </div>

          {/* Metrics Grid */}
          <StaggeredContainer className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
            {/* Reliability Sources */}
            <StaggeredItem delay={0.1}>
              <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  Reliability
                </h3>
                <div className="space-y-3">
                  {event.reliability_sources?.map((source, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-green-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{source.name}</h4>
                        <div className={`${getScoreBg(source.score)} px-3 py-1 rounded-full`}>
                          <span className={`${getScoreColor(source.score)} font-bold text-sm`}>
                            {source.score}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`https://${source.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-400 hover:text-green-300 text-sm underline"
                      >
                        {source.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </StaggeredItem>

            {/* Neutrality Sources */}
            <StaggeredItem delay={0.2}>
              <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  Neutrality
                </h3>
                <div className="space-y-3">
                  {event.neutrality_sources?.map((source, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-blue-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{source.name}</h4>
                        <div className={`${getScoreBg(source.score)} px-3 py-1 rounded-full`}>
                          <span className={`${getScoreColor(source.score)} font-bold text-sm`}>
                            {source.score}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`https://${source.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 text-sm underline"
                      >
                        {source.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </StaggeredItem>

            {/* Accuracy Sources */}
            <StaggeredItem delay={0.3}>
              <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  Accuracy
                </h3>
                <div className="space-y-3">
                  {event.accuracy_sources?.map((source, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-purple-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{source.name}</h4>
                        <div className={`${getScoreBg(source.score)} px-3 py-1 rounded-full`}>
                          <span className={`${getScoreColor(source.score)} font-bold text-sm`}>
                            {source.score}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`https://${source.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-sm underline"
                      >
                        {source.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </StaggeredItem>

            {/* Metric Here Sources */}
            <StaggeredItem delay={0.4}>
              <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4 flex items-center">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                  Overall
                </h3>
                <div className="space-y-3">
                  {event.metric_here_sources?.map((source, index) => (
                    <div key={index} className="bg-white/5 p-4 rounded-lg border border-white/10 hover:border-emerald-500/50 transition-all duration-200">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{source.name}</h4>
                        <div className={`${getScoreBg(source.score)} px-3 py-1 rounded-full`}>
                          <span className={`${getScoreColor(source.score)} font-bold text-sm`}>
                            {source.score}
                          </span>
                        </div>
                      </div>
                      <a 
                        href={`https://${source.url}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                      >
                        {source.url}
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </StaggeredItem>
          </StaggeredContainer>

          {/* Find More Sources Button */}
          <div className="mt-8 text-center">
            <button
              onClick={findMoreSources}
              disabled={findingSources}
              className="inline-flex items-center px-6 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 hover:text-emerald-300 transition-all duration-300 font-semibold text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {findingSources ? (
                <>
                  <svg className="animate-spin w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding Sources...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Find More Sources
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/60">
              Event details • {useMockData ? 'Mock data for development' : 'Live data from FastAPI'}
            </p>
          </div>
        </div>
      </FadeInUp>

    </div>

    {/* Team Footer - Outside main container */}
    <p className="text-white/60 text-xs sm:text-sm text-center mt-6 sm:mt-8 mb-8 sm:mb-12 px-4">
      Made with ❤️ from Necirvan, Yuyao, Cindy and Rayan.
    </p>
    </>
  );
}
