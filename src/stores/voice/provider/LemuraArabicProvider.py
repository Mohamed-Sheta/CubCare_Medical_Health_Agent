import os
import wave
import tempfile
import logging
from typing import Optional, Union
import nemo.collections.asr as nemo_asr
from src.stores.voice.VoiceInterface import VoiceInterface

try:
    from pydub import AudioSegment
except ImportError:
    AudioSegment = None


class LemuraArabicProvider(VoiceInterface):
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.max_voice_length = 120  # seconds
        self.model = None

        self.logger = logging.getLogger(__name__)

        if self.model_path:
            self.set_voice_model(self.model_path)

    def set_voice_model(self, model_path: str) -> None:
        if not model_path:
            raise ValueError("Voice AI model path was not provided")

        self.model_path = model_path

        self.logger.info("Loading voice AI model from: %s", model_path)
        self.model = nemo_asr.models.ASRModel.restore_from(model_path)
        self.logger.info("Voice AI model loaded successfully")

    def _get_audio_duration(self, audio_path: str) -> Optional[float]:
        try:
            with wave.open(audio_path, 'rb') as wf:
                frames = wf.getnframes()
                rate = wf.getframerate()
                if rate > 0:
                    return frames / float(rate)
        except Exception:
            pass

        if AudioSegment is not None:
            try:
                audio = AudioSegment.from_file(audio_path)
                return len(audio) / 1000.0
            except Exception as e:
                self.logger.debug("Audio duration check skipped: %s", e)

        return None


    def transcribe(self, audio: Union[str, any]) -> Optional[str]:
        if not self.model:
            self.logger.error("Voice AI model is not loaded. Call set_voice_model first.")
            return None

        temp_file_path = None
        target_path = None

        try:
            # Handle UploadFile or file-like object
            if hasattr(audio, 'file'):
                audio.file.seek(0)
                content = audio.file.read()
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
                    tf.write(content)
                    temp_file_path = tf.name
                target_path = temp_file_path

            elif hasattr(audio, 'read'):
                content = audio.read()
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
                    tf.write(content)
                    temp_file_path = tf.name
                target_path = temp_file_path

            elif isinstance(audio, (bytes, bytearray)):
                with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tf:
                    tf.write(audio)
                    temp_file_path = tf.name
                target_path = temp_file_path

            elif isinstance(audio, str):
                target_path = audio

            else:
                self.logger.error("Unsupported audio input type: %s", type(audio))
                return None

            if not target_path or not os.path.exists(target_path):
                self.logger.error("Audio target path does not exist: %s", target_path)
                return None

            # Max Voice Length Validation
            duration = self._get_audio_duration(target_path)
            if duration is not None and duration > self.max_voice_length:
                self.logger.warning(
                    "Audio file (%.2fs) exceeds maximum permitted length of %ds",
                    duration, self.max_voice_length
                )
                raise ValueError(f"Voice recording exceeds maximum permitted length of {self.max_voice_length} seconds (2 minutes).")

            # Transcription using NeMo ASR
            result = self.model.transcribe([target_path])
            if not result:
                return ""

            # NeMo transcribe returns a list of hypotheses or strings
            first_result = result[0]
            if isinstance(first_result, str):
                return first_result
            elif hasattr(first_result, "text"):
                return first_result.text
            return str(first_result)

        except Exception as e:
            self.logger.error("Error occurred during transcription: %s", e)
            return None

        finally:
            if temp_file_path and os.path.exists(temp_file_path):
                try:
                    os.remove(temp_file_path)
                except Exception as e:
                    self.logger.warning("Failed to remove temp audio file %s: %s", temp_file_path, e)