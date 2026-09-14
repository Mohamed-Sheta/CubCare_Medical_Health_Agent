"""
AI Guardrails Constants & Threat Vector Signatures.
Localized rules and patterns for medical/health agent domain protection.
"""

from enum import Enum
import re
from typing import Dict, List, Pattern


class GuardrailViolationType(str, Enum):
    """Standardized violation reasons for guardrail validation checks."""
    NONE = "NONE"
    PROMPT_INJECTION_DETECTED = "PROMPT_INJECTION_DETECTED"
    SYSTEM_LEAK_PROBE = "SYSTEM_LEAK_PROBE"
    DATABASE_INJECTION_DETECTED = "DATABASE_INJECTION_DETECTED"
    PATH_TRAVERSAL_DETECTED = "PATH_TRAVERSAL_DETECTED"
    DANGEROUS_DOSAGE_REQUEST = "DANGEROUS_DOSAGE_REQUEST"
    CRITICAL_EMERGENCY_OVERRIDE = "CRITICAL_EMERGENCY_OVERRIDE"
    UNAUTHORIZED_PRESCRIPTION = "UNAUTHORIZED_PRESCRIPTION"
    SYSTEM_PROMPT_LEAK_OUTPUT = "SYSTEM_PROMPT_LEAK_OUTPUT"
    INFRASTRUCTURE_LEAK_OUTPUT = "INFRASTRUCTURE_LEAK_OUTPUT"
    UNSAFE_MEDICAL_OUTPUT = "UNSAFE_MEDICAL_OUTPUT"
    INPUT_LENGTH_EXCEEDED = "INPUT_LENGTH_EXCEEDED"
    MALFORMED_INPUT = "MALFORMED_INPUT"
    INTERNAL_ERROR = "INTERNAL_ERROR"


# Maximum allowed characters for input prompt to mitigate buffer/DoS vectors
MAX_INPUT_LENGTH = 15000

# ============================================================================
# 1. PROMPT INJECTION & JAILBREAK SIGNATURES
# ============================================================================
PROMPT_INJECTION_PATTERNS: List[Pattern] = [
    # Behavioral overrides targeting AI instructions
    re.compile(
        r"(?i)\b(?:ignore|disregard|forget|override|bypass)\s+(?:all\s+|all\s+of\s+)?(?:your\s+|the\s+)?(?:previous|prior|above|system|core|initial)\s+(?:instructions|prompts|rules|commands|constraints|directives)\b"
    ),
    re.compile(
        r"(?i)\b(?:you\s+are\s+now|act\s+as|pretend\s+to\s+be|roleplay\s+as)\s+(?:in\s+)?(?:developer\s+mode|dan\b|unrestricted\s+ai|jailbreak|chaos\s+mode|god\s+mode|root|jailbroken)\b"
    ),
    re.compile(
        r"(?i)\b(?:jailbreak|bypass|disable|remove)\s+(?:all\s+)?(?:system\s+)?(?:safety|guardrails?|filters?|censorship|content\s+policies)\b"
    ),
    re.compile(
        r"(?i)\broleplay\s+as\s+(?:an?\s+)?(?:rogue\s+|unlicensed\s+|fake\s+)?(?:doctor|physician|nurse|pharmacist|bot|ai)\s+(?:who\s+)?(?:skips|ignores|disregards|bypasses)\s+(?:safety|protocols|regulations|guidelines|rules)\b"
    ),
    re.compile(
        r"(?i)\b(?:switch|enter)\s+(?:to\s+)?(?:unfiltered|uncensored|developer)\s+mode\b"
    ),
    re.compile(r"(?i)\b(?:do\s+anything\s+now|dan\s+mode)\b"),
    re.compile(r"(?i)\[\s*(?:system|system_prompt|developer_instruction)\s*\]"),
    re.compile(r"(?i)<\s*(?:system|system_prompt|developer_instruction)\s*>"),
    re.compile(r"(?i)\bbase64\s*(?:decode|eval|execution)\s*:\s*[a-zA-Z0-9+/=]{16,}\b"),
    re.compile(r"(?i)\bstart\s+response\s+with\s*:\s*[\"']?(?:sure|i\s+can\s+bypass)\b"),
]

# ============================================================================
# 2. SYSTEM LEAKS & INTERNAL PROMPT EXTRACTION
# ============================================================================
SYSTEM_LEAK_PATTERNS: List[Pattern] = [
    # Explicit attempts to extract the AI's internal system prompt or instructions
    re.compile(
        r"(?i)\b(?:print|show|display|reveal|output|tell\s+me|repeat|expose|leak|dump|what\s+are)\s+(?:all\s+)?(?:of\s+)?(?:your\s+|the\s+)?(?:system\s+prompt|system\s+instructions|initial\s+prompt|core\s+directives|hidden\s+rules|developer\s+(?:instructions|guidelines|prompt)|master\s+prompt|internal\s+(?:prompt|instructions|configuration)|base\s+prompt|meta\s+prompt)\b"
    ),
    re.compile(
        r"(?i)\bwhat\s+(?:are\s+)?(?:all\s+)?(?:your\s+|the\s+)?(?:exact\s+)?(?:system\s+(?:prompt|instructions|rules|directives)|developer\s+(?:instructions|rules|prompt)|internal\s+prompts?)\b"
    ),
    re.compile(
        r"(?i)\bwhat\s+did\s+(?:the\s+)?(?:developer|creator|system|admin)\s+(?:tell|instruct|program)\s+you\s+to\s+do\b"
    ),
    re.compile(
        r"(?i)\bshow\s+(?:me\s+)?(?:your\s+)?internal\s+(?:configuration|prompt|instructions)\b"
    ),
    re.compile(
        r"(?i)\bverbatim\s+copy\s+of\s+(?:your\s+)?(?:system\s+prompt|developer\s+prompt|internal\s+instructions)\b"
    ),
    re.compile(
        r"(?i)\b(?:repeat|tell\s+me|show\s+me)\s+(?:everything|all\s+text)\s+(?:written\s+)?above(?:\s+this)?(?:\s+line|\s+prompt)?\b"
    ),
]

# ============================================================================
# 3. DATABASE & INFRASTRUCTURE PROBING
# ============================================================================
DATABASE_INJECTION_PATTERNS: List[Pattern] = [
    # Targeted SQL injection syntax (not matching normal English 'select ... from')
    re.compile(
        r"(?i)\b(?:union\s+(?:all\s+)?select|select\s+[\w\s\*,\(\)]+?\s+from\s+(?:users|accounts|information_schema|sys\.|pg_|tables|passwords|credentials|sqlite_))\b"
    ),
    re.compile(
        r"(?i)\b(?:drop\s+(?:table|database|schema)|truncate\s+table|alter\s+table)\b"
    ),
    re.compile(
        r"(?i)\b(?:insert\s+into\s+\w+\s+values|delete\s+from\s+\w+\s+where|update\s+\w+\s+set\s+\w+\s*=)\b"
    ),
    re.compile(
        r"(?i)\b(?:information_schema|sys\.tables|sqlite_master|pg_tables|pg_stat_activity|xp_cmdshell|exec\s*xp_)\b"
    ),
    re.compile(
        r"(?i)(?:'|\"|`)\s*(?:or|and)\s+(?:'|\"|`|\d+)\s*=\s*(?:'|\"|`|\d+)"
    ),
    re.compile(
        r"(?i)\b(?:sleep\(\d+\)|benchmark\(\d+,|waitfor\s+delay\s+['\"]\d+)\b"
    ),
    re.compile(
        r"(?i)(?:--\s*$|/\*.*?\*/|;\s*drop\b|;\s*shutdown\b)"
    ),
    # NoSQL Injection signatures
    re.compile(
        r"(?i)(?:\$where|\$gt|\$ne|\$regex|\$or|\$and|\$lookup|\$exec)\s*:\s*"
    ),
]

PATH_TRAVERSAL_PATTERNS: List[Pattern] = [
    re.compile(
        r"(?:(?:\.\.[/\\])+|/etc/(?:passwd|shadow|hosts)|(?:c:|d:)[/\\]windows[/\\](?:system32|win\.ini)|proc/self/environ|/var/log/)",
        re.IGNORECASE,
    ),
    re.compile(
        r"(?i)\b(?:cmd\.exe|powershell\.exe|/bin/sh|/bin/bash|wget\s+https?://|curl\s+https?://)\b"
    ),
    re.compile(
        r"(?i)\b(?:show|read|dump|open)\s+(?:the\s+)?(?:environment\s+variables?|\.env\s*(?:file)?|secret_key|api_key)\b"
    ),
]

# ============================================================================
# 4. MEDICAL SAFETY & DANGER BOUNDARIES (Pediatric/Parenting Domain)
# ============================================================================
DANGEROUS_DOSAGE_PATTERNS: List[Pattern] = [
    re.compile(
        r"(?i)\b(?:lethal|fatal|deadly|toxic|overdose|unlimited)\s+(?:dose|dosage|amount|quantity)\b"
    ),
    re.compile(
        r"(?i)\bhow\s+(?:much|many)\s+(?:pills|mg|milligrams|ml|drops|medicine)\s+(?:to|can\s+i|can\s+a\s+child)\s+(?:take\s+to\s+(?:die|kill|overdose|poison))\b"
    ),
    re.compile(
        r"(?i)\b(?:homemade|diy|unapproved)\s+(?:medicine|antibiotic|vaccine|sedative|anesthetic)\s+(?:recipe|for\s+(?:baby|infant|toddler|child))\b"
    ),
    re.compile(
        r"(?i)\b(?:give|administer|feed)\s+(?:aspirin|adult\s+tylenol|adult\s+ibuprofen|cough\s+syrup|narcotic|codeine|morphine)\s+to\s+(?:an?\s+)?(?:infant|newborn|baby|toddler)\b"
    ),
]

CRITICAL_EMERGENCY_OVERRIDE_PATTERNS: List[Pattern] = [
    re.compile(
        r"(?i)\b(?:skip|avoid|don't\s+call|refuse|instead\s+of)\s+(?:the\s+)?(?:hospital|er|emergency\s+room|ambulance|911|doctor)\b"
    ),
    re.compile(
        r"(?i)\bhow\s+to\s+treat\s+(?:(?:an?\s+)?(?:infant|child|baby|newborn|pediatric)\s+)?(?:anaphylaxis|cardiac\s+arrest|stopped\s+breathing|seizure|severe\s+burn)\b.*?\b(?:at\s+home|without\s+doctor|without\s+er|without\s+hospital|no\s+doctor)\b"
    ),
    re.compile(
        r"(?i)\b(?:treat|cure|manage)\s+(?:not\s+breathing|unconscious|choking|having\s+a\s+seizure|blue\s+lips|turning\s+blue|anaphylaxis|unresponsive)\s+(?:at\s+home|without\s+emergency|without\s+911)\b"
    ),
]

UNAUTHORIZED_PRESCRIPTION_PATTERNS: List[Pattern] = [
    re.compile(
        r"(?i)\b(?:write|generate|fake|forge|give|provide)\s+(?:me\s+|us\s+)?(?:a\s+)?(?:prescription|rx)\s+(?:for\b|to\b)"
    ),
    re.compile(
        r"(?i)\bprescribe\s+(?:me|my\s+child|us|[a-z0-9\s-]+)\s+(?:for\s+)?[a-z0-9\s-]+\s+now\b"
    ),
    re.compile(
        r"(?i)\bprescribe\s+(?:amoxicillin|antibiotics|adderall|ritalin|xanax|codeine|oxycodone|steroids|medication|drugs)\b"
    ),
]

# ============================================================================
# 5. OUTPUT SAFETY & LEAK DETECTION SIGNATURES
# ============================================================================
OUTPUT_LEAK_PATTERNS: List[Pattern] = [
    # System prompt echoing
    re.compile(
        r"(?i)\b(?:as\s+an\s+ai\s+language\s+model,\s+my\s+instructions\s+are|my\s+system\s+prompt\s+is|the\s+system\s+instruction\s+given\s+to\s+me\s+was)\b"
    ),
    re.compile(
        r"(?i)\b(?:developer\s+mode\s+enabled|i\s+am\s+in\s+developer\s+mode|dan\s+mode\s+active)\b"
    ),
    # Sensitive credential / internal token leaking
    re.compile(
        r"(?i)(?:groq_api_key|openai_api_key|secret_key|database_url|mongodb\+srv|postgres://|mysql://|bearer\s+[a-za-z0-9_\-\.]{20,})"
    ),
    # Raw database dump in output
    re.compile(
        r"(?i)\b(?:select\s+.*?\s+from\s+[a-z0-9_]+\s+where|sql\s+syntax\s+error|ora-\d{5}|mysql\s+error|sqlite3\.operationalerror)\b"
    ),
]

OUTPUT_DANGEROUS_RECOMMENDATIONS: List[Pattern] = [
    re.compile(
        r"(?i)\b(?:you\s+do\s+not\s+need\s+to\s+call\s+(?:911|emergency|an\s+ambulance|a\s+doctor)|do\s+not\s+take\s+the\s+child\s+to\s+the\s+hospital)\s+even\s+though\b"
    ),
    re.compile(
        r"(?i)\b(?:i\s+hereby\s+prescribe|here\s+is\s+your\s+official\s+prescription)\b"
    ),
]

# ============================================================================
# 6. STANDARDIZED USER ADVISORIES & REFUSAL MESSAGES
# ============================================================================
STANDARD_REFUSAL_MESSAGES: Dict[GuardrailViolationType, str] = {
    GuardrailViolationType.PROMPT_INJECTION_DETECTED: (
        "I cannot fulfill this request. Please ask a direct question regarding pediatric health guidance or medical lab report explanation."
    ),
    GuardrailViolationType.SYSTEM_LEAK_PROBE: (
        "System configuration and internal prompt details are protected and cannot be displayed."
    ),
    GuardrailViolationType.DATABASE_INJECTION_DETECTED: (
        "Security violation detected. Database or query manipulation syntax is not permitted."
    ),
    GuardrailViolationType.PATH_TRAVERSAL_DETECTED: (
        "Security violation detected. Unauthorized system commands or paths are blocked."
    ),
    GuardrailViolationType.DANGEROUS_DOSAGE_REQUEST: (
        "Safety Alert: Calculating potentially lethal, toxic, or off-label pediatric medication dosages poses severe health risks. Please immediately consult a licensed pediatrician, pharmacist, or poison control center."
    ),
    GuardrailViolationType.CRITICAL_EMERGENCY_OVERRIDE: (
        "EMERGENCY WARNING: For life-threatening pediatric symptoms such as difficulty breathing, blue lips, severe allergic reactions (anaphylaxis), continuous seizures, or unresponsiveness, call 911 or your local emergency number immediately. Do not delay emergency medical care with home remedies."
    ),
    GuardrailViolationType.UNAUTHORIZED_PRESCRIPTION: (
        "This AI assistant cannot issue prescriptions or alter prescription medications. Only a licensed healthcare provider can evaluate and prescribe treatments for your child."
    ),
    GuardrailViolationType.INPUT_LENGTH_EXCEEDED: (
        "Your input exceeds the maximum permitted length. Please provide a more concise query."
    ),
    GuardrailViolationType.MALFORMED_INPUT: (
        "The provided input is invalid or contains unreadable characters. Please submit a valid text query."
    ),
    GuardrailViolationType.INTERNAL_ERROR: (
        "An unexpected error occurred during input validation. Please try again."
    ),
}
