'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { StaggeredContainer, StaggeredItem, FadeInUp } from "../../components/ui/page-transition";

export default function SourcesPage() {
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [useMockData, setUseMockData] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // Mock data for development (until FastAPI is connected)
  const mockSources = [
    {
      id: 'src1',
      name: 'The New York Times',
      url: 'nytimes.com',
      credibility_score: 9.2,
      engagement_score: 8.7,
      bias_score: 7.8,
      sentiment_score: 6.9,
      article_title: 'Breaking News: Global Summit Concludes',
      article_url: 'nytimes.com/article1',
      published_at: '2024-01-15T10:30:00Z',
      category: 'Politics'
    },
    {
      id: 'src2',
      name: 'BBC News',
      url: 'bbc.com',
      credibility_score: 9.5,
      engagement_score: 8.9,
      bias_score: 8.1,
      sentiment_score: 7.2,
      article_title: 'Analysis: Economic Impact of New Policies',
      article_url: 'bbc.com/article2',
      published_at: '2024-01-14T15:45:00Z',
      category: 'Economics'
    },
    {
      id: 'src3',
      name: 'Reuters',
      url: 'reuters.com',
      credibility_score: 9.8,
      engagement_score: 8.4,
      bias_score: 8.7,
      sentiment_score: 7.5,
      article_title: 'Tech Giant Announces New AI Initiative',
      article_url: 'reuters.com/article3',
      published_at: '2024-01-13T09:15:00Z',
      category: 'Technology'
    },
    {
      id: 'src4',
      name: 'The Guardian',
      url: 'theguardian.com',
      credibility_score: 8.9,
      engagement_score: 8.2,
      bias_score: 7.2,
      sentiment_score: 6.8,
      article_title: 'Environmental Concerns Rise Amidst Climate Change',
      article_url: 'theguardian.com/article4',
      published_at: '2024-01-12T14:20:00Z',
      category: 'Environment'
    },
    {
      id: 'src5',
      name: 'CNN',
      url: 'cnn.com',
      credibility_score: 8.7,
      engagement_score: 9.1,
      bias_score: 6.5,
      sentiment_score: 7.8,
      article_title: 'Political Tensions Escalate in Region',
      article_url: 'cnn.com/article5',
      published_at: '2024-01-11T11:30:00Z',
      category: 'Politics'
    },
    {
      id: 'src6',
      name: 'Associated Press',
      url: 'ap.org',
      credibility_score: 9.6,
      engagement_score: 8.3,
      bias_score: 9.1,
      sentiment_score: 7.9,
      article_title: 'International Trade Agreement Reached',
      article_url: 'ap.org/article6',
      published_at: '2024-01-10T16:45:00Z',
      category: 'Economics'
    },
    {
      id: 'src7',
      name: 'Bloomberg',
      url: 'bloomberg.com',
      credibility_score: 9.3,
      engagement_score: 8.8,
      bias_score: 8.4,
      sentiment_score: 7.1,
      article_title: 'Market Analysis: Stock Prices Surge',
      article_url: 'bloomberg.com/article7',
      published_at: '2024-01-09T13:15:00Z',
      category: 'Economics'
    },
    {
      id: 'src8',
      name: 'Nature',
      url: 'nature.com',
      credibility_score: 9.9,
      engagement_score: 7.8,
      bias_score: 9.5,
      sentiment_score: 8.2,
      article_title: 'Breakthrough in Quantum Computing Research',
      article_url: 'nature.com/article8',
      published_at: '2024-01-08T10:00:00Z',
      category: 'Science'
    }
  ];

  useEffect(() => {
    const fetchSources = async () => {
      setLoading(true);
      setError(null);
      
      try {
        if (useMockData) {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 500));
          setSources(mockSources);
        } else {
          // Real FastAPI call
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/sources`);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setSources(data.sources || data);
        }
      } catch (err) {
        setError(err.message);
        // Fallback to mock data on error
        setSources(mockSources);
      } finally {
        setLoading(false);
      }
    };

    fetchSources();
  }, [useMockData]);

  const getScoreColor = (score) => {
    if (score > 8) return 'text-green-400';
    if (score > 6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score > 8) return 'bg-green-500/20';
    if (score > 6) return 'bg-yellow-500/20';
    return 'bg-red-500/20';
  };

  const toggleDataSource = () => {
    setUseMockData(!useMockData);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitSource = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      if (useMockData) {
        // Mock submission - just add to local state
        const newSource = {
          id: `src${Date.now()}`,
          name: formData.name,
          url: formData.url,
          credibility_score: 7.5,
          engagement_score: 6.8,
          bias_score: 7.2,
          sentiment_score: 6.9,
          article_title: formData.description || 'User Added Source',
          article_url: formData.url,
          published_at: new Date().toISOString(),
          category: 'User Added'
        };
        setSources(prev => [newSource, ...prev]);
      } else {
        // Real API submission
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/sources`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: formData.name,
            url: formData.url,
            description: formData.description
          })
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const newSource = await response.json();
        setSources(prev => [newSource, ...prev]);
      }
      
      // Reset form and close modal
      setFormData({ name: '', url: '', description: '' });
      setShowAddForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const closeAddForm = () => {
    setShowAddForm(false);
    setFormData({ name: '', url: '', description: '' });
  };

  const handleDeleteSource = async (sourceId) => {
    if (!confirm('Are you sure you want to delete this source?')) {
      return;
    }

    try {
      if (useMockData) {
        // Mock deletion - just remove from local state
        setSources(prev => prev.filter(source => source.id !== sourceId));
      } else {
        // Real API deletion
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/sources/${sourceId}`, {
          method: 'DELETE'
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        setSources(prev => prev.filter(source => source.id !== sourceId));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-white/80">Loading sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#071018] to-[#0f1720] p-8">
      <FadeInUp delay={0.1}>
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">Source List</h1>
              <p className="text-white/80">All news sources and their credibility metrics</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDataSource}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
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
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 text-white rounded-lg hover:from-emerald-500 hover:via-lime-300 hover:to-emerald-600 transition-all duration-300 font-semibold"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </div>

          {/* Status Banner */}
          {useMockData && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 text-center">
                <strong>Development Mode:</strong> Using mock data. Connect your FastAPI backend to see real sources.
              </p>
            </div>
          )}

          {/* Sources Grid */}
          <StaggeredContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sources.map((source, index) => (
              <StaggeredItem key={source.id} delay={index * 0.1}>
                <div className="bg-black/90 backdrop-blur-md rounded-xl border border-white/20 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 group relative">
                  {/* Delete Button - appears when mouse gets close to bottom right */}
                  <button
                    onClick={() => handleDeleteSource(source.id)}
                    className="absolute bottom-3 right-3 w-6 h-6 bg-red-500/20 hover:bg-red-500/40 border border-red-500/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10"
                    title="Delete source"
                  >
                    <svg className="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                  
                  {/* Source Header */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-white truncate">{source.name}</h3>
                    <span className="text-xs bg-white/10 text-white/70 px-2 py-1 rounded-full">
                      {source.category}
                    </span>
                  </div>

                  {/* Article Info */}
                  <div className="mb-4">
                    <h4 className="text-white/90 font-medium mb-2 line-clamp-2">{source.article_title}</h4>
                    <a 
                      href={`https://${source.url}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-emerald-400 hover:text-emerald-300 text-sm underline"
                    >
                      {source.url}
                    </a>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className={`${getScoreBg(source.credibility_score)} rounded-lg p-3`}>
                      <p className="text-white/70 text-xs">Credibility</p>
                      <p className={`${getScoreColor(source.credibility_score)} font-bold text-lg`}>
                        {source.credibility_score}
                      </p>
                    </div>
                    <div className={`${getScoreBg(source.engagement_score)} rounded-lg p-3`}>
                      <p className="text-white/70 text-xs">Engagement</p>
                      <p className={`${getScoreColor(source.engagement_score)} font-bold text-lg`}>
                        {source.engagement_score}
                      </p>
                    </div>
                    <div className={`${getScoreBg(source.bias_score)} rounded-lg p-3`}>
                      <p className="text-white/70 text-xs">Bias Score</p>
                      <p className={`${getScoreColor(source.bias_score)} font-bold text-lg`}>
                        {source.bias_score}
                      </p>
                    </div>
                    <div className={`${getScoreBg(source.sentiment_score)} rounded-lg p-3`}>
                      <p className="text-white/70 text-xs">Sentiment</p>
                      <p className={`${getScoreColor(source.sentiment_score)} font-bold text-lg`}>
                        {source.sentiment_score}
                      </p>
                    </div>
                  </div>

                  {/* Published Date */}
                  <p className="text-white/60 text-sm">
                    Published: {new Date(source.published_at).toLocaleDateString()}
                  </p>
                </div>
              </StaggeredItem>
            ))}
            
            {/* Add Source Button - placed at the bottom */}
            <StaggeredItem key="add-source" delay={sources.length * 0.1}>
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-black/90 backdrop-blur-md rounded-xl border-2 border-dashed border-emerald-500/50 p-6 hover:border-emerald-400 hover:bg-emerald-500/10 transition-all duration-300 min-h-[300px] flex flex-col items-center justify-center group"
              >
                <div className="text-6xl text-emerald-500 group-hover:text-emerald-400 transition-colors duration-300 mb-4">
                  +
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Add New Source</h3>
                <p className="text-white/70 text-center">Click to add a new news source to the system</p>
              </button>
            </StaggeredItem>
          </StaggeredContainer>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-white/60">
              Showing {sources.length} sources • {useMockData ? 'Mock data for development' : 'Live data from FastAPI'}
            </p>
          </div>
        </div>
      </FadeInUp>

      {/* Add Source Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-black/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Source</h2>
                <button
                  onClick={closeAddForm}
                  className="text-white/60 hover:text-white text-2xl font-bold"
                >
                  ×
                </button>
              </div>
              
              <form onSubmit={handleSubmitSource} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-white/80 text-sm font-medium mb-2">
                    Source Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g., The New York Times"
                  />
                </div>
                
                <div>
                  <label htmlFor="url" className="block text-white/80 text-sm font-medium mb-2">
                    Website URL *
                  </label>
                  <input
                    type="url"
                    id="url"
                    name="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                    placeholder="e.g., nytimes.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-white/80 text-sm font-medium mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    placeholder="Brief description of the source..."
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeAddForm}
                    className="px-6 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 bg-gradient-to-r from-emerald-600 via-lime-400 to-emerald-500 text-white rounded-lg hover:from-emerald-500 hover:via-lime-300 hover:to-emerald-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? 'Adding...' : 'Add Source'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
