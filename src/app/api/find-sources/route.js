import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { query, eventId } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    // Mock response for development
    // In production, this would call your backend API to search for more sources
    const mockNewSources = {
      reliability_sources: [
        { name: 'Reuters', score: 9.1, url: 'reuters.com' },
        { name: 'Associated Press', score: 9.0, url: 'ap.org' },
        { name: 'The Guardian', score: 8.8, url: 'theguardian.com' }
      ],
      engagement_sources: [
        { name: 'Twitter Trending', score: 8.5, url: 'twitter.com' },
        { name: 'Reddit Discussion', score: 7.8, url: 'reddit.com' }
      ],
      metric_here_sources: [
        { name: 'Google Trends', score: 8.2, url: 'trends.google.com' },
        { name: 'Semrush Analytics', score: 7.9, url: 'semrush.com' }
      ]
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return NextResponse.json(mockNewSources);

    // Production implementation would look like this:
    /*
    const response = await fetch(`${process.env.BACKEND_URL}/api/find-sources`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: query,
        event_id: eventId
      }),
    });

    if (!response.ok) {
      throw new Error('Backend API error');
    }

    const data = await response.json();
    return NextResponse.json(data);
    */

  } catch (error) {
    console.error('Error in find-sources API:', error);
    return NextResponse.json(
      { error: 'Failed to find sources' },
      { status: 500 }
    );
  }
}
