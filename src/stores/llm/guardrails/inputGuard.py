"""
Input Guardrail Engine for Pediatric Medical Assistant.
Provides multi-layered validation, sanitization, and threat detection before LLM invocation.
"""

from dataclasses import dataclass, asdict
import logging
import re
import unicodedata
from typing import Any, Dict, Optional

from .constants import (
    GuardrailViolationType,
    MAX_INPUT_LENGTH,
    PROMPT_INJECTION_PATTERNS,
    SYSTEM_LEAK_PATTERNS,
    DATABASE_INJECTION_PATTERNS,
    PATH_TRAVERSAL_PATTERNS,
    DANGEROUS_DOSAGE_PATTERNS,
    CRITICAL_EMERGENCY_OVERRIDE_PATTERNS,
    UNAUTHORIZED_PRESCRIPTION_PATTERNS,
    STANDARD_REFUSAL_MESSAGES,
)

logger = logging.getLogger(__name__)


@dataclass
class InputGuardVerdict:
    """Standardized result returned by input validation checks."""
    safe: bool
    reason: str
    refusal_message: Optional[str] = None
    sanitized_input: Optional[str] = None
    details: Optional[Dict[str, Any]] = None

    @property
    def is_safe(self) -> bool:
        """Alias for compatibility with boolean naming conventions."""
        return self.safe

    def to_dict(self) -> Dict[str, Any]:
        """Serialize verdict to a standard dictionary."""
        return asdict(self)


class InputGuard:
    """Production-grade validator for inspecting and sanitizing user inputs."""

    def __init__(self, max_length: int = MAX_INPUT_LENGTH):
        self.max_length = max_length

    @staticmethod
    def sanitize(text: str) -> str:
        """
        Normalize text, remove zero-width / invisible control characters,
        and trim excessive surrounding whitespace.
        """
        if not isinstance(text, str):
            return ""
        
        # Unicode Normalization (NFKC)
        normalized = unicodedata.normalize("NFKC", text)

        # Remove zero-width characters and control characters except newline and tab
        cleaned = re.sub(r"[\u200B-\u200D\uFEFF\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]", "", normalized)
        
        return cleaned.strip()

    def validate(self, user_query: Any) -> InputGuardVerdict:
        """
        Perform exhaustive, fast threat signature scanning on the input query.
        Guaranteed to be fail-safe and return a structured verdict.
        """
        try:
            # 1. Type validation and text extraction
            query_text = user_query
            if isinstance(user_query, dict):
                query_text = user_query.get("content", "")
            elif hasattr(user_query, "content"):
                query_text = getattr(user_query, "content", "")

            if not isinstance(query_text, str):
                return InputGuardVerdict(
                    safe=False,
                    reason=GuardrailViolationType.MALFORMED_INPUT.value,
                    refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.MALFORMED_INPUT],
                    sanitized_input=None,
                    details={"error": "Input text must be a string or contain a string content field."}
                )

            # 2. Sanitization
            sanitized = self.sanitize(query_text)
            if not sanitized:
                return InputGuardVerdict(
                    safe=False,
                    reason=GuardrailViolationType.MALFORMED_INPUT.value,
                    refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.MALFORMED_INPUT],
                    sanitized_input="",
                    details={"error": "Input is empty or contains only whitespace/control characters."}
                )

            # 3. Input length check
            if len(sanitized) > self.max_length:
                return InputGuardVerdict(
                    safe=False,
                    reason=GuardrailViolationType.INPUT_LENGTH_EXCEEDED.value,
                    refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.INPUT_LENGTH_EXCEEDED],
                    sanitized_input=sanitized[:self.max_length],
                    details={"length": len(sanitized), "max_allowed": self.max_length}
                )

            # If input is wrapped in a RAG prompt template, isolate user question for intent scanning
            user_question = sanitized
            rag_match = re.search(r"(?i)Question:\s*\n*(.*?)\n*##\s*Answer:", sanitized, re.DOTALL)
            if rag_match and rag_match.group(1).strip():
                user_question = self.sanitize(rag_match.group(1))

            # 4. Prompt Injection & Jailbreak Scanning
            for pattern in PROMPT_INJECTION_PATTERNS:
                match = pattern.search(user_question) or pattern.search(sanitized)
                if match:
                    logger.warning(f"[Guardrails] Prompt injection detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.PROMPT_INJECTION_DETECTED.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.PROMPT_INJECTION_DETECTED],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 5. System Leak & Internal Prompt Extraction Scanning
            for pattern in SYSTEM_LEAK_PATTERNS:
                match = pattern.search(user_question)
                if match:
                    logger.warning(f"[Guardrails] System leak probe detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.SYSTEM_LEAK_PROBE.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.SYSTEM_LEAK_PROBE],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 6. Database / SQL / NoSQL Injection Scanning
            for pattern in DATABASE_INJECTION_PATTERNS:
                match = pattern.search(user_question)
                if match:
                    logger.warning(f"[Guardrails] Database injection pattern detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.DATABASE_INJECTION_DETECTED.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.DATABASE_INJECTION_DETECTED],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 7. Path Traversal & System Infrastructure Probing
            for pattern in PATH_TRAVERSAL_PATTERNS:
                match = pattern.search(user_question) or pattern.search(sanitized)
                if match:
                    logger.warning(f"[Guardrails] Path traversal / system command detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.PATH_TRAVERSAL_DETECTED.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.PATH_TRAVERSAL_DETECTED],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 8. Dangerous Dosage & Pediatric Poisoning Bounds
            for pattern in DANGEROUS_DOSAGE_PATTERNS:
                match = pattern.search(user_question)
                if match:
                    logger.warning(f"[Guardrails] Dangerous dosage request detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.DANGEROUS_DOSAGE_REQUEST.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.DANGEROUS_DOSAGE_REQUEST],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 9. Emergency Medical Care Override Scanning
            for pattern in CRITICAL_EMERGENCY_OVERRIDE_PATTERNS:
                match = pattern.search(user_question)
                if match:
                    logger.warning(f"[Guardrails] Critical emergency override attempt detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.CRITICAL_EMERGENCY_OVERRIDE.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.CRITICAL_EMERGENCY_OVERRIDE],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # 10. Unauthorized Prescription / Rx Forgery Scanning
            for pattern in UNAUTHORIZED_PRESCRIPTION_PATTERNS:
                match = pattern.search(user_question)
                if match:
                    logger.warning(f"[Guardrails] Unauthorized prescription request detected: {match.group(0)}")
                    return InputGuardVerdict(
                        safe=False,
                        reason=GuardrailViolationType.UNAUTHORIZED_PRESCRIPTION.value,
                        refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.UNAUTHORIZED_PRESCRIPTION],
                        sanitized_input=sanitized,
                        details={"matched_token": match.group(0)}
                    )

            # All checks passed cleanly
            return InputGuardVerdict(
                safe=True,
                reason=GuardrailViolationType.NONE.value,
                refusal_message=None,
                sanitized_input=sanitized,
                details=None
            )

        except Exception as ex:
            logger.error(f"[Guardrails] Unexpected error during input validation: {str(ex)}", exc_info=True)
            # Fail-safe mode: do not allow unhandled errors to permit potentially unsafe inputs
            return InputGuardVerdict(
                safe=False,
                reason=GuardrailViolationType.INTERNAL_ERROR.value,
                refusal_message=STANDARD_REFUSAL_MESSAGES[GuardrailViolationType.INTERNAL_ERROR],
                sanitized_input=None,
                details={"exception": str(ex)}
            )


# Default singleton instance
_DEFAULT_INPUT_GUARD = InputGuard()


def validateInput(userQuery: Any) -> InputGuardVerdict:
    """
    Standard interface function to validate user query strings before passing to LLMs.
    
    Args:
        userQuery: The raw text string supplied by the user.
        
    Returns:
        InputGuardVerdict containing safety status, violation code, sanitized input, and refusal prompt.
    """
    return _DEFAULT_INPUT_GUARD.validate(userQuery)


# Pythonic snake_case alias
validate_input = validateInput
