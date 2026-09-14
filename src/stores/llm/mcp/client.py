import json
import logging
from typing import Any

from mcp import Client

class MCPClient:
    """
    Client responsible for communicating with an MCP server
    and exposing its tools to an LLM provider.
    """

    def __init__(self,server_url: str, logger: logging.Logger | None = None):
        self.server_url = server_url
        self.logger = logger or logging.getLogger(__name__)


    async def get_tools(self) -> list[dict]:
        """
        Get MCP tools and convert them to Groq/OpenAI-compatible
        tool schemas.
        """
        try:
            async with Client(self.server_url) as client:
                result = await client.list_tools()
                tools = []

                for tool in result.tools:
                    tools.append(
                        {
                            "type": "function",
                            "function": {
                                "name": tool.name,
                                "description": tool.description or "",
                                "parameters": tool.input_schema,
                            }
                        }
                    )

                return tools

        except Exception as e:
            self.logger.error(f"Failed to get MCP tools: {str(e)}")
            return []


    async def call_tool(self,tool_name: str,arguments: dict[str, Any],) -> Any:
        """
        Execute an MCP tool and return its result.
        """
        try:
            async with Client(self.server_url) as client:
                result = await client.call_tool(tool_name,arguments,)

                if result.is_error:
                    self.logger.error(f"MCP tool '{tool_name}' returned an error.")

                return self._extract_result(result)

        except Exception as e:
            self.logger.error(f"Failed to execute MCP tool '{tool_name}': {str(e)}")

            return {"error": str(e)}


    def _extract_result(self, result) -> Any:
        """
        Convert MCP CallToolResult into a JSON-serializable value.
        """
        # Prefer structured content if available
        if getattr(result, "structured_content", None):
            return result.structured_content

        extracted = []

        for content in result.content:
            # TextContent
            if hasattr(content, "text"):
                text = content.text

                try:
                    extracted.append(json.loads(text))
                except (json.JSONDecodeError, TypeError):
                    extracted.append(text)

            else:
                extracted.append(str(content))

        if len(extracted) == 1:
            return extracted[0]

        return extracted