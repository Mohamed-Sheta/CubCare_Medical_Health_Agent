from src.stores.voice.provider import LemuraArabicProvider
from src.stores.voice.enums import VoiceEnum
from src.helpers import Settings


class VoiceProviderFactory:
    def __init__(self, app_settings: Settings):
        self.app_settings = app_settings

    def create(self, provider: str):
        if provider == VoiceEnum.LEMURA_ARABIC.value:
            model_path = self.app_settings.VOICE_MODEL_PATH
            return LemuraArabicProvider(model_path=model_path)
        else:
            return None