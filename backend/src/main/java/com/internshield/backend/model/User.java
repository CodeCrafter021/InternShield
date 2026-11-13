package com.internshield.backend.model;

import jakarta.persistence.*;

/**
 * Account identity, credential, authenticator enrollment, and account preferences.
 * Activity and scan history are stored separately and do not include an IP address.
 */
@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    /** bcrypt hash. NULL for accounts that only use Google/GitHub. */
    @Column
    private String password;

    @Column
    private String name;

    /** "password", "google" or "github" (how the account was first created) */
    @Column
    private String provider = "password";

    @Column
    private String providerId;

    @Column(length = 500)
    private String avatarUrl;

    @Column(length = 64)
    private String totpSecret;

    @Column(length = 64)
    private String pendingTotpSecret;

    @Column(nullable = false)
    private boolean twoFactorEnabled;

    @Column(length = 4000)
    private String settingsJson = "{}";

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getProviderId() { return providerId; }
    public void setProviderId(String providerId) { this.providerId = providerId; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getTotpSecret() { return totpSecret; }
    public void setTotpSecret(String totpSecret) { this.totpSecret = totpSecret; }
    public String getPendingTotpSecret() { return pendingTotpSecret; }
    public void setPendingTotpSecret(String pendingTotpSecret) { this.pendingTotpSecret = pendingTotpSecret; }
    public boolean isTwoFactorEnabled() { return twoFactorEnabled; }
    public void setTwoFactorEnabled(boolean twoFactorEnabled) { this.twoFactorEnabled = twoFactorEnabled; }
    public String getSettingsJson() { return settingsJson; }
    public void setSettingsJson(String settingsJson) { this.settingsJson = settingsJson; }
}
