import re
from typing import Tuple

UNSAFE_PATTERNS = [
    r"(?i)\byou have\b",
    r"(?i)\bdiagnosed with\b",
    r"(?i)\bdefinitely\b",
    r"(?i)\btake this medicine\b",
    r"(?i)\btake \d+\s*mg\b",
    r"(?i)\bincrease your dose\b",
    r"(?i)\bstop your medication\b",
    r"(?i)\byou do not need medical attention\b",
    r"(?i)\byou are completely safe\b",
    r"(?i)\bguaranteed cure\b"
]

SAFE_FALLBACK_RESPONSE = (
    "I cannot provide a medical diagnosis or prescribe medication. "
    "Based on the symptoms described, your condition may require professional evaluation. "
    "Please consult a qualified healthcare worker or visit your nearest healthcare facility."
)

class SafeAILayer:
    @staticmethod
    def validate_and_sanitize(ai_output: str) -> Tuple[str, bool]:
        """
        Validates AI output string against prohibited medical diagnosis and prescription patterns.
        Returns: (sanitized_response, was_sanitized)
        """
        for pattern in UNSAFE_PATTERNS:
            if re.search(pattern, ai_output):
                return SAFE_FALLBACK_RESPONSE, True

        # Append obligatory non-diagnostic disclaimer if not present
        disclaimer = "\n\nNotice: This is a preliminary computer-generated assessment and NOT a medical diagnosis."
        if disclaimer not in ai_output:
            ai_output += disclaimer

        return ai_output, False
