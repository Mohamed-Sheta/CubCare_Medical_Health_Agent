from src.stores.llm.providers import GroqAiProvider
from src.helpers import Settings
from src.stores.llm.enums import LLMEnum

class LLMProviderFactory:
    def __init__(self, app_settings: Settings):
        self.app_settings = app_settings

    def create(self, provider: str):
        if provider == LLMEnum.GROQAI.value:
            return GroqAiProvider(
                api_key= self.app_settings.GROQ_API_KEY,
                default_input_max_characters=self.app_settings.DEFAULT_INPUT_MAX_CHARACTERS,
                default_output_max_characters=self.app_settings.DEFAULT_OUTPUT_MAX_CHARACTERS,
                default_generation_temperature=self.app_settings.DEFAULT_GENERATION_TEMPERATURE
            )
        else:
            return None