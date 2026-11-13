package com.internshield.backend.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TwoFactorServiceTest {

    private final TwoFactorService service = new TwoFactorService();

    @Test
    void acceptsCurrentTimeBasedCodeAndRejectsAnInvalidCode() {
        String secret = service.newSecret();
        long counter = System.currentTimeMillis() / 30_000L;
        String code = service.generateCode(secret, counter);
        String invalidCode = code.charAt(0) == '0' ? "1" + code.substring(1) : "0" + code.substring(1);

        assertTrue(service.verify(secret, code));
        assertFalse(service.verify(secret, invalidCode));
    }

    @Test
    void createsAuthenticatorProvisioningUri() {
        String uri = service.provisioningUri("student@example.com", "JBSWY3DPEHPK3PXP");

        assertTrue(uri.startsWith("otpauth://totp/InternShield%3Astudent%40example.com?"));
        assertTrue(uri.contains("secret=JBSWY3DPEHPK3PXP"));
        assertTrue(uri.contains("issuer=InternShield"));
    }
}
