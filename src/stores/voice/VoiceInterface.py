from abc import ABC, abstractmethod

class VoiceInterface(ABC):
    @abstractmethod
    def set_voice_model(self, model_path: str) -> None:
        """
        Load the voice AI model from a local path.
        """
        pass

    @abstractmethod
    def transcribe(self, audio_path: str) -> str:
        """
        Transcribe a complete audio file into text.
        """
        pass