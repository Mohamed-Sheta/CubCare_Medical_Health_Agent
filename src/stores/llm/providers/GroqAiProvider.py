from src.stores.llm import LLMInterface
from src.stores.llm.enums import GroqAiEnum
from src.helpers.config import Settings
from src.stores.llm.guardrails import validateInput, validateOutput
from langchain_huggingface import HuggingFaceEmbeddings
from groq import AsyncGroq
import logging
from typing import Union, List
from src.stores.llm.mcp import MCPClient
import json


class GroqAiProvider(LLMInterface):
    def __init__(
        self,
        api_key,
        default_input_max_characters: int = 5000,
        default_output_max_characters: int = 2000,
        default_generation_temperature: float = 0.1,
    ):
        super().__init__()
        self.api_key = api_key
        self.default_input_max_characters = default_input_max_characters
        self.default_output_max_characters = default_output_max_characters
        self.default_generation_temperature = default_generation_temperature

        self.embedding_model_name = None
        self.generation_model_name = None
        self.embedding_size = None

        self.embedding_client = None  # client fo embedding
        self.client = None  # client for generation

        self.mcp_server_url = Settings().MCP_SERVER_URL
        self.mcp_client = MCPClient(server_url=self.mcp_server_url)

        self.enums = GroqAiEnum
        self.logger = logging.getLogger(__name__)

    def set_embedding_model(self, model_name: str, embedding_size: int):
        self.embedding_model_name = model_name
        self.embedding_size = embedding_size

        self.embedding_client = HuggingFaceEmbeddings(
            model_name=self.embedding_model_name
        )

    def set_generation_model(self, model_name: str):
        self.generation_model_name = model_name

        self.client = AsyncGroq(
            api_key=self.api_key,
        )

    def embed_text(self, text: Union[str, List[str]], document_type: str):
        if not self.embedding_model_name:
            self.logger.error("Embedding model for GroqAI was not set")
            return None

        if not self.embedding_client:
            self.logger.error(
                "Embedding model wrapper for GroqAiProvider was not initialized or set."
            )
            return None

        try:
            if isinstance(text, str):
                embedding = self.embedding_client.embed_query(text)
                return [embedding] if embedding else None

            if isinstance(text, list):
                embeddings = self.embedding_client.embed_documents(text)
                return embeddings if embeddings else None

        except Exception as e:
            self.logger.error(f"Error while embedding text with GroqAi model: {str(e)}")
            return None

    async def generate_text(
        self,
        prompt: str,
        chat_history: list | None = None,
        max_output_token: int = None,
        temperature: float = None,
    ):
        if not self.generation_model_name:
            self.logger.error("Generating model for GroqAI was not set")
            return None

        if not self.client:
            self.logger.error(
                "Generating model wrapper for GroqAiProvider "
                "was not initialized or set."
            )
            return None

        if chat_history is None:
            chat_history = []

        if max_output_token is None:
            max_output_token = self.default_output_max_characters

        if temperature is None:
            temperature = self.default_generation_temperature

        user_message = self.construct_prompt(
            role=GroqAiEnum.USER.value,
            prompt=prompt,
        )

        # Input Guardrail
        input_verdict = validateInput(user_message)

        if not input_verdict.safe:
            self.logger.warning(f"Input Guardrail triggered: {input_verdict.reason}")
            return input_verdict.refusal_message

        chat_history.append(user_message)

        try:
            # Get MCP tool definition
            mcp_tools = await self.mcp_client.get_tools()

            response = await self.client.chat.completions.create(
                model=self.generation_model_name,
                messages=chat_history,
                tools=mcp_tools if mcp_tools else None,
                max_tokens=max_output_token,
                temperature=temperature,
            )

            message = response.choices[0].message

            # Model does NOT need web search
            if not message.tool_calls:
                model_response = message.content

                if not model_response:
                    return None

                output_verdict = validateOutput(model_response)

                if not output_verdict.safe:
                    self.logger.warning(
                        f"Output Guardrail triggered: {output_verdict.reason}"
                    )
                    return output_verdict.fallback_response

                return output_verdict.sanitized_output or model_response

            # Model needs web search
            tool_call = message.tool_calls[0]
            arguments = json.loads(tool_call.function.arguments)

            query = arguments["query"]

            self.logger.warning(f"Executing web search: {query}")

            search_result = await self.mcp_client.call_tool(
                tool_name=tool_call.function.name,
                arguments=arguments,
            )

            # Add model's tool request to conversation
            chat_history.append(message.model_dump(exclude_none=True))

            # Add search result to conversation
            chat_history.append(
                {
                    "role": "tool",
                    "tool_call_id": tool_call.id,
                    "content": json.dumps(search_result)
                    if isinstance(search_result, (dict, list))
                    else str(search_result),
                }
            )

            # Ask Groq for final answer
            response = await self.client.chat.completions.create(
                model=self.generation_model_name,
                messages=chat_history,
                max_tokens=max_output_token,
                temperature=temperature,
            )

            model_response = response.choices[0].message.content

            if not model_response:
                return None

            # Output Guardrail
            output_verdict = validateOutput(model_response)

            if not output_verdict.safe:
                self.logger.warning(
                    f"Output Guardrail triggered: {output_verdict.reason}"
                )
                return output_verdict.fallback_response

            return output_verdict.sanitized_output or model_response

        except Exception as e:
            self.logger.error(f"Error during text generation: {str(e)}")
            return None

    async def generate_text_stream(
        self,
        prompt: str,
        chat_history: list | None = None,
        max_output_token: int = None,
        temperature: float = None,
    ):
        if not self.generation_model_name:
            self.logger.error("Generating model for GroqAI was not set")
            return

        if not self.client:
            self.logger.error(
                "Generating model wrapper for GroqAiProvider "
                "was not initialized or set."
            )
            return

        if chat_history is None:
            chat_history = []

        if max_output_token is None:
            max_output_token = self.default_output_max_characters

        if temperature is None:
            temperature = self.default_generation_temperature

        user_message = self.construct_prompt(
            role=GroqAiEnum.USER.value,
            prompt=prompt,
        )

        # Input Guardrail
        input_verdict = validateInput(user_message)

        if not input_verdict.safe:
            self.logger.warning(f"Input Guardrail triggered: {input_verdict.reason}")
            yield input_verdict.refusal_message
            return

        chat_history.append(user_message)

        try:
            # Get MCP tool definition
            mcp_tools = await self.mcp_client.get_tools()

            stream = await self.client.chat.completions.create(
                model=self.generation_model_name,
                messages=chat_history,
                tools=mcp_tools if mcp_tools else None,
                max_tokens=max_output_token,
                temperature=temperature,
                stream=True,
            )

            tool_calls_map = {}
            has_tool_calls = False

            async for chunk in stream:
                if not chunk.choices:
                    continue
                delta = chunk.choices[0].delta

                # Check for tool calls
                if delta.tool_calls:
                    has_tool_calls = True
                    for tc in delta.tool_calls:
                        idx = tc.index
                        if idx not in tool_calls_map:
                            tool_calls_map[idx] = {
                                "id": tc.id or "",
                                "name": tc.function.name
                                if tc.function and tc.function.name
                                else "",
                                "arguments": "",
                            }
                        else:
                            if tc.id:
                                tool_calls_map[idx]["id"] += tc.id
                            if tc.function and tc.function.name:
                                tool_calls_map[idx]["name"] += tc.function.name
                        if tc.function and tc.function.arguments:
                            tool_calls_map[idx]["arguments"] += tc.function.arguments

                if delta.content:
                    yield delta.content

            # If tool calls were requested during the stream
            if has_tool_calls and tool_calls_map:
                for idx, tc in tool_calls_map.items():
                    tool_call_id = tc["id"]
                    tool_name = tc["name"]
                    arguments_str = tc["arguments"]
                    arguments = json.loads(arguments_str) if arguments_str else {}

                    query = arguments.get("query", "")
                    self.logger.warning(f"Executing web search: {query}")

                    search_result = await self.mcp_client.call_tool(
                        tool_name=tool_name,
                        arguments=arguments,
                    )

                    # Add model's tool call request to conversation
                    chat_history.append(
                        {
                            "role": "assistant",
                            "tool_calls": [
                                {
                                    "id": tool_call_id,
                                    "type": "function",
                                    "function": {
                                        "name": tool_name,
                                        "arguments": arguments_str,
                                    },
                                }
                            ],
                        }
                    )

                    # Add tool response to conversation
                    chat_history.append(
                        {
                            "role": "tool",
                            "tool_call_id": tool_call_id,
                            "content": json.dumps(search_result)
                            if isinstance(search_result, (dict, list))
                            else str(search_result),
                        }
                    )

                # Stream the final answer after tool results
                second_stream = await self.client.chat.completions.create(
                    model=self.generation_model_name,
                    messages=chat_history,
                    max_tokens=max_output_token,
                    temperature=temperature,
                    stream=True,
                )

                async for chunk in second_stream:
                    if chunk.choices and chunk.choices[0].delta.content:
                        yield chunk.choices[0].delta.content

        except Exception as e:
            self.logger.error(f"Error during streaming text generation: {str(e)}")
            yield f"Error: {str(e)}"

    async def summarize_conversation(self, conversation: str, old_summary: str):
        if not self.generation_model_name:
            self.logger.error("Generating model for GroqAI was not set")
            return None

        if not self.client:
            self.logger.error(
                "Generating model wrapper for GroqAiProvider "
                "was not initialized or set."
            )
            return None

        if old_summary is None:
            old_summary = ""

        try:
            max_output_token = self.default_output_max_characters
            temperature = self.default_generation_temperature
            messages = [
                self.construct_prompt(role=GroqAiEnum.SYSTEM.value, prompt=old_summary),
                self.construct_prompt(
                    role=GroqAiEnum.USER.value, prompt=str(conversation)
                ),
            ]

            response = await self.client.chat.completions.create(
                model=self.generation_model_name,
                messages=messages,
                max_tokens=max_output_token,
                temperature=temperature,
            )

            model_response = response.choices[0].message.content

            if not model_response:
                return None

            return model_response

        except Exception as e:
            self.logger.error(f"Error during text generation: {str(e)}")
            return None

    def process_text(self, text: str):
        text = text.strip()
        return text[: self.default_input_max_characters]

    def construct_prompt(self, role: str, prompt: str):
        return {"role": role, "content": prompt}
