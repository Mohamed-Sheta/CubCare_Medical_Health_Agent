from ddgs import DDGS

def web_search(query: str, max_results: int = 3) -> list[dict]:
    """
    Search the web using DuckDuckGo.

    Args:
        query: The search query.
        max_results: Maximum number of results to return.

    Returns:
        A list of search results.
    """

    if not query or not query.strip():
        return []

    max_results = max(1, min(max_results, 10))

    try:
        results = []

        with DDGS() as ddgs:
            search_results = ddgs.text(query=query.strip(), max_results=max_results)

            for result in search_results:
                results.append(
                    {
                        "title": result.get("title"),
                        "url": result.get("href"),
                        "snippet": result.get("body"),
                    }
                )

        return results

    except Exception as e:
        return [
            {
                "error": f"Web search failed: {str(e)}"
            }
        ]