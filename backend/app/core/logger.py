import logging
import re
from typing import Any

# Patterns to redact sensitive data from logs
REDACT_PATTERNS = [
    (r'(?i)"password"\s*:\s*"[^"]+"', '"password": "[REDACTED]"'),
    (r'(?i)"token"\s*:\s*"[^"]+"', '"token": "[REDACTED]"'),
    (r'(?i)"access_token"\s*:\s*"[^"]+"', '"access_token": "[REDACTED]"'),
    (r'(?i)"phone"\s*:\s*"[^"]+"', '"phone": "[REDACTED]"'),
    (r'(?i)"aadhaar"\s*:\s*"[^"]+"', '"aadhaar": "[REDACTED]"'),
    (r'(?i)"symptoms"\s*:\s*\[[^\]]+\]', '"symptoms": "[PHI_REDACTED]"'),
]

class RedactingFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        formatted = super().format(record)
        for pattern, replacement in REDACT_PATTERNS:
            formatted = re.sub(pattern, replacement, formatted)
        return formatted

def setup_logger() -> logging.Logger:
    logger = logging.getLogger("his_system")
    logger.setLevel(logging.INFO)

    if not logger.handlers:
        handler = logging.StreamHandler()
        formatter = RedactingFormatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger

logger = setup_logger()
