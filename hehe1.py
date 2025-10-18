import os
import requests
import SECRETS

# -----------------------------
# 1. Setup API key and endpoint
# -----------------------------
API_KEY = os.getenv("PERIGON_API_KEY", SECRETS.perigon_key)
URL = "https://api.perigon.io/v1/vector/news/all"

# -----------------------------
# 2. Function to call vector search API
# -----------------------------
def vector_search_news(query, size=5):
    headers = {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "prompt": query,                 # search query
        "limit": size,               # number of results
           # include related articles or not
    }

    resp = requests.post(URL, headers=headers, json=body)

    # Print response if API returns an error
    try:
        resp.raise_for_status()
    except requests.exceptions.HTTPError:
        print("Error response:", resp.text)
        raise

    return resp.json()

# -----------------------------
# 3. Main script to run search
# -----------------------------
if __name__ == "__main__":
    query = "current regulatory risks of artificial intelligence in healthcare"
    results = vector_search_news(query, size=5)

    print(f"Total results returned by API: {len(results.get('results', []))}\n")

    # Safely iterate through articles
    articles = results.get("results", [])
    if not articles:
        print("No articles found for this query.")
    else:
        for i, result in enumerate(articles, start=1):
            article = result.get("data", None)
            if article == None:
                continue
            title = article.get("title", "No title available")
            url = article.get("url", "No URL available")
            published_at = article.get("pubDate", "No date available")
            summary = article.get("short_summary") or article.get("summary") or "No summary available"

            print(f"Article {i}:")
            print(f"  Title       : {title}")
            print(f"  URL         : {url}")
            print(f"  Published at: {published_at}")
            print(f"  Summary     : {summary}")
            print("-" * 60)