from mcp.server.mcpserver import MCPServer
from src.stores.llm.mcp.tools import web_search

# Initialize the server using the updated v2 MCPServer class
mcp = MCPServer(name="LLM MCP Server")

@mcp.tool()
def search_web(query: str, max_results: int = 3) -> list[dict]:
    """
    Search the web using DuckDuckGo.

    Use this tool when the user asks for current,
    recent, live, or web-based information.
    """
    return web_search(query=query, max_results=max_results)


if __name__ == "__main__":
    # Transport-specific options like streamable-http are fully supported under run()
    mcp.run(transport="streamable-http")