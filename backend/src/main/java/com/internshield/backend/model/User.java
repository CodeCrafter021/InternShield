package com.internshield.backend.model;

import jakarta.persistence.*;

/**
 * Minimal account record. This is ALL we store about a person:
 * email, display name, (bcrypt hash OR social provider id) and avatar URL.
 * No offer letters, no scan history, no IP addresses.
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
}
