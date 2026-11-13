package com.internshield.backend.security;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.io.ByteArrayOutputStream;
import java.nio.ByteBuffer;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class TwoFactorService {

    private static final char[] BASE32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();

    public String newSecret() {
        byte[] bytes = new byte[20];
        RANDOM.nextBytes(bytes);
        return encodeBase32(bytes);
    }

    public String provisioningUri(String email, String secret) {
        String issuer = "InternShield";
        String label = issuer + ":" + email;
        return "otpauth://totp/" + urlEncode(label) + "?secret=" + secret
                + "&issuer=" + urlEncode(issuer) + "&algorithm=SHA1&digits=6&period=30";
    }

    public String qrCodeDataUrl(String uri) {
        try {
            BitMatrix matrix = new QRCodeWriter().encode(uri, BarcodeFormat.QR_CODE, 240, 240);
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(matrix, "PNG", output);
            return "data:image/png;base64," + Base64.getEncoder().encodeToString(output.toByteArray());
        } catch (Exception e) {
            throw new IllegalStateException("Could not create the authenticator QR code.", e);
        }
    }

    public boolean verify(String secret, String code) {
        if (secret == null || code == null || !code.matches("\\d{6}")) return false;
        long counter = System.currentTimeMillis() / 30_000L;
        for (long offset = -1; offset <= 1; offset++) {
            if (generateCode(secret, counter + offset).equals(code)) return true;
        }
        return false;
    }

    String generateCode(String secret, long counter) {
        try {
            byte[] key = decodeBase32(secret);
            Mac mac = Mac.getInstance("HmacSHA1");
            mac.init(new SecretKeySpec(key, "HmacSHA1"));
            byte[] hash = mac.doFinal(ByteBuffer.allocate(Long.BYTES).putLong(counter).array());
            int offset = hash[hash.length - 1] & 0x0f;
            int binary = ((hash[offset] & 0x7f) << 24)
                    | ((hash[offset + 1] & 0xff) << 16)
                    | ((hash[offset + 2] & 0xff) << 8)
                    | (hash[offset + 3] & 0xff);
            return String.format(java.util.Locale.ROOT, "%06d", binary % 1_000_000);
        } catch (Exception e) {
            throw new IllegalStateException("Could not verify the authenticator code.", e);
        }
    }

    private static String encodeBase32(byte[] input) {
        StringBuilder output = new StringBuilder();
        int buffer = 0;
        int bitsLeft = 0;
        for (byte value : input) {
            buffer = (buffer << 8) | (value & 0xff);
            bitsLeft += 8;
            while (bitsLeft >= 5) {
                output.append(BASE32[(buffer >>> (bitsLeft - 5)) & 31]);
                bitsLeft -= 5;
            }
        }
        if (bitsLeft > 0) output.append(BASE32[(buffer << (5 - bitsLeft)) & 31]);
        return output.toString();
    }

    private static byte[] decodeBase32(String value) {
        ByteArrayOutputStream output = new ByteArrayOutputStream();
        int buffer = 0;
        int bitsLeft = 0;
        for (char character : value.toUpperCase().toCharArray()) {
            if (character == '=') continue;
            int index = new String(BASE32).indexOf(character);
            if (index < 0) throw new IllegalArgumentException("Invalid TOTP secret.");
            buffer = (buffer << 5) | index;
            bitsLeft += 5;
            if (bitsLeft >= 8) {
                output.write((buffer >>> (bitsLeft - 8)) & 0xff);
                bitsLeft -= 8;
            }
        }
        return output.toByteArray();
    }

    private static String urlEncode(String value) {
        return java.net.URLEncoder.encode(value, StandardCharsets.UTF_8).replace("+", "%20");
    }
}
