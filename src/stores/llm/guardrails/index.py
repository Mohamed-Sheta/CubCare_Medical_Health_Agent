"""
AI Guardrails Module - Public API Endpoint.
Exposes clean interfaces for input and output validation across the LLM pipeline.
"""

from .constants import (
    GuardrailViolationType,
    MAX_INPUT_LENGTH,
    STANDARD_REFUSAL_MESSAGES,
)
from .inputGuard import (
    InputGuard,
    InputGuardVerdict,
    validateInput,
    validate_input,
)
from .outputGuard import (
    OutputGuard,
    OutputGuardVerdict,
    validateOutput,
    validate_output,
)

__all__ = [
    # Core Validation Functions
    "validateInput",
    "validate_input",
    "validateOutput",
    "validate_output",
    # Guard Classes
    "InputGuard",
    "OutputGuard",
    # Verdict Models
    "InputGuardVerdict",
    "OutputGuardVerdict",
    # Types & Enums
    "GuardrailViolationType",
    "STANDARD_REFUSAL_MESSAGES",
    "MAX_INPUT_LENGTH",
]
