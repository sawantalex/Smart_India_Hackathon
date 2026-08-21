from typing import Dict, Any

class ABDMAdapter:
    @staticmethod
    def verify_abha_number_mock(abha_number: str) -> Dict[str, Any]:
        """
        Interoperability-ready sandbox prototype for ABDM ABHA verification.
        Does NOT claim live NHA ABDM production certification.
        """
        return {
            "status": "SANDBOX_VERIFIED",
            "is_demo_mode": True,
            "label": "Interoperability-ready prototype",
            "abha_number": abha_number,
            "abha_address": f"{abha_number.replace('-', '')}@abdm.sandbox",
            "consent_status": "ACTIVE_CONSENT_GRANTED",
            "disclaimer": "This is a synthetic sandbox ABDM integration adapter for demonstration."
        }
