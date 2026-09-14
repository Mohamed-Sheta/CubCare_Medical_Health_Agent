from abc import ABC, abstractmethod
from typing import List, Union

class LLMInterface(ABC):
    @abstractmethod
    def set_embedding_model(self, model_name: str, embedding_size: int):
        pass

    @abstractmethod
    def set_generation_model(self, model_name: str):
        pass

    @abstractmethod
    def embed_text(self, text: Union[str,List[str]], document_type: str):
        pass

    @abstractmethod
    async def generate_text(self, prompt: str, chat_history: list | None = None, max_output_token: int = None, temperature: float = None):
        pass

    @abstractmethod
    async def generate_text_stream(self, prompt: str, chat_history: list | None = None, max_output_token: int = None, temperature: float = None):
        pass

    @abstractmethod
    async def summarize_conversation(self, conversation: str, old_summary: str):
        pass
    
    @abstractmethod
    def construct_prompt(self, role: str, prompt: str):
        pass