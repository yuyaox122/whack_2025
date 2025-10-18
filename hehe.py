from perigon import V1Api, ApiClient

# Create client with API key
api = V1Api(ApiClient(api_key="5647315f-9344-4700-8a9a-43cfcf8685db"))

# Alternative: environment variable or callable
# api = V1Api(ApiClient(api_key=os.environ["PERIGON_API_KEY"]))

# articles = api.search_articles(q="artificial intelligence", size = 5)

# print(articles.num_results, articles.articles[0].title)


# journalist = api.get_journalist_by_id(id="123456")

stories = api.search_stories(q="trump", size = 5)
# print(stories)
# print(stories.results[3])
print("Stories: ",stories)
# print("Results: ", stories.results[0].source)
print("First, name: " , stories.results[0].name)
# print(stories.results[1].summary)
print("The Summary Reference: ", stories.results[0].summary_references)
print(stories.results[0].selected_articles)

# for story in stories:
    # story_id = story["story_id"]
    # article_refs = story["articles"]
articles = api.search_articles(article_id=stories.results[0].summary_references[4])
print("Article: ", articles)